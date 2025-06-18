
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, GraduationCap, Award, Calendar, Phone, Mail } from 'lucide-react';
import { Doctor } from '@/admin/modules/doctor/types/Doctor';

// interface Doctor {
//   id: number;
//   uid: string;
//   firstname: string;
//   lastname: string;
//   gender: string;
//   qualification?: string;
//   expYear?: number;
//   specializationList?: Array<{ id: number; name: string }>;
// }

interface DoctorProfileDialogProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

const DoctorProfileDialog: React.FC<DoctorProfileDialogProps> = ({
  doctor,
  isOpen,
  onClose
}) => {
  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-clinic-primary" />
            Dr. {doctor.firstname} {doctor.lastname}
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
                  <span className="text-sm text-gray-600">Doctor ID:</span>
                  <p className="font-medium">{doctor.uid}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Gender:</span>
                  <p className="font-medium">{doctor.gender}</p>
                </div>
              </div>
              
              {doctor.qualification && (
                <div>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Qualification:
                  </span>
                  <p className="font-medium">{doctor.qualification}</p>
                </div>
              )}
              
              {doctor.expYear && (
                <div>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Experience:
                  </span>
                  <p className="font-medium">{doctor.expYear} years</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specializations */}
          {doctor.specializationList && doctor.specializationList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializationList.map((spec) => (
                    <Badge key={spec.id} variant="outline">
                      {spec.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorProfileDialog;
