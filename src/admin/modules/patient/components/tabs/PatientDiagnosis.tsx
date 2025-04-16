
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, Activity, Clock, FileText } from 'lucide-react';
import { Diagnosis } from '@/admin/modules/patient/submodules/diagnosis/types/Diagnosis';

interface PatientDiagnosisProps {
  patientId: string;
}

const PatientDiagnosis: React.FC<PatientDiagnosisProps> = ({ patientId }) => {
  const [diagnoses, setDiagnoses] = useState<Partial<Diagnosis>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock data for demonstration
        const mockDiagnoses: Partial<Diagnosis>[] = [
          {
            id: 1,
            date: new Date(),
            symptoms: 'Headache, fever, cough',
            diagnosis: 'Common cold',
            notes: 'Patient reported headache and fever for 2 days. Physical examination revealed slight redness in throat. Temperature elevated to 100.2°F. Recommended rest, increased fluid intake, and over-the-counter medication for symptom relief.',
            followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isFollowUpRequired: true,
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith',
              gender: 'Male',
            }
          },
          {
            id: 2,
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            symptoms: 'Joint pain, stiffness',
            diagnosis: 'Mild arthritis',
            notes: 'Patient complains of morning stiffness and joint pain in hands and knees. Pain scale: 5/10. No visible swelling observed. Blood tests ordered to check for inflammatory markers. Prescribed anti-inflammatory medication with recommendations for gentle exercise and heat therapy.',
            isFollowUpRequired: false,
            doctor: {
              id: 2,
              firstname: 'Sarah',
              lastname: 'Johnson',
              gender: 'Female',
            }
          },
          {
            id: 3,
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            symptoms: 'Shortness of breath, chest pain',
            diagnosis: 'Anxiety attack',
            notes: 'Patient experienced sudden onset of chest tightness, rapid breathing, and feeling of impending doom. ECG normal, vital signs stable after episode. No history of cardiac issues. Discussed stress triggers and recommended stress management techniques including mindfulness practice and regular exercise.',
            followUpDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            isFollowUpRequired: true,
            doctor: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith',
              gender: 'Male',
            }
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

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
    <div className="space-y-4 pb-4">
      {diagnoses.map(diagnosis => (
        <Card key={diagnosis.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {diagnosis.diagnosis}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{diagnosis.symptoms}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(diagnosis.date)}
                </div>
                {diagnosis.isFollowUpRequired && (
                  <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-800">
                    Follow-up: {formatDate(diagnosis.followUpDate)}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Visit Info */}
              <div className="p-3 border rounded-md bg-muted/10">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Visit Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(diagnosis.date)}
                  </div>
                  <div>
                    <span className="font-medium">Doctor:</span> Dr. {diagnosis.doctor?.firstname} {diagnosis.doctor?.lastname}
                  </div>
                  {diagnosis.isFollowUpRequired && (
                    <div>
                      <span className="font-medium">Follow-up Date:</span> {formatDate(diagnosis.followUpDate)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Diagnosis Details */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Diagnosis Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Symptoms:</span>
                    <p className="mt-1 text-sm">{diagnosis.symptoms}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Diagnosis:</span>
                    <p className="mt-1 text-sm">{diagnosis.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="mt-1 text-sm p-3 bg-muted/20 rounded-md">{diagnosis.notes}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                  <FileText className="mr-1 h-3 w-3" />
                  View Report
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientDiagnosis;
