
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Stethoscope, FileText, User } from 'lucide-react';
import { Diagnosis } from '@/admin/modules/appointments/types/visit';

interface PatientDiagnosisProps {
  patientId: string;
}

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ patientId }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockDiagnoses: Diagnosis[] = [
          {
            id: '1',
            visitId: 'visit-1',
            diagnosisText: 'Seasonal allergic rhinitis',
            treatmentPrescribed: 'Cetirizine 10mg daily, Nasal spray twice daily',
            doctorId: 'doctor-1',
            followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            visitId: 'visit-2',
            diagnosisText: 'Mild hypertension',
            treatmentPrescribed: 'Lifestyle changes recommended, diet and exercise plan provided',
            doctorId: 'doctor-2'
          },
          {
            id: '3',
            visitId: 'visit-3',
            diagnosisText: 'Acute sinusitis',
            treatmentPrescribed: 'Amoxicillin 500mg three times daily for 10 days',
            doctorId: 'doctor-1',
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setDiagnoses(mockDiagnoses);
      } catch (error) {
        console.error('Error fetching patient diagnoses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (diagnoses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No diagnosis records found for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {diagnoses.map(diagnosis => (
        <Card key={diagnosis.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-muted-foreground" />
                <span>{diagnosis.diagnosisText}</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-1 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Doctor:</span>
                <span>Dr. {diagnosis.doctorId.replace('doctor-', '')}</span>
              </div>
              
              <div className="flex gap-1 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Treatment:</span>
                <span>{diagnosis.treatmentPrescribed}</span>
              </div>
              
              {diagnosis.followUpDate && (
                <div className="flex gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Follow-up:</span>
                  <span>{format(new Date(diagnosis.followUpDate), 'MMM dd, yyyy')}</span>
                  {new Date(diagnosis.followUpDate) > new Date() && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">Upcoming</Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientDiagnosis;
