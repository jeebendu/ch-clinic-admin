
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Patient } from '@/admin/modules/patient/types/Patient';

// interface Patient {
//   id: number;
//   uid: string;
//   firstname: string;
//   lastname: string;
//   gender: string;
//   dob: string;
//   age?: number;
//   user?: {
//     email: string;
//     phone: string;
//   };
// }

interface PatientProfileDialogProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientProfileDialog: React.FC<PatientProfileDialogProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  if (!patient) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-clinic-primary" />
            {patient.firstname} {patient.lastname}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Patient ID:</span>
                  <p className="font-medium">{patient.uid}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Gender:</span>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date of Birth:</span>
                  <p className="font-medium">
                    {patient.dob ? `${new Date(patient.dob).getDate().toString().padStart(2, '0')}-${(new Date(patient.dob).getMonth() + 1).toString().padStart(2, '0')}-${new Date(patient.dob).getFullYear()}` : 'N/A'}
                  </p>

                </div>
                {patient.age && (
                  <div>
                    <span className="text-sm text-gray-600">Age:</span>
                    <p className="font-medium">{patient.age} years</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {patient.user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{patient.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{patient.user.phone}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientProfileDialog;
