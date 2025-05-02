
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileEdit, Calendar, Download, Printer } from 'lucide-react';
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
import { createPrescription } from '../../appointments/services/PrescriptionService';

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
        const mockedPrescriptions: Prescription[] = [
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
            spo2: 98,
            height: 175,
            weight: 70,
            waist: 80,
            bsa: 1.8,
            bmi: 22.9,
            previousHistory: '',
            previousClinicNote: '',
            clinicNotes: 'Patient presented with ear pain and mild fever',
            laoratoryTestList: [],
            complaints: 'Ear pain, difficulty hearing',
            advice: 'Rest and follow-up in 1 week',
            followUp: new Date(2025, 1, 22),
            symptoms: 'Ear pain, mild fever',
            diagnosis: 'Acute otitis media',
            doctor: {
              firstname: 'Sarah',
              lastname: 'Johnson',
              id: 1
            },
            patient: {
              id: parseInt(patientId),
              // Adding minimal required fields for the patient object
              firstname: '',
              lastname: '',
              email: '',
              mobile: '',
              gender: ''
            }
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
            spo2: 97,
            height: 175,
            weight: 70,
            waist: 80,
            bsa: 1.8,
            bmi: 22.9,
            previousHistory: '',
            previousClinicNote: '',
            clinicNotes: 'Patient came for follow-up. Ear infection is clearing up but now experiencing allergic symptoms',
            laoratoryTestList: [],
            complaints: 'Sneezing, runny nose',
            advice: 'Avoid allergens and follow-up if symptoms persist',
            followUp: new Date(2025, 2, 5),
            symptoms: 'Sneezing, runny nose, itchy eyes',
            diagnosis: 'Allergic rhinitis',
            doctor: {
              firstname: 'Michael',
              lastname: 'Chen',
              id: 2
            },
            patient: {
              id: parseInt(patientId),
              // Adding minimal required fields for the patient object
              firstname: '',
              lastname: '',
              email: '',
              mobile: '',
              gender: ''
            }
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

  const handlePrintPrescription = (prescription: Prescription) => {
    try {
      createPrescription(prescription.id, prescription);
      toast({
        title: 'Printing prescription',
        description: `Prescription for ${prescription.diagnosis} is being prepared`,
      });
    } catch (error) {
      console.error('Error printing prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to print prescription.',
        variant: 'destructive',
      });
    }
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
                  <TableHead>Prescription #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Medications & Dosage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">RX-{prescription.id.toString().padStart(5, '0')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{prescription.followUp ? format(new Date(prescription.followUp), 'MMM d, yyyy') : 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>Dr. {prescription.doctor.firstname} {prescription.doctor.lastname}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{prescription.diagnosis}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {prescription.medicines.map((med, index) => (
                          <Badge key={index} variant="outline" className="bg-muted/50 flex items-center gap-1 w-fit">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-xs">({med.dosage})</span>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handleDownloadPrescription(prescription.id)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => handlePrintPrescription(prescription)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Print
                        </Button>
                      </div>
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
