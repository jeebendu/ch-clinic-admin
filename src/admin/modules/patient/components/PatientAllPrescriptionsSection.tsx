
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileEdit, Calendar, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Prescription } from '../types/Prescription';
import { useToast } from '@/hooks/use-toast';

interface PatientAllPrescriptionsSectionProps {
  patientId: string;
}

const PatientAllPrescriptionsSection = ({ patientId }: PatientAllPrescriptionsSectionProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mocked data for prescriptions from all visits
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call to get all prescriptions
        // Mocked data for now
        const mockedPrescriptions: any[] = [
          {
            id: 1,
            medicines: [
              { 
                name: 'Amoxicillin',
                dosage: '500mg',
                frequency: '3 times daily',
                duration: '7 days',
                timings: 'After meals',
                instruction: 'Take with water'
              },
              { 
                name: 'Ibuprofen',
                dosage: '200mg',
                frequency: 'As needed',
                duration: '5 days',
                timings: 'When in pain',
                instruction: 'Take with food'
              }
            ],
            temperature: 98.6,
            pulse: 72,
            respiratory: 16,
            clinicNotes: 'Patient presented with ear pain and mild fever',
            complaints: 'Ear pain, difficulty hearing',
            advice: 'Rest and follow-up in 1 week',
            diagnosis: 'Acute otitis media',
            doctor: {
              firstname: 'Sarah',
              lastname: 'Johnson',
              id: 1
            },
            patient: {
              id: parseInt(patientId),
            },
            visitDate: new Date(2025, 0, 15).toISOString()
          },
          {
            id: 2,
            medicines: [
              { 
                name: 'Cetirizine',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '14 days',
                timings: 'Before bedtime',
                instruction: 'May cause drowsiness'
              }
            ],
            temperature: 99.1,
            pulse: 78,
            respiratory: 18,
            clinicNotes: 'Patient came for follow-up. Ear infection is clearing up but now experiencing allergic symptoms',
            complaints: 'Sneezing, runny nose',
            advice: 'Avoid allergens and follow-up if symptoms persist',
            diagnosis: 'Allergic rhinitis',
            doctor: {
              firstname: 'Michael',
              lastname: 'Chen',
              id: 2
            },
            patient: {
              id: parseInt(patientId),
            },
            visitDate: new Date(2025, 1, 5).toISOString()
          }
        ];
        
        setPrescriptions(mockedPrescriptions);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient prescriptions.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-primary" />
          All Prescriptions
        </CardTitle>
        <CardDescription>
          View all prescriptions across patient visits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No prescriptions found for this patient</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {prescription.visitDate ? format(new Date(prescription.visitDate), 'MMMM d, yyyy') : 'Unknown date'}
                    </span>
                  </div>
                  <div className="text-sm">
                    Dr. {prescription.doctor.firstname} {prescription.doctor.lastname}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Diagnosis and complaints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Diagnosis</p>
                      <p className="text-sm bg-muted/30 p-2 rounded">{prescription.diagnosis}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Complaints</p>
                      <p className="text-sm bg-muted/30 p-2 rounded">{prescription.complaints}</p>
                    </div>
                  </div>
                  
                  {/* Medicines */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Medicines</p>
                    <div className="space-y-2 mt-2">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="border rounded-md p-3 bg-muted/10">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              <h4 className="font-medium text-sm">{medicine.name}</h4>
                            </div>
                            <Badge variant="outline">{medicine.dosage}</Badge>
                          </div>
                          <div className="text-sm mt-2 space-y-1 text-muted-foreground">
                            <p>{medicine.frequency} • {medicine.duration}</p>
                            {medicine.instruction && (
                              <p className="text-xs italic">{medicine.instruction}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Vital signs */}
                  {(prescription.temperature || prescription.pulse || prescription.respiratory) && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {prescription.temperature && (
                        <div className="bg-muted/10 p-2 rounded border text-center">
                          <div className="text-xs text-muted-foreground">Temperature</div>
                          <div className="font-medium">{prescription.temperature}°F</div>
                        </div>
                      )}
                      {prescription.pulse && (
                        <div className="bg-muted/10 p-2 rounded border text-center">
                          <div className="text-xs text-muted-foreground">Pulse</div>
                          <div className="font-medium">{prescription.pulse} bpm</div>
                        </div>
                      )}
                      {prescription.respiratory && (
                        <div className="bg-muted/10 p-2 rounded border text-center">
                          <div className="text-xs text-muted-foreground">Respiratory Rate</div>
                          <div className="font-medium">{prescription.respiratory} bpm</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Doctor's notes and advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {prescription.clinicNotes && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Clinical Notes</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{prescription.clinicNotes}</p>
                      </div>
                    )}
                    {prescription.advice && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Advice</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{prescription.advice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAllPrescriptionsSection;
