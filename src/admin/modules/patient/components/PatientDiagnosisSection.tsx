
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, Calendar, User, MessageCircle, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Diagnosis } from '../types/Diagnosis';
import { Button } from '@/components/ui/button';

interface PatientDiagnosisSectionProps {
  patientId: string;
}

const PatientDiagnosisSection = ({ patientId }: PatientDiagnosisSectionProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mocked data for diagnoses from all visits
  useEffect(() => {
    const fetchDiagnoses = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call to get all diagnoses
        // Mocked data for now
        const mockedDiagnoses: Diagnosis[] = [
          {
            id: 1,
            patient: {
              id: parseInt(patientId),
              firstname: 'John',
              lastname: 'Doe',
              email: 'john.doe@example.com',
              mobile: '123-456-7890',
              gender: 'male'
            },
            doctor: {
              id: 1,
              firstname: 'Sarah',
              lastname: 'Johnson'
            },
            date: new Date(2025, 0, 15),
            symptoms: 'Ear pain, difficulty hearing, mild fever',
            diagnosis: 'Acute otitis media',
            notes: 'Patient presented with ear pain and mild fever. Examination revealed redness and bulging of the tympanic membrane.',
            followUpDate: new Date(2025, 0, 30),
            isFollowUpRequired: true
          },
          {
            id: 2,
            patient: {
              id: parseInt(patientId),
              firstname: 'John',
              lastname: 'Doe',
              email: 'john.doe@example.com',
              mobile: '123-456-7890',
              gender: 'male'
            },
            doctor: {
              id: 2,
              firstname: 'Michael',
              lastname: 'Chen'
            },
            date: new Date(2025, 1, 5),
            symptoms: 'Sneezing, runny nose, itchy eyes',
            diagnosis: 'Allergic rhinitis',
            notes: 'Patient came for follow-up. Ear infection is clearing up but now experiencing allergic symptoms.',
            followUpDate: new Date(2025, 2, 5),
            isFollowUpRequired: true
          },
          {
            id: 3,
            patient: {
              id: parseInt(patientId),
              firstname: 'John',
              lastname: 'Doe',
              email: 'john.doe@example.com',
              mobile: '123-456-7890',
              gender: 'male'
            },
            doctor: {
              id: 1,
              firstname: 'Sarah',
              lastname: 'Johnson'
            },
            date: new Date(2025, 2, 10),
            symptoms: 'Hearing difficulty in right ear, occasional tinnitus',
            diagnosis: 'Sensorineural hearing loss',
            notes: 'Audiometry test reveals mild to moderate hearing loss in the right ear. Recommended hearing aid evaluation.',
            followUpDate: null,
            isFollowUpRequired: false
          },
        ];
        
        setDiagnoses(mockedDiagnoses);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient diagnoses.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchDiagnoses();
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
          <Stethoscope className="h-5 w-5 text-primary" />
          Diagnosis History
        </CardTitle>
        <CardDescription>
          View all diagnoses across patient visits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No diagnoses found for this patient</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Follow-up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(diagnosis.date, 'MMM d, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Dr. {diagnosis.doctor.firstname} {diagnosis.doctor.lastname}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{diagnosis.diagnosis}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {diagnosis.symptoms.split(',').map((symptom, index) => (
                          <Badge key={index} variant="outline" className="bg-muted/50">
                            {symptom.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {diagnosis.isFollowUpRequired ? (
                        <div className="flex items-center gap-1">
                          <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
                          <span>{diagnosis.followUpDate ? format(diagnosis.followUpDate, 'MMM d, yyyy') : 'Required'}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">Not required</Badge>
                      )}
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

export default PatientDiagnosisSection;
