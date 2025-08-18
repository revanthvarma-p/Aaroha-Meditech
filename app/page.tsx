"use client"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import { AuroraBackground } from "@/components/AuroraBackground"
import { MotionFadeIn } from "@/components/MotionFadeIn"
import { CheckCircle } from "lucide-react"
import { FlickeringGrid } from "@/components/FlickeringGrid"
import { cn } from "@/lib/utils"
import { useEffect } from "react"


export default function ThyroidSurvey() {
  const [formData, setFormData] = useState({
    doctorName: "",
    hospitalName: "",
    specialty: "",
    specialtyOther: "",
    yearsOfPractice: "",
    practiceSetting: "",
    managedThyroidPatients: "",
    familiarWithMWA: "",
    learnedAboutMWA: "",
    learnedAboutMWAOther: "",
    mwaIndications: [] as string[],
    mwaComparison: "",
    contraindications: "",
    mwaExperience: "",
    procedureCount: "",
    observedOutcomes: [] as string[],
    complications: [] as string[],
    complicationsOther: "",
    mwaViableAlternative: "",
    adoptionFactors: [] as string[],
    attendWorkshop: "",
    additionalComments: "",
    receiveUpdates: "",
    contactEmail: "",
    // Fields for MWAInfo alternate section
    mwaInterest: "",
    mwaLearnMethod: [] as string[],
    mwaLearnOther: "",
    mwaAttendCME: "",
    mwaConcerns: [] as string[],
    mwaConcernOther: "",
    mwaReceiveResources: "",
    mwaResourceEmail: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [section, setSection] = useState<'A' | 'B' | 'C' | 'D' | 'Consent' | 'MWAInfo' | 'MWAConsent'>('A')

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Next button logic with branching after Section A
  const handleNext = (currentSection: string) => {
    if (currentSection === 'A') {
      if (formData.familiarWithMWA === 'no') {
        setSection('MWAInfo');
        return;
      } else {
        setSection('B');
        return;
      }
    }
    if (currentSection === 'MWAInfo') setSection('MWAConsent');
    if (currentSection === 'MWAConsent') setIsSubmitted(true);
    if (currentSection === 'B') setSection('C');
    if (currentSection === 'C') setSection('D');
    if (currentSection === 'D') setSection('Consent');
    if (currentSection === 'Consent') setIsSubmitted(true);
  };

  const handlePrev = (currentSection: string) => {
    if (currentSection === 'B') setSection('A');
    if (currentSection === 'C') setSection('B');
    if (currentSection === 'D') setSection('C');
    if (currentSection === 'Consent') setSection('D');
    if (currentSection === 'MWAInfo') setSection('A');
    if (currentSection === 'MWAConsent') setSection('MWAInfo');
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const requiredFields: { [key: string]: string } = {
    doctorName: "Doctor's Name",
    hospitalName: "Hospital/Institution",
    specialty: "Specialty",
    yearsOfPractice: "Years of Clinical Practice",
    practiceSetting: "Practice Setting",
    managedThyroidPatients: "Managed Thyroid Patients",
    familiarWithMWA: "Familiar with MWA",
  };

  // If familiarWithMWA is yes, require all section B fields
  if (formData.familiarWithMWA === "yes") {
    requiredFields.learnedAboutMWA = "How did you learn about MWA";
    requiredFields.mwaIndications = "MWA Indications";
    requiredFields.mwaComparison = "MWA Comparison";
    requiredFields.contraindications = "Contraindications";
  }

  // If in Consent section, require consent
  if (section === 'Consent') {
    requiredFields.receiveUpdates = "Consent";
  }

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    for (const key in requiredFields) {
      if (
        (Array.isArray(formData[key as keyof typeof formData]) && (formData[key as keyof typeof formData] as string[]).length === 0) ||
        (!Array.isArray(formData[key as keyof typeof formData]) && !formData[key as keyof typeof formData])
      ) {
        setFormError(`Please fill out the required field: ${requiredFields[key]}`);
        return;
      }
    }
    setFormError(null);
    try {
      const res = await fetch("/api/submit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        setFormError("Submission failed. Please try again.");
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      setFormError("Submission failed. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
              <p className="text-gray-600">Your survey response has been submitted successfully.</p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-50 overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10 w-full h-full overflow-auto">
        <div className="w-[80vw] max-w-8xl mx-auto px-4 sm:px-8 py-18">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-900">
                Survey Questionnaire: Microwave Ablation Therapy for Thyroid
              </CardTitle>
              <CardDescription className="text-lg">For Medical Professionals</CardDescription>
            </CardHeader>
          </Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {formError}
              </div>
            )}
            {section === 'A' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Section A: Respondent Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ...existing code for Section A up to question 4... */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="doctor-name" className="text-base font-medium mb-1 block">Doctor's Name:</Label>
                      <Input
                        id="doctor-name"
                        value={formData.doctorName}
                        onChange={e => handleInputChange("doctorName", e.target.value)}
                        placeholder="Please enter your full name, Doctor"
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="hospital-name" className="text-base font-medium mb-1 block">Hospital/Institution:</Label>
                      <Input
                        id="hospital-name"
                        value={formData.hospitalName}
                        onChange={e => handleInputChange("hospitalName", e.target.value)}
                        placeholder="Please enter your hospital or institution name"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">1. Specialty:</Label>
                    <RadioGroup value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endocrinologist" id="endocrinologist" />
                        <Label htmlFor="endocrinologist">Endocrinologist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ent" id="ent" />
                        <Label htmlFor="ent">ENT Specialist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="surgeon" id="surgeon" />
                        <Label htmlFor="surgeon">General Surgeon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="radiologist" id="radiologist" />
                        <Label htmlFor="radiologist">Radiologist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cardiologist" id="cardiologist" />
                        <Label htmlFor="cardiologist">Cardiologist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="specialty-other" />
                        <Label htmlFor="specialty-other">Other:</Label>
                        <Input
                          className="ml-2 w-48"
                          value={formData.specialtyOther}
                          onChange={(e) => handleInputChange("specialtyOther", e.target.value)}
                          disabled={formData.specialty !== "other"}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">2. Years of Clinical Practice:</Label>
                    <RadioGroup
                      value={formData.yearsOfPractice}
                      onValueChange={(value) => handleInputChange("yearsOfPractice", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="<5" id="years-1" />
                        <Label htmlFor="years-1">{"< 5 years"}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5-10" id="years-2" />
                        <Label htmlFor="years-2">5-10 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10-20" id="years-3" />
                        <Label htmlFor="years-3">10-20 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value=">20" id="years-4" />
                        <Label htmlFor="years-4">{"> 20 years"}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">3. Practice Setting:</Label>
                    <RadioGroup
                      value={formData.practiceSetting}
                      onValueChange={(value) => handleInputChange("practiceSetting", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="government" id="government" />
                        <Label htmlFor="government">Government Hospital</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private Hospital</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clinic" id="clinic" />
                        <Label htmlFor="clinic">Clinic/Nursing Home</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="academic" id="academic" />
                        <Label htmlFor="academic">Academic Institution</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      4. Have you managed patients with thyroid nodules, Doctor?
                    </Label>
                    <RadioGroup
                      value={formData.managedThyroidPatients}
                      onValueChange={(value) => handleInputChange("managedThyroidPatients", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="managed-yes" />
                        <Label htmlFor="managed-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="managed-no" />
                        <Label htmlFor="managed-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Moved from Section B: */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5. Are you familiar with Microwave Ablation (MWA) for thyroid nodules, Doctor?
                    </Label>
                    <RadioGroup
                      value={formData.familiarWithMWA}
                      onValueChange={(value) => handleInputChange("familiarWithMWA", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="familiar-yes" />
                        <Label htmlFor="familiar-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="familiar-no" />
                        <Label htmlFor="familiar-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => handleNext('A')}>
                      Next
                    </Button>
                  </div>

                </CardContent>
              </Card>
            )}
            {section === 'MWAInfo' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">If you answered "No" to Question 5, please answer the following:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 5a */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5a. Are you interested in learning more about Microwave Ablation (MWA) for thyroid nodules?
                    </Label>
                    <RadioGroup
                      value={formData.mwaInterest}
                      onValueChange={value => handleInputChange("mwaInterest", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mwa-interest-yes" />
                        <Label htmlFor="mwa-interest-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="mwa-interest-maybe" />
                        <Label htmlFor="mwa-interest-maybe">Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mwa-interest-no" />
                        <Label htmlFor="mwa-interest-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* 5b */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5b. What is your preferred method for learning about new medical technologies?
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "workshops", label: "Workshops/Hands-on training" },
                        { value: "online", label: "Online courses/webinars" },
                        { value: "literature", label: "Reading medical literature" },
                        { value: "colleagues", label: "Discussions with colleagues" },
                        { value: "other", label: "Other" },
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mwa-learn-${option.value}`}
                            checked={Array.isArray(formData.mwaLearnMethod) && formData.mwaLearnMethod.includes(option.value)}
                            onCheckedChange={checked => handleCheckboxChange("mwaLearnMethod", option.value, checked as boolean)}
                          />
                          <Label htmlFor={`mwa-learn-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                      <Input
                        className="ml-2 w-64 mt-2"
                        value={formData.mwaLearnOther || ''}
                        onChange={e => handleInputChange("mwaLearnOther", e.target.value)}
                        placeholder="Other (please specify)"
                        disabled={!(Array.isArray(formData.mwaLearnMethod) && formData.mwaLearnMethod.includes("other"))}
                      />
                    </div>
                  </div>
                  {/* 5c */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5c. Would you consider attending a CME session or workshop on MWA if offered?
                    </Label>
                    <RadioGroup
                      value={formData.mwaAttendCME}
                      onValueChange={value => handleInputChange("mwaAttendCME", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mwa-cme-yes" />
                        <Label htmlFor="mwa-cme-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="mwa-cme-maybe" />
                        <Label htmlFor="mwa-cme-maybe">Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mwa-cme-no" />
                        <Label htmlFor="mwa-cme-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* 5d */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5d. What are your main concerns or questions about MWA for thyroid nodules?
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "safety", label: "Safety" },
                        { value: "effectiveness", label: "Effectiveness" },
                        { value: "cost", label: "Cost" },
                        { value: "availability", label: "Availability" },
                        { value: "other", label: "Other" },
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mwa-concern-${option.value}`}
                            checked={Array.isArray(formData.mwaConcerns) && formData.mwaConcerns.includes(option.value)}
                            onCheckedChange={checked => handleCheckboxChange("mwaConcerns", option.value, checked as boolean)}
                          />
                          <Label htmlFor={`mwa-concern-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                      <Input
                        className="ml-2 w-64 mt-2"
                        value={formData.mwaConcernOther || ''}
                        onChange={e => handleInputChange("mwaConcernOther", e.target.value)}
                        placeholder="Other (please specify)"
                        disabled={!(Array.isArray(formData.mwaConcerns) && formData.mwaConcerns.includes("other"))}
                      />
                    </div>
                  </div>
                  {/* 5e */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      5e. Would you like to receive educational resources or updates about MWA?
                    </Label>
                    <RadioGroup
                      value={formData.mwaReceiveResources}
                      onValueChange={value => handleInputChange("mwaReceiveResources", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mwa-resources-yes" />
                        <Label htmlFor="mwa-resources-yes">Yes (please provide your contact/email):</Label>
                        <Input
                          className="ml-2 w-64"
                          value={formData.mwaResourceEmail || ''}
                          onChange={e => handleInputChange("mwaResourceEmail", e.target.value)}
                          placeholder="Email address"
                          disabled={formData.mwaReceiveResources !== "yes"}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mwa-resources-no" />
                        <Label htmlFor="mwa-resources-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Resources */}
                  <div className="pt-4">
                    <Label className="text-base font-medium mb-3 block">
                      For more information on Microwave Ablation for thyroid nodules, you may find these resources helpful:
                    </Label>
                    <ul className="list-disc pl-6 text-blue-700 underline">
                      <li>
                        <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10143080/" target="_blank" rel="noopener noreferrer">
                          1. Absolute Beginner / Full Review<br />
                          Microwave ablation for thyroid nodules: a new string to the bow for percutaneous treatments? (PMC) ↗
                        </a>
                      </li>
                      <li>
                        <a href="https://pubmed.ncbi.nlm.nih.gov/32441697/" target="_blank" rel="noopener noreferrer">
                          2. Clinical Deep Dive / How It’s Done<br />
                          Microwave ablation of benign thyroid nodules (PubMed) ↗
                        </a>
                      </li>
                      <li>
                        <a href="https://www.frontiersin.org/articles/10.3389/fendo.2022.1012347/full" target="_blank" rel="noopener noreferrer">
                          3. Long-Term Results / Real Patient Data<br />
                          Long-term outcome of microwave ablation for benign thyroid nodules: Over 48-month follow-up study (Frontiers in Endocrinology) ↗
                        </a>
                      </li>
                      <li>
                        <a href="https://cambridgeinterventional.com/rfa-vs-mwa-best-treatment-for-benign-thyroid-nodules/" target="_blank" rel="noopener noreferrer">
                          4. Quick Comparison: MWA vs. RFA<br />
                          RFA vs. MWA: Best Treatment for Benign Thyroid Nodules (Cambridge Interventional) ↗
                        </a>
                      </li>
                      <li>
                        <a href="https://www.kjronline.org/DOIx.php?id=10.3348/kjr.2020.0197" target="_blank" rel="noopener noreferrer">
                          5. Guidelines & Meta-Analysis<br />
                          A Systematic Review and Meta-Analysis (Korean Journal of Radiology) ↗
                        </a>
                      </li>
                      <li>
                        <a href="https://www.intechopen.com/chapters/64670" target="_blank" rel="noopener noreferrer">
                          6. Hands-On/Training Guide<br />
                          Local Ablation of Thyroid Nodules (IntechOpen) ↗
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => handlePrev('MWAInfo')}>
                      Previous
                    </Button>
                    <Button type="button" size="lg" className="px-8" onClick={() => handleNext('MWAInfo')}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {section === 'B' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Section B: Awareness & Knowledge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ...existing code for Section B, now starting from question 6... */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">6. How did you first learn about MWA?</Label>
                    <RadioGroup
                      value={formData.learnedAboutMWA}
                      onValueChange={(value) => handleInputChange("learnedAboutMWA", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="literature" id="literature" />
                        <Label htmlFor="literature">Medical literature</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conference" id="conference" />
                        <Label htmlFor="conference">Conference</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="colleague" id="colleague" />
                        <Label htmlFor="colleague">Colleague</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="representative" id="representative" />
                        <Label htmlFor="representative">Medical device representative</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-learn" id="other-learn" />
                        <Label htmlFor="other-learn">Other:</Label>
                        <Input
                          className="ml-2 w-48"
                          value={formData.learnedAboutMWAOther}
                          onChange={(e) => handleInputChange("learnedAboutMWAOther", e.target.value)}
                          disabled={formData.learnedAboutMWA !== "other-learn"}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      7. In your opinion, Doctor, what are the indications for MWA in thyroid treatment?
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "benign", label: "Benign thyroid nodules" },
                        { value: "cysts", label: "Recurrent thyroid cysts" },
                        { value: "cancer", label: "Thyroid cancer (selected cases)" },
                        { value: "cosmetic", label: "Cosmetic concerns" },
                        { value: "not-sure", label: "Not sure" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`indication-${option.value}`}
                            checked={formData.mwaIndications.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("mwaIndications", option.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={`indication-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      8. How would you compare MWA to other thermal ablation techniques (e.g., RFA, laser), Doctor?
                    </Label>
                    <RadioGroup
                      value={formData.mwaComparison}
                      onValueChange={(value) => handleInputChange("mwaComparison", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="more-effective" id="more-effective" />
                        <Label htmlFor="more-effective">More effective</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equally-effective" id="equally-effective" />
                        <Label htmlFor="equally-effective">Equally effective</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="less-effective" id="less-effective" />
                        <Label htmlFor="less-effective">Less effective</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="insufficient-data" id="insufficient-data" />
                        <Label htmlFor="insufficient-data">Insufficient data</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="contraindications" className="text-base font-medium mb-3 block">
                      9. What are the contraindications or limitations you associate with MWA, Doctor?
                    </Label>
                    <Textarea
                      id="contraindications"
                      value={formData.contraindications}
                      onChange={(e) => handleInputChange("contraindications", e.target.value)}
                      placeholder="Please describe any contraindications or limitations..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('A')}>
                      Previous
                    </Button>
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('C')}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Section C, D, Consent, etc. would go here as additional cards, following the same pattern */}
            {section === 'C' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Section C: Experience with MWA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      10. Have you personally performed MWA procedures, Doctor?
                    </Label>
                    <RadioGroup
                      value={formData.mwaExperience}
                      onValueChange={(value) => handleInputChange("mwaExperience", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mwa-exp-yes" />
                        <Label htmlFor="mwa-exp-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mwa-exp-no" />
                        <Label htmlFor="mwa-exp-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      11. If yes, approximately how many MWA procedures have you performed?
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.procedureCount}
                      onChange={e => handleInputChange("procedureCount", e.target.value)}
                      placeholder="Enter number of procedures"
                      className="w-64"
                      disabled={formData.mwaExperience !== "yes"}
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      12. What outcomes have you observed in your patients? (Select all that apply)
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "nodule-reduction", label: "Significant nodule reduction" },
                        { value: "symptom-relief", label: "Symptom relief" },
                        { value: "no-change", label: "No significant change" },
                        { value: "complications", label: "Complications" },
                        { value: "other", label: "Other" },
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`outcome-${option.value}`}
                            checked={formData.observedOutcomes.includes(option.value)}
                            onCheckedChange={checked => handleCheckboxChange("observedOutcomes", option.value, checked as boolean)}
                          />
                          <Label htmlFor={`outcome-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      13. What complications have you encountered? (Select all that apply)
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "pain", label: "Pain" },
                        { value: "bleeding", label: "Bleeding" },
                        { value: "infection", label: "Infection" },
                        { value: "nerve-injury", label: "Nerve injury" },
                        { value: "other", label: "Other (please specify)" },
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`complication-${option.value}`}
                            checked={formData.complications.includes(option.value)}
                            onCheckedChange={checked => handleCheckboxChange("complications", option.value, checked as boolean)}
                          />
                          <Label htmlFor={`complication-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                      <Input
                        className="ml-2 w-64 mt-2"
                        value={formData.complicationsOther}
                        onChange={e => handleInputChange("complicationsOther", e.target.value)}
                        placeholder="Other complications (please specify)"
                        disabled={!formData.complications.includes("other")}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('B')}>
                      Previous
                    </Button>
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('D')}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {section === 'D' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Section D: Attitudes & Adoption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      14. Do you consider MWA a viable alternative to surgery for benign thyroid nodules?
                    </Label>
                    <RadioGroup
                      value={formData.mwaViableAlternative}
                      onValueChange={value => handleInputChange("mwaViableAlternative", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mwa-alt-yes" />
                        <Label htmlFor="mwa-alt-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mwa-alt-no" />
                        <Label htmlFor="mwa-alt-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-sure" id="mwa-alt-not-sure" />
                        <Label htmlFor="mwa-alt-not-sure">Not sure</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      15. What factors would influence your adoption of MWA? (Select all that apply)
                    </Label>
                    <div className="space-y-2">
                      {[
                        { value: "training", label: "Availability of training" },
                        { value: "cost", label: "Cost considerations" },
                        { value: "evidence", label: "Clinical evidence" },
                        { value: "peer", label: "Peer recommendations" },
                        { value: "infrastructure", label: "Hospital infrastructure" },
                        { value: "other", label: "Other" },
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`adoption-${option.value}`}
                            checked={formData.adoptionFactors.includes(option.value)}
                            onCheckedChange={checked => handleCheckboxChange("adoptionFactors", option.value, checked as boolean)}
                          />
                          <Label htmlFor={`adoption-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      16. Would you be interested in attending a workshop or training session on MWA?
                    </Label>
                    <RadioGroup
                      value={formData.attendWorkshop}
                      onValueChange={value => handleInputChange("attendWorkshop", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="workshop-yes" />
                        <Label htmlFor="workshop-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="workshop-no" />
                        <Label htmlFor="workshop-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      17. Additional comments or suggestions:
                    </Label>
                    <Textarea
                      value={formData.additionalComments}
                      onChange={e => handleInputChange("additionalComments", e.target.value)}
                      placeholder="Please share any additional comments, Doctor..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('C')}>
                      Previous
                    </Button>
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('Consent')}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {section === 'MWAConsent' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Consent & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      6. Do you consent to participate in this survey and for your responses to be used for research purposes?
                    </Label>
                    <RadioGroup
                      value={formData.receiveUpdates}
                      onValueChange={value => handleInputChange("receiveUpdates", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="consent-yes" />
                        <Label htmlFor="consent-yes">Yes, I consent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="consent-no" />
                        <Label htmlFor="consent-no">No, I do not consent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      7. If you wish to receive updates or results from this survey, please provide your email:
                    </Label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={e => handleInputChange("contactEmail", e.target.value)}
                      placeholder="Enter your email (optional)"
                      className="w-96"
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => handlePrev('MWAConsent')}>
                      Previous
                    </Button>
                    <Button type="button" size="lg" className="px-8" onClick={() => handleNext('MWAConsent')}>
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {section === 'Consent' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">Consent & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      18. Do you consent to participate in this survey and for your responses to be used for research purposes?
                    </Label>
                    <RadioGroup
                      value={formData.receiveUpdates}
                      onValueChange={value => handleInputChange("receiveUpdates", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="consent-yes" />
                        <Label htmlFor="consent-yes">Yes, I consent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="consent-no" />
                        <Label htmlFor="consent-no">No, I do not consent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      19. If you wish to receive updates or results from this survey, please provide your email:
                    </Label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={e => handleInputChange("contactEmail", e.target.value)}
                      placeholder="Enter your email (optional)"
                      className="w-96"
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" size="lg" className="px-8" onClick={() => setSection('D')}>
                      Previous
                    </Button>
                    <Button type="submit" size="lg" className="px-8">
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
