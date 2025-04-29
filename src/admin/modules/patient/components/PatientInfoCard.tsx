
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Patient } from '../types/Patient';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

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

          {/* Contact & Address Info - Consolidated */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{patient.user?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{patient.user?.email || 'Not provided'}</span>
              </div>
              {patient.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <span>{patient.address}{patient.city && `, ${patient.city}`}{patient.state?.name && `, ${patient.state.name}`}</span>
                </div>
              )}
              {patient.lastVisit && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Last visit: {formatDate(patient.lastVisit)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {patient.medicalHistory && (
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Medical History</h3>
            <div className="text-sm bg-muted/30 p-3 rounded-md">
              {patient.medicalHistory}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PatientInfoCard;
