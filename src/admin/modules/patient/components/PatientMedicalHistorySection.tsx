
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, FileText, HeartPulse, Clipboard, Activity } from 'lucide-react';
import { Patient } from '../types/Patient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientMedicalHistorySectionProps {
  patient: Patient;
}

const PatientMedicalHistorySection = ({ patient }: PatientMedicalHistorySectionProps) => {
  // Adding some mocked medical history data when patient data is not complete
  const medicalHistory = patient.medicalHistory || "No medical history recorded";
  
  // Create a structured array of medical history items for the table
  const medicalHistoryItems = [
    {
      id: 1,
      category: "General Medical History",
      description: medicalHistory,
      icon: <FileText className="h-4 w-4 text-primary" />
    },
    {
      id: 2,
      category: "Allergies",
      description: patient.allergies || "No known allergies",
      icon: <HeartPulse className="h-4 w-4 text-red-500" />
    },
    {
      id: 3,
      category: "Chronic Conditions",
      description: patient.chronicConditions || "None reported",
      icon: <Activity className="h-4 w-4 text-blue-500" />
    },
    {
      id: 4,
      category: "Past Surgeries",
      description: patient.pastSurgeries || "No previous surgeries",
      icon: <Clipboard className="h-4 w-4 text-green-500" />
    },
    {
      id: 5,
      category: "Family History",
      description: patient.familyHistory || "No significant family history reported",
      icon: <Clipboard className="h-4 w-4 text-purple-500" />
    }
  ];

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Category</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalHistoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium">{item.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientMedicalHistorySection;
