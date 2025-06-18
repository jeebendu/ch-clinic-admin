
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Phone, Mail, MapPin, User, Calendar, Trash2, FileText } from 'lucide-react';
import { Patient } from '../types/Patient';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

interface PatientHorizontalCardProps {
  patient: Patient;
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onPatientClick?: (patient: Patient) => void;
}

const PatientHorizontalCard: React.FC<PatientHorizontalCardProps> = ({
  patient,
  onView,
  onEdit,
  onDelete,
  onPatientClick
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

  const getGenderBadgeColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'female':
        return 'bg-pink-500/10 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const fullName = patient.fullName || `${patient.firstname} ${patient.lastname}`.trim();

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary cursor-pointer"
      onClick={onPatientClick ? () => onPatientClick(patient) : undefined}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Left section - Patient Summary */}
        <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[280px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
            <AvatarImage src={patient.photoUrl || patient.user?.image} alt={fullName} />
            <AvatarFallback className="bg-primary/90 text-white">
              {getInitials(patient.firstname, patient.lastname)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
              {fullName}
            </h3>
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">ID: {patient.uid}</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{patient.age} years</span>
            </div>
          </div>
        </div>

        {/* Middle section - Contact & Medical Info */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-2 sm:mb-0 flex-1">
            {/* Contact Information Group */}
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{patient.phone || patient.user?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{patient.email || patient.user?.email || 'N/A'}</span>
            </div>

            {/* Location Information Group */}
            {patient.address && (
              <div className="flex items-center gap-1 text-sm col-span-2">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{patient.address}</span>
              </div>
            )}

            {/* Medical History Group */}
            {patient.lastVisit && (
              <div className="flex items-center gap-1 text-sm col-span-2">
                <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  Last Visit: {format(new Date(patient.lastVisit), 'dd MMM yyyy')}
                </span>
              </div>
            )}

            {/* Patient Demographics Group */}
            <div className="col-span-2 mt-1">
              <div className="flex flex-wrap gap-1">
                {patient.gender && (
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs py-0 px-1", getGenderBadgeColor(patient.gender))}
                  >
                    {patient.gender}
                  </Badge>
                )}
                {patient.dob && (
                  <Badge variant="outline" className="text-xs py-0 px-1">
                    DOB: {format(new Date(patient.dob), 'dd/MM/yyyy')}
                  </Badge>
                )}
                {patient.state && (
                  <Badge variant="outline" className="text-xs py-0 px-1">
                    {patient.state}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right section with actions */}
          <div className="flex flex-col justify-center items-end gap-2 mt-2 sm:mt-0 sm:w-[200px] flex-shrink-0">
            <div className="flex gap-1">
              {onView && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(patient);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(patient);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(patient.id || 0);
                }}
                title="Delete Patient"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientHorizontalCard;
