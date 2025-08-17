
import React from "react";
import { Patient } from "../types/Patient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Calendar, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import RowActions from "@/components/ui/RowActions";

interface PatientTableProps {
  patients: Patient[];
  loading?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
  showPaymentStatus?: boolean;
}

const PatientTable: React.FC<PatientTableProps> = ({ 
  patients, 
  loading = false, 
  onDelete, 
  onEdit, 
  onView,
  showPaymentStatus = false 
}) => {
  const getActions = (patient: Patient) => {
    const actions = [];
    
    if (onView) {
      actions.push({
        label: "View Details",
        onClick: () => onView(patient),
        icon: User
      });
    }
    
    if (onEdit) {
      actions.push({
        label: "Edit Patient",
        onClick: () => onEdit(patient),
        icon: User
      });
    }
    
    if (onDelete) {
      actions.push({
        label: "Delete",
        onClick: () => onDelete(patient.id),
        icon: User,
        variant: "destructive" as const
      });
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Ref. Doctor</TableHead>
              {showPaymentStatus && <TableHead>Payment Status</TableHead>}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell>
                    <div className="animate-pulse h-4 w-32 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-24 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-40 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-20 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-24 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="animate-pulse h-4 w-32 bg-gray-200 rounded" />
                  </TableCell>
                  {showPaymentStatus && (
                    <TableCell>
                      <div className="animate-pulse h-4 w-20 bg-gray-200 rounded" />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="animate-pulse h-4 w-16 bg-gray-200 rounded" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No patients found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Ref. Doctor</TableHead>
            {showPaymentStatus && <TableHead>Payment Status</TableHead>}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-clinic-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-clinic-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {patient.firstname} {patient.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {patient.uid || patient.id}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    <span>{patient.mobile || patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{patient.email}</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-xs truncate">
                    {patient.address}
                    {patient.city && `, ${patient.city}`}
                    {patient.state?.name && `, ${patient.state.name}`}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{patient.age}y</div>
                  <Badge variant="outline" className="text-xs">
                    {patient.gender}
                  </Badge>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {patient.lastVisit 
                      ? format(new Date(patient.lastVisit), 'MMM dd, yyyy')
                      : 'No visits'
                    }
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                {patient.refDoctor ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Stethoscope className="h-3 w-3" />
                    <span>
                      Dr. {patient.refDoctor.firstname} {patient.refDoctor.lastname}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
              
              {showPaymentStatus && (
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    Paid
                  </Badge>
                </TableCell>
              )}
              
              <TableCell>
                <RowActions actions={getActions(patient)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
