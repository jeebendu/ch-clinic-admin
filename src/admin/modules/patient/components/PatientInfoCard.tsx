
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Patient } from '../types/Patient';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';

interface PatientInfoCardProps {
  patient: Patient;
  formatDate: (date: Date | string | undefined) => string;
  getInitials: (name: string) => string;
}

const PatientInfoCard = ({ patient, formatDate, getInitials }: PatientInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={patient.photoUrl} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(patient.fullName || `${patient.firstname} ${patient.lastname}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{patient.firstname} {patient.lastname}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Patient ID: {patient.uid}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{patient.gender}</Badge>
                <Badge variant="outline">{patient.age} years</Badge>
                {patient.insuranceProvider && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-100">
                    {patient.insuranceProvider}
                  </Badge>
                )}
                {patient.problem && (
                  <Badge variant="success">
                    {patient.problem}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Full Name: </span> 
                  {patient.firstname} {patient.lastname}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">DOB: </span> 
                  {formatDate(patient.dob)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-5 w-5 flex items-center justify-center">
                  {patient.gender?.charAt(0)}
                </Badge>
                <span>
                  <span className="font-medium">Gender: </span> 
                  {patient.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Phone: </span> 
                  {patient.user?.phone || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Email: </span> 
                  {patient.user?.email || 'Not provided'}
                </span>
              </div>
              {patient.whatsappNo && (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 flex items-center justify-center text-green-600 font-bold">W</span>
                  <span>
                    <span className="font-medium">WhatsApp: </span> 
                    {patient.whatsappNo}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Address & Medical */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Address & Medical Info</h3>
            <div className="space-y-2">
              {patient.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Address: </span>
                    <span>{patient.address}</span>
                    {patient.city && (
                      <div className="text-sm text-muted-foreground">
                        {patient.city}, {patient.state?.name || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {patient.insuranceProvider && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-4 w-4 flex items-center justify-center text-blue-600 font-bold">I</span>
                  <span>
                    <span className="font-medium">Insurance: </span> 
                    {patient.insuranceProvider}
                    {patient.insurancePolicyNumber && ` (${patient.insurancePolicyNumber})`}
                  </span>
                </div>
              )}
              
              {patient.refDoctor && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-4 w-4 flex items-center justify-center text-red-600 font-bold">R</span>
                  <span>
                    <span className="font-medium">Referring Doctor: </span> 
                    Dr. {patient.refDoctor.firstname} {patient.refDoctor.lastname}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
