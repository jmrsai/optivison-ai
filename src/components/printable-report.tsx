'use client';

import type { Patient, Scan } from '@/lib/types';
import Image from 'next/image';
import { Logo } from './icons';

type PrintableReportProps = {
  scan: Scan;
  patient: Patient;
  decryptedHistory: string;
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">{title}</h2>
      <div className="text-xs">{children}</div>
    </section>
);

const InfoPair = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
        <p className="font-semibold">{value || 'N/A'}</p>
    </div>
);

const ListSection = ({ title, items }: { title: string, items: string[] | undefined }) => (
    <div>
        <h3 className="font-semibold text-gray-600 mb-1">{title}</h3>
        {items?.length ? (
            <ul className="list-disc list-inside space-y-1">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        ) : <p>None noted.</p>}
    </div>
);


export function PrintableReport({ scan, patient, decryptedHistory }: PrintableReportProps) {
  if (!scan.analysis || !scan.report) {
    return null; // Don't render if analysis is missing
  }

  const { analysis, report } = scan;

  return (
    <div className="bg-white text-gray-900 font-sans p-8 w-[800px]">
      <header className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">OptiVision AI</h1>
            <p className="text-sm font-medium text-gray-600">Ophthalmic Analysis Report</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Scan Date:</strong> {scan.date}</p>
        </div>
      </header>
      
      <Section title="Patient Information">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          <InfoPair label="Full Name" value={patient.name} />
          <InfoPair label="Age" value={patient.age} />
          <InfoPair label="Gender" value={patient.gender} />
          <InfoPair label="Patient ID" value={patient.id} />
          <div className="col-span-4 mt-2">
             <p className="text-gray-500 text-[10px] uppercase tracking-wider">Patient Medical History</p>
             <p className="font-semibold whitespace-pre-wrap">{decryptedHistory}</p>
          </div>
           <div className="col-span-4 mt-1">
             <p className="text-gray-500 text-[10px] uppercase tracking-wider">Clinical Notes for this Scan</p>
             <p className="font-semibold whitespace-pre-wrap">{scan.clinicalNotes || 'N/A'}</p>
          </div>
        </div>
      </Section>

      <Section title="AI Diagnostic Analysis">
        <div className="grid grid-cols-5 gap-6 items-start">
           <div className="col-span-2">
            <div className="border rounded-md p-1 bg-gray-50">
                 <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} width={400} height={300} className="rounded w-full" data-ai-hint="eye scan" />
            </div>
             <p className="text-[10px] text-center text-gray-500 mt-1">Eye Scan Image from {scan.date}</p>
          </div>
          <div className="col-span-3 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-600 mb-1">Diagnostic Summary</h3>
              <p>{analysis.diagnosticInsights}</p>
            </div>
             <div className="grid grid-cols-2 gap-3">
                <InfoPair label="Confidence Score" value={`${(analysis.confidenceLevel * 100).toFixed(0)}%`} />
                {analysis.diseaseStaging && <InfoPair label="Disease Staging" value={analysis.diseaseStaging} />}
                <InfoPair label="Risk Level" value={analysis.riskLevel} />
             </div>
            <ListSection title="Potential Abnormalities" items={analysis.potentialAbnormalities} />
            <ListSection title="Detected Early Signs" items={analysis.earlySigns} />
          </div>
        </div>
      </Section>
      
      <Section title="Risk, Prognosis & Recommendations">
         <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-600 mb-1">Risk Assessment</h3>
              <p>{analysis.riskAssessment}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <ListSection title="Differential Diagnosis" items={analysis.differentialDiagnosis} />
                <ListSection title="Treatment Suggestions" items={analysis.treatmentSuggestions} />
                <ListSection title="Prevention Suggestions" items={analysis.preventionSuggestions} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-600 mb-1">Follow-Up Plan & Next Steps</h3>
              <p>{analysis.followUpPlan}</p>
              <p className='mt-1'>{analysis.recommendations}</p>
            </div>
         </div>
      </Section>
      
      <Section title="Full AI-Generated Report Text">
        <div className="text-[9px] whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded-md border text-gray-700">
          {report}
        </div>
      </Section>
      
      <footer className="pt-4 mt-6 border-t text-center text-[10px] text-gray-500">
        <p>This report was generated by the OptiVision AI assistant. All findings should be reviewed and verified by a qualified medical professional before making any clinical decisions.</p>
        <p>&copy; {new Date().getFullYear()} OptiVision AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
