import type { Patient, Scan } from './types';
import type { AnalyzeEyeScanOutput } from '@/ai/flows/ai-driven-diagnostics';

const mockAnalysis1: AnalyzeEyeScanOutput = {
    diagnosticInsights: 'Optic nerve head shows moderate cupping, and the retinal nerve fiber layer appears thinner than average, which is suggestive of early to moderate-stage glaucoma. No signs of diabetic retinopathy or macular degeneration were detected.',
    potentialAbnormalities: ['Optic nerve cupping', 'Retinal Nerve Fiber Layer (RNFL) thinning'],
    differentialDiagnosis: ['Physiological cupping', 'Normal-tension glaucoma', 'Ocular hypertension'],
    earlySigns: ['Slight thinning of the neuroretinal rim', 'Minor changes in the peripheral visual field (if tested)'],
    preventionSuggestions: ['Strict adherence to prescribed eye drops', 'Regular exercise and a healthy diet', 'Avoid smoking'],
    diseaseStaging: 'Early-stage Glaucoma',
    riskAssessment: 'Patient is at a medium risk for glaucoma progression. Without intervention, there is a moderate likelihood of further vision loss over the next 5-10 years. Family history is a significant contributing factor.',
    riskLevel: 'Medium',
    treatmentSuggestions: ['Initiate treatment with prostaglandin analog eye drops (e.g., Latanoprost) once daily.', 'Monitor Intraocular Pressure (IOP) closely.'],
    followUpPlan: 'Schedule a follow-up appointment in 3 months to check IOP and assess treatment efficacy. Repeat visual field testing and OCT scan in 6 months to monitor for progression.',
    confidenceLevel: 0.85,
    recommendations: 'Proceed with visual field testing (Humphrey Visual Field) to establish a baseline and confirm functional loss. Educate the patient on the chronic nature of glaucoma and the importance of lifelong monitoring.'
};

const mockAnalysis2: AnalyzeEyeScanOutput = {
    diagnosticInsights: 'The retina appears healthy with no signs of diabetic retinopathy, hemorrhages, or microaneurysms. The macula is flat, and the optic disc is well-perfused with a healthy pink neuroretinal rim.',
    potentialAbnormalities: [],
    differentialDiagnosis: [],
    earlySigns: [],
    preventionSuggestions: ['Maintain strict glycemic control (HbA1c < 7.0%)', 'Annual comprehensive eye exams are crucial.', 'Manage blood pressure and cholesterol levels.'],
    diseaseStaging: 'N/A',
    riskAssessment: 'The patient has a low risk of developing diabetic retinopathy within the next year, provided good glycemic and blood pressure control is maintained. Continued vigilance is necessary due to the long-standing history of diabetes.',
    riskLevel: 'Low',
    treatmentSuggestions: ['No ophthalmologic treatment is required at this time.'],
    followUpPlan: 'Continue with annual diabetic retinopathy screenings. The patient should self-monitor for any changes in vision, such as floaters or blurriness, and report them immediately.',
    confidenceLevel: 0.98,
    recommendations: 'Reinforce the importance of systemic health management with the patient and their primary care physician. No specialist referral is needed at this time.'
};


export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 68,
    gender: 'Male',
    lastVisit: '2024-05-10',
    avatarUrl: 'https://picsum.photos/seed/p1/100/100',
    riskLevel: 'Medium',
    history: 'Patient has a family history of glaucoma. Reports occasional blurred vision.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 72,
    gender: 'Female',
    lastVisit: '2024-04-22',
    avatarUrl: 'https://picsum.photos/seed/p2/100/100',
    riskLevel: 'Low',
    history: 'Diabetic patient (Type 2, 15 years duration), annual check-up for retinopathy. No symptoms reported.'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 55,
    gender: 'Male',
    lastVisit: '2024-06-01',
    avatarUrl: 'https://picsum.photos/seed/p3/100/100',
    riskLevel: 'High',
    history: 'Diagnosed with wet Age-Related Macular Degeneration (AMD) 2 years ago. Receiving regular anti-VEGF injections.'
  },
  {
    id: '4',
    name: 'Emily Williams',
    age: 61,
    gender: 'Female',
    lastVisit: '2024-05-15',
    avatarUrl: 'https://picsum.photos/seed/p4/100/100',
    riskLevel: 'N/A',
    history: 'New patient referred for cataract evaluation. Complains of glare and difficulty driving at night.'
  },
];

