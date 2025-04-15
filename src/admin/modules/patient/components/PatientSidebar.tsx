import React from 'react';
import { 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Clock, 
  FileText, 
  Activity,
  AlertCircle,
  X,
  AlertTriangle 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Patient } from '../types/Patient';

interface PatientSidebarProps {
  patient: Patient | null;
  onClose: () => void;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ patient, onClose }) => {
  if (!patient) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAgeFromDOB = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Patient Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Patient Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={patient.photoUrl} />
            <AvatarFallback className="text-xl">{getInitials(patient.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{patient.fullName}</h3>
            <div className="text-sm text-muted-foreground">{patient.uid}</div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <div className="bg-primary/10 py-1 px-2 rounded-full">
                {patient.gender}
              </div>
              <div className="bg-primary/10 py-1 px-2 rounded-full">
                {patient.age || getAgeFromDOB(patient.dob)} years
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">CONTACT INFORMATION</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.whatsappNo}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{patient?.user?.email}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{patient.address}</span>
          </div>
          
          {patient.whatsappNo && (
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-sm font-medium block">Emergency Contact</span>
                <span>{patient.whatsappNo} Relative</span>
                <span className="block text-sm">{patient.whatsappNo}</span>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Medical Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">MEDICAL INFORMATION</h4>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date of Birth: {format(new Date(patient.dob), 'MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Last Visit: {patient.lastVisit ? format(new Date(patient.lastVisit), 'MMMM d, yyyy') : 'No visits recorded'}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-sm font-medium block">Insurance</span>
              <span>{patient.insuranceProvider || 'None'}</span>
              {patient.insurancePolicyNumber && (
                <span className="block text-sm">Policy: {patient.insurancePolicyNumber}</span>
              )}
            </div>
          </div>
          
          {patient.medicalHistory && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-sm font-medium block">Medical History</span>
                <span>{patient.medicalHistory}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground">Total appointments</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold">14</div>
              <div className="text-xs text-muted-foreground">Days ago</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">Active medications</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium">Bills</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-2xl font-bold">$120</div>
              <div className="text-xs text-muted-foreground">Outstanding amount</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Special Alerts */}
        {patient.medicalHistory?.includes('Diabetes') || patient.medicalHistory?.includes('Hypertension') ? (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Medical Alert</h4>
                <p className="text-sm">This patient has conditions requiring special attention.</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
      
      <div className="p-4 border-t flex gap-3 justify-end">
        <Button variant="outline">Schedule Appointment</Button>
        <Button>Edit Details</Button>
      </div>
    </div>
  );
};

export default PatientSidebar;
