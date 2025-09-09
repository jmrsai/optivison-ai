import type { Patient, Scan } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 68,
    gender: 'Male',
    lastVisit: '2024-05-10',
    avatarUrl: 'https://picsum.photos/id/237/100/100',
    riskLevel: 'Medium',
    history: 'Patient has a family history of glaucoma. Reports occasional blurred vision.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 72,
    gender: 'Female',
    lastVisit: '2024-04-22',
    avatarUrl: 'https://picsum.photos/id/238/100/100',
    riskLevel: 'Low',
    history: 'Diabetic patient, annual check-up for retinopathy. No symptoms reported.'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 55,
    gender: 'Male',
    lastVisit: '2024-06-01',
    avatarUrl: 'https://picsum.photos/id/239/100/100',
    riskLevel: 'High',
    history: 'Diagnosed with macular degeneration 2 years ago. Undergoing treatment.'
  },
  {
    id: '4',
    name: 'Emily Williams',
    age: 61,
    gender: 'Female',
    lastVisit: '2024-05-15',
    avatarUrl: 'https://picsum.photos/id/240/100/100',
    riskLevel: 'N/A',
    history: 'New patient referred for cataract evaluation.'
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
    analysis: {
      diagnosticInsights: 'Optic nerve head shows slight cupping, suggestive of early-stage glaucoma. Retinal nerve fiber layer appears thinner than average.',
      potentialAbnormalities: ['Optic nerve cupping', 'RNFL thinning'],
      confidenceLevel: 0.85,
      recommendations: 'Recommend visual field testing and regular IOP monitoring. Follow-up in 3 months.'
    },
    riskAssessment: 'Medium risk of glaucoma progression. Early intervention is key to preserving vision.',
    report: 'Patient: John Doe\nDate: 2024-05-10\n\nAI Analysis:\n- Diagnostic Insights: Optic nerve head shows slight cupping, suggestive of early-stage glaucoma. Retinal nerve fiber layer appears thinner than average.\n- Potential Abnormalities: Optic nerve cupping, RNFL thinning.\n- Confidence: 85%\n\nRisk Assessment: Medium risk of progression.\n\nRecommendations: Visual field testing, IOP monitoring, follow-up in 3 months.'
  },
    {
    id: 'scan-2',
    patientId: '2',
    date: '2024-04-22',
    imageUrl: 'https://picsum.photos/seed/scan2/600/400',
    clinicalNotes: 'Annual diabetic retinopathy screening.',
    status: 'completed',
    analysis: {
      diagnosticInsights: 'No signs of diabetic retinopathy observed. Macula and peripheral retina appear healthy.',
      potentialAbnormalities: [],
      confidenceLevel: 0.98,
      recommendations: 'Continue annual screening. Maintain good glycemic control.'
    },
    riskAssessment: 'Low risk of developing diabetic retinopathy within the next year.',
    report: 'Patient: Jane Smith\nDate: 2024-04-22\n\nAI Analysis:\n- Diagnostic Insights: No signs of diabetic retinopathy observed. Macula and peripheral retina appear healthy.\n- Potential Abnormalities: None.\n- Confidence: 98%\n\nRisk Assessment: Low risk.\n\nRecommendations: Continue annual screening.'
  },
];
