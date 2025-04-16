
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Star, Calendar, Award, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Doctor } from '../types/Doctor';

interface DoctorGridProps {
  doctors: Doctor[];
  loading: boolean;
  onDoctorClick: (doctor: Doctor) => void;
  onEditClick: (doctor: Doctor) => void;
}

const DoctorGrid: React.FC<DoctorGridProps> = ({ 
  doctors, 
  loading, 
  onDoctorClick,
  onEditClick
}) => {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const formatJoiningDate = (date?: string) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="hover:shadow-md transition-shadow overflow-hidden">
          <div className="bg-primary/10 p-4 relative">
            <div className="absolute right-2 top-2 flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(doctor);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDoctorClick(doctor);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4" onClick={() => onDoctorClick(doctor)}>
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={doctor.image} />
                <AvatarFallback className="text-lg">{getInitials(doctor.firstname, doctor.lastname)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{doctor.firstname} {doctor.lastname}</h3>
                <div className="text-sm text-muted-foreground">{doctor.uid}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doctor.specializationList?.slice(0, 2).map((spec) => (
                    <Badge key={spec.id} variant="outline" className="bg-white/80">{spec.name}</Badge>
                  ))}
                  {doctor.specializationList?.length > 2 && (
                    <Badge variant="outline" className="bg-white/80">+{doctor.specializationList.length - 2} more</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4 cursor-pointer" onClick={() => onDoctorClick(doctor)}>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>{doctor.qualification}</span>
                <span className="text-muted-foreground">·</span>
                <span>{doctor.expYear} years exp.</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{doctor.phone || 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{doctor.email || 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined: {formatJoiningDate(doctor.joiningDate)}</span>
              </div>
              
              <div>
                {getRatingStars(doctor.rating || 0)}
                <span className="text-sm text-muted-foreground ml-1">({doctor.reviewCount} reviews)</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-2 border-t bg-gray-50 flex justify-between">
            <Badge variant={doctor.status === 'Active' ? 'success' : 'destructive'} className="px-2 py-1">
              {doctor.status}
            </Badge>
            <Badge variant={doctor.external ? 'outline' : 'secondary'} className="px-2 py-1">
              {doctor.external ? 'External' : 'In-house'}
            </Badge>
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
                  <div className="flex gap-2">
                    <div className="animate-pulse bg-gray-200 h-5 w-16 rounded-full"></div>
                    <div className="animate-pulse bg-gray-200 h-5 w-16 rounded-full"></div>
                  </div>
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

export default DoctorGrid;