export const MOCK_SCANS: Scan[] = [
  {
    id: 'scan-1',
    patientId: '1',
    date: '2024-05-10',
    imageUrl: 'https://picsum.photos/seed/scan1/600/400',
    clinicalNotes: 'Routine check-up. Patient reports some hazy vision in the left eye.',
    status: 'completed',
    analysis: mockAnalysis1,
    report: `**Patient Information:**
- Name: John Doe
- Age: 68
- Gender: Male

**Scan Details:**
- Date of Scan: 2024-05-10
- Clinical Notes: Routine check-up. Patient reports some hazy vision in the left eye.

**Patient Medical History:**
Patient has a family history of glaucoma. Reports occasional blurred vision.

---
**COMPREHENSIVE AI-POWERED OPHTHALMIC ANALYSIS**
---

**1. DIAGNOSTIC INSIGHTS:**
   - AI Summary: ${mockAnalysis1.diagnosticInsights}
   - Confidence Score: ${mockAnalysis1.confidenceLevel}

**2. FINDINGS:**
   - Identified Abnormalities: 
     - Optic nerve cupping
     - Retinal Nerve Fiber Layer (RNFL) thinning
   - Detected Early Signs of Disease: 
     - Slight thinning of the neuroretinal rim
     - Minor changes in the peripheral visual field (if tested)
   - Disease Staging: Early-stage Glaucoma

**3. PROPOSED TREATMENT & MANAGEMENT:**
   - Suggested Treatments:
     - Initiate treatment with prostaglandin analog eye drops (e.g., Latanoprost) once daily.
     - Monitor Intraocular Pressure (IOP) closely.

**4. RECOMMENDATIONS & NEXT STEPS:**
   - Proceed with visual field testing (Humphrey Visual Field) to establish a baseline and confirm functional loss. Educate the patient on the chronic nature of glaucoma and the importance of lifelong monitoring.

**Disclaimer:** This report is generated by an AI assistant and should be verified by a qualified medical professional.
`
  },
    {
    id: 'scan-2',
    patientId: '2',
    date: '2024-04-22',
    imageUrl: 'https://picsum.photos/seed/scan2/600/400',
    clinicalNotes: 'Annual diabetic retinopathy screening.',
    status: 'completed',
    analysis: mockAnalysis2,
    report: `**Patient Information:**
- Name: Jane Smith
- Age: 72
- Gender: Female

**Scan Details:**
- Date of Scan: 2024-04-22
- Clinical Notes: Annual diabetic retinopathy screening.

**Patient Medical History:**
Diabetic patient (Type 2, 15 years duration), annual check-up for retinopathy. No symptoms reported.

---
**COMPREHENSIVE AI-POWERED OPHTHALMIC ANALYSIS**
---

**1. DIAGNOSTIC INSIGHTS:**
   - AI Summary: ${mockAnalysis2.diagnosticInsights}
   - Confidence Score: ${mockAnalysis2.confidenceLevel}

**2. FINDINGS:**
   - Identified Abnormalities: 
   - Detected Early Signs of Disease: 
   - Disease Staging: N/A

**3. PROPOSED TREATMENT & MANAGEMENT:**
   - Suggested Treatments:
     - No ophthalmologic treatment is required at this time.

**4. RECOMMENDATIONS & NEXT STEPS:**
   - Reinforce the importance of systemic health management with the patient and their primary care physician. No specialist referral is needed at this time.

**Disclaimer:** This report is generated by an AI assistant and should be verified by a qualified medical professional.
`
  },
];
