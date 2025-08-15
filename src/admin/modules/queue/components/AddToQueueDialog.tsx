
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, User } from 'lucide-react';
import { queueService } from '../services/queueService';
import { QueueSource } from '../types/Queue';
import { Patient } from '../../patient/types/Patient';
import { Doctor } from '../../doctor/types/Doctor';
import { Branch } from '../../branch/types/Branch';

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [source, setSource] = useState<QueueSource>('walk_in');
  const [notes, setNotes] = useState('');
  
  // Mock data - replace with actual API calls
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadMockData();
    }
  }, [isOpen]);

  const loadMockData = () => {
    // Mock patients
    setPatients([
      {
        id: 1,
        uid: 'P001',
        firstname: 'John',
        lastname: 'Doe',
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        mobile: '+1234567890',
        gender: 'Male',
        dob: new Date('1990-01-01'),
        age: 34,
        address: '123 Main St',
        state: { id: 1, name: 'California', code: 'CA' },
        district: { id: 1, name: 'Los Angeles', code: 'LA', state: { id: 1, name: 'California', code: 'CA' } },
        refDoctor: null,
        user: { id: 1, username: 'johndoe', email: 'john.doe@email.com', phone: '+1234567890' }
      }
    ]);

    // Mock doctors
    setDoctors([
      {
        id: 1,
        uid: 'D001',
        firstname: 'Dr. Sarah',
        lastname: 'Wilson',
        qualification: 'MBBS, MD',
        expYear: 10,
        online: true,
        gender: 'Female',
        specializationList: [{ id: 1, name: 'Cardiology' }]
      }
    ]);

    // Mock branches
    setBranches([
      {
        id: 1,
        name: 'Main Branch',
        code: 'MB001',
        location: 'Downtown',
        active: true,
        primary: true,
        state: { id: 1, name: 'California', code: 'CA' },
        district: { id: 1, name: 'Los Angeles', code: 'LA', state: { id: 1, name: 'California', code: 'CA' } },
        country: { id: 1, name: 'United States', code: 'US' },
        city: 'Los Angeles',
        mapurl: '',
        pincode: 90210,
        image: '',
        latitude: 34.0522,
        longitude: -118.2437
      }
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedBranch) {
      return;
    }

    setLoading(true);
    try {
      await queueService.addToQueue(
        selectedPatient,
        selectedDoctor,
        selectedBranch,
        source
      );
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error adding to queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setSelectedBranch(null);
    setSource('walk_in');
    setNotes('');
    setSearchTerm('');
    onClose();
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobile.includes(searchTerm)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Patient to Queue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {patient.firstname} {patient.lastname}
                        </p>
                        <p className="text-xs text-gray-500">{patient.mobile}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!selectedPatient}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select onValueChange={(value) => {
                  const doctor = doctors.find(d => d.id.toString() === value);
                  setSelectedDoctor(doctor || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.firstname} {doctor.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="branch">Select Branch</Label>
                <Select onValueChange={(value) => {
                  const branch = branches.find(b => b.id.toString() === value);
                  setSelectedBranch(branch || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="source">Source</Label>
                <Select value={source} onValueChange={(value) => setSource(value as QueueSource)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                    <SelectItem value="staff_added">Staff Added</SelectItem>
                    <SelectItem value="online_appointment">Online Appointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedDoctor || !selectedBranch || loading}
                  className="flex-1"
                >
                  {loading ? 'Adding...' : 'Add to Queue'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToQueueDialog;
