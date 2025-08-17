import React from 'react';
import { Visit } from '../types/Visit';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pencil,
  Eye,
  CreditCard,
  Edit,
  Trash2,
  FileText
} from "lucide-react"
import { format } from 'date-fns';
import RowActions, { RowAction } from '@/components/ui/RowActions';

interface VisitListProps {
  visits: Visit[];
  isLoading: boolean;
  onViewPayment: (visit: Visit) => void;
  onViewReports: (visit: Visit) => void;
}

const VisitList: React.FC<VisitListProps> = ({ 
  visits, 
  isLoading,
  onViewPayment,
  onViewReports
}) => {

  const handleViewDetails = (visit: Visit) => {
    console.log('View details for visit:', visit.id);
    // Implement view details logic here
  };

  const handleEdit = (visit: Visit) => {
    console.log('Edit visit:', visit.id);
    // Implement edit logic here
  };

  const handleDelete = (visit: Visit) => {
    console.log('Delete visit:', visit.id);
    // Implement delete logic here
  };

  const getRowActions = (visit: Visit): RowAction[] => [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => handleViewDetails(visit)
    },
    {
      label: "View Payment",
      icon: <CreditCard className="h-4 w-4" />,
      onClick: () => onViewPayment(visit)
    },
    {
      label: "View Reports",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => onViewReports(visit)
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => handleEdit(visit)
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => handleDelete(visit),
      confirm: true,
      confirmTitle: "Delete Visit",
      confirmDescription: "Are you sure you want to delete this visit? This action cannot be undone.",
      variant: "destructive"
    }
  ];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Visit ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Appointment Time</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : visits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No visits found.</TableCell>
            </TableRow>
          ) : (
            visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.id}</TableCell>
                <TableCell>{visit.patientName}</TableCell>
                <TableCell>{visit.appointmentDate}</TableCell>
                <TableCell>{visit.appointmentTime}</TableCell>
                <TableCell>{visit.doctorName}</TableCell>
                <TableCell>{visit.branchName}</TableCell>
                <TableCell className="text-right">
                  <RowActions actions={getRowActions(visit)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitList;
