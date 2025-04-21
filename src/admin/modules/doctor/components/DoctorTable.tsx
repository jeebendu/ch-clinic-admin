
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Star, ExternalLink, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Doctor } from '../types/Doctor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DoctorTableProps {
  doctors: Doctor[];
  loading: boolean;
  onViewClick: (doctor: Doctor) => void;
  onEditClick: (doctor: Doctor) => void;
  onPublishClick?: (doctor: Doctor) => void;
}

const DoctorTable: React.FC<DoctorTableProps> = ({ 
  doctors, 
  loading,
  onViewClick,
  onEditClick,
  onPublishClick
}) => {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const formatJoiningDate = (date?: string) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={9}>
                    <div className="flex items-center space-x-4">
                      <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded-md"></div>
                        <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded-md"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor, index) => (
                <TableRow key={doctor.id} className="hover:bg-muted/30">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={doctor?.user?.image} />
                        <AvatarFallback>{getInitials(doctor.firstname, doctor.lastname)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          {doctor.firstname} {doctor.lastname}
                          {doctor.external && <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />}
                          {doctor.publishedOnline && <Globe className="h-3 w-3 ml-1 text-green-500" aria-label="Published Online" />}
                        </div>
                        <div className="text-sm text-muted-foreground">{doctor.uid}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {doctor.specializationList?.slice(0, 2).map((spec) => (
                        <Badge key={spec.id} variant="outline" className="justify-start">
                          {spec.name}
                        </Badge>
                      ))}
                      {doctor.specializationList?.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{doctor.specializationList.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{doctor.email}</div>
                      <div className="text-muted-foreground">{doctor.phone?doctor.phone:doctor?.user?.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{doctor.expYear} years</div>
                      <div className="text-muted-foreground">{doctor.qualification}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatJoiningDate(doctor.joiningDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{doctor.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground ml-1">({doctor.reviewCount || 0})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={doctor.verified ? 'success' : 'destructive'}>
                      {doctor.verified ? "verified" : "Not Verified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onViewClick(doctor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEditClick(doctor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!doctor.external && !doctor.publishedOnline && onPublishClick && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                          onClick={() => onPublishClick(doctor)}
                        >
                          Publish Online
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorTable;
