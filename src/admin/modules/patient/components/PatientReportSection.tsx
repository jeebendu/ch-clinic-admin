
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Patient } from '../types/Patient';
import AudiometryForm from './reports/AudiometryForm';
import { useToast } from '@/hooks/use-toast';

interface PatientReportSectionProps {
  patient?: Patient;
  patientId?: number; // Add patientId as an optional prop
}

const PatientReportSection: React.FC<PatientReportSectionProps> = ({ patient, patientId }) => {
  const [audiometryOpen, setAudiometryOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveAudiogram = (audiogram: any) => {
    toast({
      title: "Audiometry report saved",
      description: "The audiometry report has been saved successfully.",
    });
    setAudiometryOpen(false);
  };

  // Use either patient?.id or patientId
  const effectivePatientId = patient?.id ?? patientId;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={audiometryOpen} onOpenChange={setAudiometryOpen}>
          <DialogTrigger asChild>
            <Button>Add Audiometry</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>New Audiometry Report</DialogTitle>
              <DialogDescription>
                Create a new audiometry report for this patient.
              </DialogDescription>
            </DialogHeader>
            <AudiometryForm 
              patientId={effectivePatientId} 
              onCancel={() => setAudiometryOpen(false)} 
              onSave={handleSaveAudiogram}
              open={audiometryOpen}
              onOpenChange={setAudiometryOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientReportSection;
