
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import queueService from '../services/queueService';

interface AddToQueueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddToQueueDialog: React.FC<AddToQueueDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [notes, setNotes] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patients = queueService.getPatients();
  const doctors = queueService.getDoctors();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.uid.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedDoctor || !reasonForVisit.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      const doctor = doctors.find(d => d.id === selectedDoctor);
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }

      await queueService.quickAddToQueue({
        patientId: selectedPatient,
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        doctorId: selectedDoctor,
        doctorName: doctor.name,
        reasonForVisit: reasonForVisit.trim(),
        notes: notes.trim() || undefined
      });

      toast({
        title: "Patient Added to Queue",
        description: `${patient.name} has been successfully added to the queue.`,
        className: "bg-clinic-primary text-white"
      });

      // Reset form
      setSelectedPatient('');
      setSelectedDoctor('');
      setReasonForVisit('');
      setNotes('');
      setPatientSearch('');
      setDoctorSearch('');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding patient to queue:', error);
      toast({
        title: "Error",
        description: "Failed to add patient to queue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedPatient('');
      setSelectedDoctor('');
      setReasonForVisit('');
      setNotes('');
      setPatientSearch('');
      setDoctorSearch('');
      onClose();
    }
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add Patient to Queue
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient *</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-xs text-gray-500">
                          UID: {patient.uid} • {patient.age}y, {patient.gender}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPatientData && (
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">{selectedPatientData.age}y</Badge>
                <Badge variant="secondary">{selectedPatientData.gender}</Badge>
                <Badge variant="outline">UID: {selectedPatientData.uid}</Badge>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor *</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">Dr. {doctor.name}</span>
                        <span className="text-xs text-gray-500">{doctor.specialization}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDoctorData && (
              <Badge variant="outline">{selectedDoctorData.specialization}</Badge>
            )}
          </div>

          {/* Reason for Visit */}
          <div>
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="e.g., Routine checkup, Follow-up, Emergency"
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or instructions"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add to Queue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToQueueDialog;
