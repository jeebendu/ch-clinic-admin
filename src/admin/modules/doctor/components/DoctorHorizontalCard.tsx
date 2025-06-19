
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Phone, 
  Mail, 
  User, 
  Stethoscope,
  Award,
  CheckCircle,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { Doctor } from '../types/Doctor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import RowActions, { RowAction } from '@/components/ui/RowActions';

interface DoctorHorizontalCardProps {
  doctor: Doctor;
  onEditClick?: (doctor: Doctor) => void;
  onPublishClick?: (doctor: Doctor) => void;
  onVerifyClick?: (doctor: Doctor) => void;
  onVisibilityToggle?: (doctor: Doctor, active: boolean) => void;
  onDoctorClick?: (doctor: Doctor) => void;
  onOnlineToggle?: (doctor: Doctor, online: boolean) => void;
  getRowActions: (doctor: Doctor) => RowAction[];
}

const DoctorHorizontalCard: React.FC<DoctorHorizontalCardProps> = ({
  doctor,
  onEditClick,
  onPublishClick,
  onVerifyClick,
  onVisibilityToggle,
  onDoctorClick,
  onOnlineToggle,
  getRowActions
}) => {
  const isMobile = useIsMobile();

  const getInitials = (firstname: string = '', lastname: string = '') => {
    const fullName = `${firstname} ${lastname}`.trim();
    if (!fullName) return "";
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getVerificationBadge = (verified: boolean) => {
    if (verified) {
      return (
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
            Verified
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-orange-500" />
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
          Not Verified
        </Badge>
      </div>
    );
  };

  const getOnlineStatus = (online: boolean) => {
    return online
      ? <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">● Online</Badge>
      : <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">● Offline</Badge>;
  };

  const getBorderColor = () => {
    if (!doctor.verified) return 'border-l-orange-500';
    if (!doctor.publishedOnline && !doctor.online) return 'border-l-gray-400';
    return 'border-l-primary';
  };

  const getBackgroundGradient = () => {
    if (!doctor.verified) return 'from-orange-500/5 to-orange-500/10';
    if (!doctor.publishedOnline && !doctor.online) return 'from-gray-500/5 to-gray-500/10';
    return 'from-primary/5 to-primary/10';
  };

  const fullName = `${doctor.firstname} ${doctor.lastname}`.trim();
  const hasImage = doctor.user?.image || doctor.image;

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-all border-l-4 cursor-pointer",
        getBorderColor()
      )}
      onClick={onDoctorClick ? () => onDoctorClick(doctor) : undefined}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Profile Summary Section - First Column */}
        <div className={cn(
          "flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[420px] bg-gradient-to-br flex-shrink-0",
          getBackgroundGradient()
        )}>
          <div className="relative">
            <Avatar className="h-30 w-30 border-2 border-white shadow-sm">
              {hasImage ? (
                <AvatarImage src={doctor.image} alt={fullName} />
              ) : null}
              <AvatarFallback className={cn(
                "text-white font-semibold",
                !doctor.verified ? "bg-orange-500/90" : 
                (!doctor.publishedOnline && !doctor.online) ? "bg-gray-500/90" : "bg-primary/90"
              )}>
                {getInitials(doctor.firstname, doctor.lastname)}
              </AvatarFallback>
            </Avatar>
            {doctor.verified && (
              <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                <CheckCircle className="h-3 w-3 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                Dr. {fullName}
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">ID: {doctor.uid}</span>
            </div>
            <div className="flex items-center gap-2">
              {getVerificationBadge(doctor.verified || false)}
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mb-3 sm:mb-0 flex-1">
            
            {/* Professional Info */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Professional Info</div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Stethoscope className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {doctor.specializationList && doctor.specializationList.length > 0 
                    ? doctor.specializationList[0].name 
                    : 'General Physician'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Award className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{doctor.qualification || 'N/A'}</span>
              </div>
              {doctor.expYear && (
                <div className="text-xs text-gray-500">
                  {doctor.expYear} years experience
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Contact Info</div>
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{doctor.user?.phone || doctor.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{doctor.user?.email || doctor.email || 'N/A'}</span>
              </div>
            </div>

            {/* Status & Controls */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Status & Controls</div>
              <div className="space-y-2">
                {getOnlineStatus(doctor.publishedOnline || doctor.online || false)}
                
                {/* Online/Offline Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={doctor.publishedOnline || doctor.online || false}
                    onCheckedChange={() => {
                      onVisibilityToggle?.(doctor, !doctor.publishedOnline);
                    }}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-xs text-muted-foreground">
                    {doctor.publishedOnline || doctor.online ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Published Status */}
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                  {doctor.publishedOnline ? '✅ Published' : '❌ Not Published'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex justify-end items-start mt-2 sm:mt-0 sm:w-[120px] flex-shrink-0">
            <RowActions actions={getRowActions(doctor)} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DoctorHorizontalCard;
