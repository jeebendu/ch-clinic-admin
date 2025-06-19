
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Doctor } from '../../types/Doctor';
import { Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import RowActions, { RowAction } from '@/components/ui/RowActions';

interface DoctorTableProps {
  doctors: Doctor[];
  loading: boolean;
  onViewClick: (doctor: Doctor) => void;
  onEditClick: (doctor: Doctor) => void;
  onPublishClick?: (doctor: Doctor) => void;
  onVerifyClick?: (doctor: Doctor) => void;
  onVisibilityToggle?: (doctor: Doctor, isVisible: boolean) => void;
  getRowActions: (doctor: Doctor) => RowAction[];
}

const DoctorTable: React.FC<DoctorTableProps> = ({
  doctors,
  loading,
  onViewClick,
  onEditClick,
  onPublishClick,
  onVerifyClick,
  onVisibilityToggle,
  getRowActions,
}) => {
  const getInitials = (firstname: string = '', lastname: string = '') => {
    return `${firstname.charAt(0) || ''}${lastname.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Specializations</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading &&
            Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-3 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          {!loading &&
            doctors.map((doctor, index) => (
              <TableRow 
                key={doctor.id} 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => onViewClick(doctor)}
              >
                <TableCell className="font-medium">{doctor.uid || index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={doctor?.user?.image} />
                      <AvatarFallback className="bg-primary/20 text-primary-foreground">
                        {getInitials(doctor.firstname, doctor.lastname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-base">
                        {doctor.firstname} {doctor.lastname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.qualification || 'General Physician'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{doctor.phone || doctor?.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{doctor.email || 'N/A'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializationList?.slice(0, 2).map((spec) => (
                      <Badge key={spec.id} variant="outline" className="text-xs">
                        {spec.name}
                      </Badge>
                    ))}
                    {(doctor.specializationList?.length || 0) > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(doctor.specializationList?.length || 0) - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {doctor.city || doctor.state?.name
                    ? `${doctor.city || ''} ${doctor.state?.name ? `, ${doctor.state?.name}` : ''}`
                    : 'Not specified'}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-1">
                    <Badge variant={doctor.verified ? "default" : "destructive"} className="w-fit text-xs">
                      {doctor.verified ? "Verified" : "Unverified"}
                    </Badge>
                    {doctor.external && (
                      <Badge variant="outline" className="w-fit text-xs">
                        External
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Switch 
                    checked={doctor.publishedOnline || false}
                    onCheckedChange={(checked) => {
                      if (onVisibilityToggle) {
                        onVisibilityToggle(doctor, checked);
                      }
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions actions={getRowActions(doctor)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {!loading && doctors.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No doctors found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorTable;
