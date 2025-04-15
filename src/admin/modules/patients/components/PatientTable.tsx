import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Patient } from "@/admin/types/Patient";

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onPatientClick: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, loading, onPatientClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAgeGroup = (age?: number) => {
    if (!age) return 'Unknown';
    if (age < 18) return 'Pediatric';
    if (age < 30) return 'Young Adult';
    if (age < 50) return 'Middle Aged';
    if (age < 65) return 'Adult';
    return 'Senior';
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

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50">
              <TableHead className="font-semibold text-xs uppercase">Patient</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Age / Gender</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Contact</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Last Visit</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Insurance</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow 
                key={patient.id} 
                className="hover:bg-gray-50 cursor-pointer border-b"
                onClick={() => onPatientClick(patient)}
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.photoUrl} />
                      <AvatarFallback>{getInitials(patient.firstname+""+patient.lastname)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.firstname} {patient.lastname}</div>
                      <div className="text-xs text-muted-foreground">{patient.uid}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{patient?.age} years</span>
                    <Badge variant="outline" className="mt-1 w-fit">
                      {patient?.gender}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{patient?.whatsappNo}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{patient?.user?.email}</div>
                </TableCell>
                <TableCell>
                  {/* {patient.lastVisit ? (
                    <Badge variant="outline" className={`${getLastVisitClass(patient.lastVisit)}`}>
                      {format(new Date(patient.lastVisit), 'MMM d, yyyy')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">No visits yet</Badge>
                  )} */}
                </TableCell>
                <TableCell>
                  <div className="text-sm">{patient?.insuranceProvider || 'None'}</div>
                  <div className="text-xs text-muted-foreground">{patient?.insurancePolicyNumber}</div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <div className="flex justify-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-32 rounded-md"></div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientTable;
