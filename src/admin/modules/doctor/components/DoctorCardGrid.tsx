
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Doctor } from '../types/Doctor';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface DoctorCardGridProps {
  doctors: Doctor[];
  loading: boolean;
  onDoctorClick: (doctor: Doctor) => void;
  onVisibilityToggle?: (doctor: Doctor, isVisible: boolean) => void;
}

const DoctorCardGrid: React.FC<DoctorCardGridProps> = ({
  doctors,
  loading,
  onDoctorClick,
  onVisibilityToggle
}) => {
  const getInitials = (firstname: string = '', lastname: string = '') => {
    return `${firstname.charAt(0) || ''}${lastname.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {doctors.map((doctor) => (
        <Card
          key={doctor.id}
          className="overflow-hidden hover:shadow-md transition-all border-t-4 border-t-primary cursor-pointer"
          onClick={() => onDoctorClick(doctor)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-sm mb-3">
                  <AvatarImage src={doctor?.user?.image} alt={doctor.firstname} />
                  <AvatarFallback className="bg-primary/90 text-white text-2xl">
                    {getInitials(doctor.firstname, doctor.lastname)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">
                  Dr. {doctor.firstname} {doctor.lastname}
                </h3>
                <p className="text-sm text-muted-foreground">{doctor.qualification || 'General Physician'}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {doctor.uid}</p>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                {doctor.specializationList?.slice(0, 3).map((spec) => (
                  <Badge key={spec.id} variant="outline" className="text-xs">
                    {spec.name}
                  </Badge>
                ))}
                {(doctor.specializationList?.length || 0) > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(doctor.specializationList?.length || 0) - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2" onClick={(e) => e.stopPropagation()}>
                <div>
                  <Badge 
                    variant={doctor.verified ? "success" : "destructive"} 
                    className="text-xs"
                  >
                    {doctor.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Visible</span>
                  <Switch 
                    checked={doctor.publishedOnline || false}
                    onCheckedChange={(checked) => {
                      if (onVisibilityToggle) {
                        onVisibilityToggle(doctor, checked);
                      }
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {loading && (
        Array(8).fill(0).map((_, index) => (
          <Card key={`skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-4" />
                <div className="flex gap-1 mb-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between w-full mt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {!loading && doctors.length === 0 && (
        <div className="col-span-full text-center p-8">
          <p className="text-muted-foreground">No doctors found.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorCardGrid;
