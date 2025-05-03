
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import doctorService from '@/admin/modules/doctor/services/doctorService';
import { Doctor } from '@/admin/modules/doctor/types/Doctor';

interface NewVisitFormProps {
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewVisitForm: React.FC<NewVisitFormProps> = ({ patientId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [consultationType, setConsultationType] = useState('consultation');
  const [doctorId, setDoctorId] = useState('');
  const [referralDoctorId, setReferralDoctorId] = useState('');
  const [notes, setNotes] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await doctorService.listAllDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive",
        });
      }
    };

    fetchDoctors();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consultationType || !chiefComplaint || !doctorId) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Visit created",
        description: "The visit has been created successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating visit:', error);
      toast({
        title: "Error",
        description: "Failed to create visit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[calc(100vh-300px)] overflow-y-auto">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="consultationType">Visit Type <span className="text-red-500">*</span></Label>
          <Select value={consultationType} onValueChange={setConsultationType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select consultation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="lab_test">Lab Test Only</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctorId">Consulting Doctor <span className="text-red-500">*</span></Label>
          <Select value={doctorId} onValueChange={setDoctorId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.firstname} {doctor.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referralDoctorId">Referral Doctor</Label>
          <Select value={referralDoctorId} onValueChange={setReferralDoctorId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select referral doctor (if any)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {doctors
                .filter(doctor => doctor.id.toString() !== doctorId)
                .map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.firstname} {doctor.lastname}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chiefComplaint">Chief Complaint <span className="text-red-500">*</span></Label>
          <Textarea 
            id="chiefComplaint"
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Enter chief complaint"
            className="resize-none"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea 
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter additional notes"
            className="resize-none"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Visit"}
        </Button>
      </div>
    </form>
  );
};

export default NewVisitForm;
