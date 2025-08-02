
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Doctor } from '../../types/Doctor';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar, 
  Stethoscope,
  CheckCircle,
  XCircle,
  Globe,
  GraduationCap
} from 'lucide-react';

interface DoctorInfoCardProps {
  doctor: Doctor;
  getInitials: (firstname: string, lastname: string) => string;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ doctor, getInitials }) => {
  const getStatusBadge = (verified: boolean) => {
    return (
      <Badge className={`text-xs ${
        verified ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
      }`}>
        {verified ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3 mr-1" />
            Not Verified
          </>
        )}
      </Badge>
    );
  };

  const getOnlineBadge = (online: boolean) => {
    return (
      <Badge className={`text-xs ${
        online ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200"
      }`}>
        {online ? (
          <>
            <Globe className="w-3 h-3 mr-1" />
            Online
          </>
        ) : (
          <>
            Online Unavailable
          </>
        )}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={doctor?.imageUrl} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
                {getInitials(doctor.firstname, doctor.lastname)}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                Dr. {doctor.firstname} {doctor.lastname}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                {doctor.qualification || 'General Physician'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {getStatusBadge(doctor.verified || false)}
                {getOnlineBadge(doctor.online || false)}
              </div>
            </div>
          </div>

          {/* Doctor Details Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.phone || doctor?.user?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.email || doctor?.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.city || 'Location not specified'}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Professional Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>ID: {doctor.uid || doctor.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.expYear || 0} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.qualification || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Specializations
              </h3>
              <div className="space-y-2">
                {doctor.specializationList && doctor.specializationList.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializationList.map((spec) => (
                      <Badge key={spec.id} variant="outline" className="text-xs">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {spec.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specializations listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorInfoCard;
