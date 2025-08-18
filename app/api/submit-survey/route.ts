

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb';
import mongoose from 'mongoose';
import { z } from 'zod';

const surveySchema = new mongoose.Schema({}, { strict: false });
const Survey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);

const SurveyDataSchema = z.object({
  doctorName: z.string().min(1),
  hospitalName: z.string().min(1),
  specialty: z.string().min(1),
  yearsOfPractice: z.string().min(1),
  practiceSetting: z.string().min(1),
  managedThyroidPatients: z.string().min(1),
  familiarWithMWA: z.string().min(1),
  // ...add more fields as needed, or use z.record(z.any()) for flexible validation
});

export async function POST(req: NextRequest) {
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = SurveyDataSchema.safeParse(data);
  if (!validation.success) {
    return NextResponse.json({ success: false, error: 'Invalid survey data', details: validation.error.errors }, { status: 400 });
  }

  try {
    await dbConnect();
    const survey = new Survey(data);
    await survey.save();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save survey' }, { status: 500 });
  }
}
