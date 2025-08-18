'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

type SurveyResponse = {
  _id: string;
  doctorName: string;
  hospitalName: string;
  specialty: string;
  specialtyOther?: string;
  yearsOfPractice: string;
  practiceSetting: string;
  managedThyroidPatients: string;
  familiarWithMWA: string;
  learnedAboutMWA?: string;
  learnedAboutMWAOther?: string;
  mwaIndications?: string[];
  mwaComparison?: string;
  contraindications?: string;
  mwaExperience?: string;
  procedureCount?: string;
  observedOutcomes?: string[];
  complications?: string[];
  complicationsOther?: string;
  mwaViableAlternative?: string;
  adoptionFactors?: string[];
  attendWorkshop?: string;
  additionalComments?: string;
  receiveUpdates?: string;
  contactEmail?: string;
  mwaInterest?: string;
  mwaLearnMethod?: string[];
  mwaLearnOther?: string;
  mwaAttendCME?: string;
  mwaConcerns?: string[];
  mwaConcernOther?: string;
  mwaReceiveResources?: string;
  mwaResourceEmail?: string;
  __v?: number;
};

function DoctorDetailsContent() {
  const searchParams = useSearchParams();
  const responseData = searchParams.get('data');
  
  let response: SurveyResponse | null = null;
  
  if (responseData) {
    try {
      response = JSON.parse(decodeURIComponent(responseData));
    } catch (error) {
      console.error('Error parsing response data:', error);
    }
  }

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not provided';
    }
    return value || 'Not provided';
  };

  const capitalize = (text: string) => {
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!response) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h1>
            <p className="text-gray-600 mb-8">No survey response data was provided.</p>
            <Link 
              href="/admin/responses"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/responses"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Doctor Survey Details</h1>
            <p className="text-blue-100">Comprehensive view of survey response</p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Doctor Name</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {response.doctorName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Hospital/Institution</label>
                <p className="text-lg text-gray-800 mt-1">
                  {response.hospitalName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Specialty</label>
                <p className="text-gray-800 mt-1">
                  {capitalize(response.specialty)}
                  {response.specialtyOther && ` (${response.specialtyOther})`}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Years of Practice</label>
                <p className="text-gray-800 mt-1">{response.yearsOfPractice}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Practice Setting</label>
                <p className="text-gray-800 mt-1">{capitalize(response.practiceSetting)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Manages Thyroid Patients</label>
                <p className="text-gray-800 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    response.managedThyroidPatients === 'yes' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {capitalize(response.managedThyroidPatients)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* MWA Knowledge */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              MWA Knowledge & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Familiar with MWA</label>
                <p className="text-gray-800 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    response.familiarWithMWA === 'yes' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {capitalize(response.familiarWithMWA)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">How Learned About MWA</label>
                <p className="text-gray-800 mt-1">{capitalize(formatValue(response.learnedAboutMWA))}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Has MWA Experience</label>
                <p className="text-gray-800 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    response.mwaExperience === 'yes' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {capitalize(formatValue(response.mwaExperience))}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Procedure Count</label>
                <p className="text-gray-800 mt-1 font-mono text-lg">
                  {response.procedureCount || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Opinions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Clinical Opinions
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">MWA Indications</label>
                <p className="text-gray-800 mt-1">{formatValue(response.mwaIndications)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">MWA vs Traditional Methods</label>
                <p className="text-gray-800 mt-1">{capitalize(formatValue(response.mwaComparison))}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contraindications/Concerns</label>
                <p className="text-gray-800 mt-1 bg-gray-50 p-4 rounded-lg">
                  {response.contraindications || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Observed Outcomes</label>
                <p className="text-gray-800 mt-1">{formatValue(response.observedOutcomes)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Complications Encountered</label>
                <p className="text-gray-800 mt-1">{formatValue(response.complications)}</p>
              </div>
            </div>
          </div>

          {/* Future Interest */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Future Interest & Adoption
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">MWA Viable Alternative</label>
                <p className="text-gray-800 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    response.mwaViableAlternative === 'yes' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {capitalize(formatValue(response.mwaViableAlternative))}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Attend Workshop</label>
                <p className="text-gray-800 mt-1">{capitalize(formatValue(response.attendWorkshop))}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Adoption Factors</label>
                <p className="text-gray-800 mt-1">{formatValue(response.adoptionFactors)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Learning Methods</label>
                <p className="text-gray-800 mt-1">{formatValue(response.mwaLearnMethod)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-800 mt-1">{response.contactEmail || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Receive Updates</label>
                <p className="text-gray-800 mt-1">{capitalize(formatValue(response.receiveUpdates))}</p>
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Additional Comments
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                {response.additionalComments || 'No additional comments provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading doctor details...</div>
      </div>
    }>
      <DoctorDetailsContent />
    </Suspense>
  );
}
