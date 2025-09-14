'use client';

import type { Patient, Scan } from '@/lib/types';
import Image from 'next/image';
import { Logo } from './icons';

type PrintableReportProps = {
  scan: Scan;
  patient: Patient;
};

export function PrintableReport({ scan, patient }: PrintableReportProps) {
  if (!scan.analysis || !scan.report) {
    return null; // Don't render if analysis is missing
  }

  const { analysis, report } = scan;

  return (
    <div className="bg-white text-black font-sans p-8">
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">OptiVision AI</h1>
            <p className="text-sm text-gray-500">Ophthalmic Analysis Report</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Scan Date:</strong> {scan.date}</p>
        </div>
      </header>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700">Patient Information</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-semibold">{patient.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-semibold">{patient.age}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>
          <div className="col-span-3">
             <p className="text-gray-500">Patient Medical History</p>
             <p className="font-semibold whitespace-pre-wrap">{patient.history}</p>
          </div>
           <div className="col-span-3">
             <p className="text-gray-500">Clinical Notes for this Scan</p>
             <p className="font-semibold whitespace-pre-wrap">{scan.clinicalNotes || 'N/A'}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700">AI Diagnostic Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
           <div className="md:col-span-2">
            <div className="border rounded-lg p-2">
                 <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} width={400} height={300} className="rounded-md w-full" data-ai-hint="eye scan" />
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">Eye Scan Image from {scan.date}</p>
          </div>
          <div className="md:col-span-3 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-600">Diagnostic Summary</h3>
                <p>{analysis.diagnosticInsights}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Confidence Score</h3>
                <p>{(analysis.confidenceLevel * 100).toFixed(0)}%</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Potential Abnormalities</h3>
                {analysis.potentialAbnormalities?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {analysis.potentialAbnormalities.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : <p>None identified.</p>}
              </div>
               <div>
                <h3 className="font-semibold text-gray-600">Differential Diagnosis</h3>
                {analysis.differentialDiagnosis?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {analysis.differentialDiagnosis.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : <p>None noted.</p>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Detected Early Signs</h3>
                 {analysis.earlySigns?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {analysis.earlySigns.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : <p>None identified.</p>}
              </div>
              {analysis.diseaseStaging && (
                <div>
                  <h3 className="font-semibold text-gray-600">Disease Staging</h3>
                  <p>{analysis.diseaseStaging}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
         <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700">Treatment, Prevention & Recommendations</h2>
         <div className="text-sm space-y-4">
            <div>
              <h3 className="font-semibold text-gray-600">Risk Assessment</h3>
              <p>{analysis.riskAssessment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Suggested Treatment Plan</h3>
              {analysis.treatmentSuggestions?.length > 0 ? (
                <ul className="list-disc list-inside">
                  {analysis.treatmentSuggestions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : <p>No specific treatments suggested.</p>}
            </div>
             <div>
              <h3 className="font-semibold text-gray-600">Prevention Suggestions</h3>
              {analysis.preventionSuggestions?.length > 0 ? (
                <ul className="list-disc list-inside">
                  {analysis.preventionSuggestions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : <p>No specific prevention suggested.</p>}
            </div>
             <div>
              <h3 className="font-semibold text-gray-600">Follow-Up Plan</h3>
              <p>{analysis.followUpPlan}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Recommended Next Steps</h3>
              <p>{analysis.recommendations}</p>
            </div>
         </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-700">Full AI-Generated Report</h2>
        <div className="text-xs whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-md border">
          {report}
        </div>
      </section>
      
      <footer className="pt-4 mt-8 border-t text-center text-xs text-gray-500">
        <p>This report was generated by the OptiVision AI assistant. All findings should be reviewed and verified by a qualified medical professional before making any clinical decisions.</p>
        <p>&copy; {new Date().getFullYear()} OptiVision AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
