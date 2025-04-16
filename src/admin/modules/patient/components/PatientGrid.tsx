
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Phone, Mail, Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Patient } from '../types/Patient';
import { useNavigate } from 'react-router-dom';

interface PatientGridProps {
  patients: Patient[];
  loading: boolean;
  onPatientClick?: (patient: Patient) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({ patients, loading, onPatientClick }) => {
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getLastVisitClass = (lastVisit?: string) => {
    if (!lastVisit) return 'bg-gray-100';

    const visitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - visitDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) return 'bg-green-100 text-green-800';
    if (diffDays <= 180) return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };
  
  const handlePatientClick = (patient: Patient) => {
    if (onPatientClick) {
      onPatientClick(patient);
    } else {
      navigate(`/admin/patients/view/${patient.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden" onClick={() => handlePatientClick(patient)}>
          <div className="bg-primary/10 p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={patient.photoUrl} />
                <AvatarFallback className="text-lg">{getInitials(patient.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{patient.fullName}</h3>
                <div className="text-sm text-muted-foreground">{patient.uid}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{patient.gender}</Badge>
                  <Badge variant="outline">{patient.age} years</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{patient.whatsappNo}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{patient?.user?.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Last Visit: </span>
                {patient.lastVisit ? (
                  <Badge variant="outline" className={`${getLastVisitClass(patient.lastVisit)}`}>
                    {format(new Date(patient.lastVisit), 'MMM d, yyyy')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100">None</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span>{patient.insuranceProvider || 'No Insurance'}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-2 flex justify-end border-t bg-gray-50">
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      {loading && (
        Array(4).fill(0).map((_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden">
            <div className="bg-primary/5 p-4">
              <div className="flex items-center gap-4">
                <div className="animate-pulse bg-gray-200 h-16 w-16 rounded-full"></div>
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-32 rounded-md"></div>
                  <div className="animate-pulse bg-gray-200 h-3 w-24 rounded-md"></div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="animate-pulse bg-gray-200 h-3 w-full rounded-md"></div>
              <div className="animate-pulse bg-gray-200 h-3 w-full rounded-md"></div>
              <div className="animate-pulse bg-gray-200 h-3 w-3/4 rounded-md"></div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default PatientGrid;
