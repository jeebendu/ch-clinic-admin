
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileEdit, Calendar, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Prescription } from '../types/Prescription';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

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
            prescriptionId: 'RX-10001',
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
            prescriptionId: 'RX-10002',
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

  const handleDownloadPrescription = (id: number) => {
    toast({
      title: 'Download started',
      description: `Downloading prescription #${id}`,
    });
    // In a real application, this would trigger a download
  };

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prescription ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Medications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.prescriptionId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{prescription.visitDate ? format(new Date(prescription.visitDate), 'MMM d, yyyy') : 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>Dr. {prescription.doctor.firstname} {prescription.doctor.lastname}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{prescription.diagnosis}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {prescription.medicines.map((med: any, index: number) => (
                          <Badge key={index} variant="outline" className="bg-muted/50">
                            {med.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleDownloadPrescription(prescription.id)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAllPrescriptionsSection;
