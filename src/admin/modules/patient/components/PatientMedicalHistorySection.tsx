
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, FileText, HeartPulse, Clipboard, Activity } from 'lucide-react';
import { Patient } from '../types/Patient';

interface PatientMedicalHistorySectionProps {
  patient: Patient;
}

const PatientMedicalHistorySection = ({ patient }: PatientMedicalHistorySectionProps) => {
  // Adding some mocked medical history data when patient data is not complete
  const medicalHistory = patient.medicalHistory || "No medical history recorded";
  const allergies = patient.allergies || "No known allergies";
  
  // Mocked chronic conditions and family history for the component
  const chronicConditions = patient.chronicConditions || "None reported";
  const familyHistory = patient.familyHistory || "No significant family history reported";
  const pastSurgeries = patient.pastSurgeries || "No previous surgeries";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Medical History
        </CardTitle>
        <CardDescription>
          Complete medical history and health information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* General Medical History */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              General Medical History
            </h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-sm">{medicalHistory}</p>
            </div>
          </div>
          
          {/* Allergies */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-red-500" />
              Allergies
            </h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-sm">{allergies}</p>
            </div>
          </div>
          
          {/* Chronic Conditions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Chronic Conditions
            </h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-sm">{chronicConditions}</p>
            </div>
          </div>
          
          {/* Past Surgeries */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clipboard className="h-4 w-4 text-green-500" />
              Past Surgeries
            </h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-sm">{pastSurgeries}</p>
            </div>
          </div>
          
          {/* Family History */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clipboard className="h-4 w-4 text-purple-500" />
              Family History
            </h3>
            <div className="p-4 bg-muted/20 rounded-md">
              <p className="text-sm">{familyHistory}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientMedicalHistorySection;
