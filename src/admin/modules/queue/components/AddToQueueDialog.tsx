
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Stethoscope, FileText, Clock } from 'lucide-react';
import { queueService } from '../services/queueService';
import { Patient } from '../../patient/types/Patient';
import { Doctor } from '../../doctor/types/Doctor';
import { useToast } from '@/components/ui/use-toast';

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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          queueService.getPatients(),
          queueService.getDoctors()
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedPatientId || !selectedDoctorId) {
      toast({
        title: "Missing Information",
        description: "Please select both patient and doctor",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      await queueService.quickAddToQueue(
        parseInt(selectedPatientId),
        parseInt(selectedDoctorId)
      );

      toast({
        title: "Success",
        description: "Patient added to queue successfully. Visit record created.",
      });

      // Reset form
      setSelectedPatientId('');
      setSelectedDoctorId('');
      setReasonForVisit('');
      setNotes('');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding to queue:', error);
      toast({
        title: "Error",
        description: "Failed to add patient to queue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p.id.toString() === selectedPatientId);
  const selectedDoctor = doctors.find(d => d.id.toString() === selectedDoctorId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span>Add Patient to Queue</span>
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-6 py-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Patient</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {patient.firstname} {patient.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.uid} • {patient.mobile}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPatient && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedPatient.firstname} {selectedPatient.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.age} years • {selectedPatient.gender}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedPatient.mobile} • {selectedPatient.city}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedPatient.uid}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Doctor</Label>
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="font-medium">
                          {doctor.firstname} {doctor.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.qualification} • {doctor.specializationList[0]?.name}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDoctor && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedDoctor.firstname} {selectedDoctor.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.qualification}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedDoctor.specializationList[0]?.name} • {selectedDoctor.expYear} years exp
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={selectedDoctor.online ? "default" : "secondary"}>
                      {selectedDoctor.online ? "Available" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Reason for Visit</Label>
            <Input
              placeholder="e.g., Regular checkup, Follow-up, Consultation"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any additional information about the visit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedPatient && selectedDoctor && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">Visit Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Patient:</p>
                  <p className="font-medium">{selectedPatient.firstname} {selectedPatient.lastname}</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor:</p>
                  <p className="font-medium">{selectedDoctor.firstname} {selectedDoctor.lastname}</p>
                </div>
                <div>
                  <p className="text-gray-500">Visit Type:</p>
                  <p className="font-medium">Walk-in (Physical Visit)</p>
                </div>
                <div>
                  <p className="text-gray-500">Date:</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedPatientId || !selectedDoctorId}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Add to Queue & Create Visit'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToQueueDialog;
