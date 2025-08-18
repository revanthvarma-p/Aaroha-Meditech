import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/mongodb';
import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({}, { strict: false });
const Survey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const responses = await Survey.find().lean();
    return NextResponse.json({ success: true, data: responses });
  } catch (error: any) {
    console.error('API /api/admin/responses error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch responses' }, { status: 500 });
  }
}
