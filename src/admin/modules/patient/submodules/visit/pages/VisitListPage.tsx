import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, CreditCard, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns";

import { Visit } from '../types/Visit';
import { getAllVisits } from '../services/visitService';
import { Doctor } from '@/admin/modules/doctor/types/Doctor';
import { getAllDoctors } from '@/admin/modules/doctor/services/doctorService';
import { Patient } from '@/admin/modules/patient/types/Patient';
import { getAllPatients } from '@/admin/modules/patient/services/patientService';
import RowActions from '@/components/ui/RowActions';
import PaymentDialog from '../components/PaymentDialog';
import ReportsDialog from '@/admin/components/dialogs/ReportsDialog';

const VisitListPage: React.FC = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const visitsData = await getAllVisits();
      setVisits(visitsData);

      const doctorsData = await getAllDoctors();
      setDoctors(doctorsData);

      const patientsData = await getAllPatients();
      setPatients(patientsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch visits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    navigate('/admin/visits/new');
  };

  const handleViewDetails = (visit: Visit) => {
    navigate(`/admin/visits/${visit.id}`);
  };

  const handleEdit = (visit: Visit) => {
    navigate(`/admin/visits/edit/${visit.id}`);
  };

  const handleDelete = async (visit: Visit) => {
    // Implement delete logic here
    console.log('Delete visit:', visit.id);
  };

  const handleViewPayment = (visit: Visit) => {
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const handleViewReports = (visit: Visit) => {
    setSelectedVisit(visit);
    setReportsDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedVisit(null);
    fetchData();
  };

  const handleCloseReportsDialog = () => {
    setReportsDialogOpen(false);
    setSelectedVisit(null);
  };

  const filteredVisits = visits.filter(visit => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const doctorFilter = selectedDoctor ? visit.doctorId === selectedDoctor : true;
    const patientFilter = selectedPatient ? visit.patientId === selectedPatient : true;
    const dateFilter = date?.from && date?.to ?
      new Date(visit.appointmentDate) >= date.from && new Date(visit.appointmentDate) <= date.to :
      true;

    return searchRegex.test(visit.patientName) && doctorFilter && patientFilter && dateFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Visits</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Visit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select onValueChange={setSelectedDoctor}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Doctor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Doctors</SelectItem>
            {doctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedPatient}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Patients</SelectItem>
            {patients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              pagedNavigation
            />
          </PopoverContent>
        </Popover>
      </div>

      <VisitList 
        visits={filteredVisits}
        isLoading={isLoading}
        onViewPayment={handleViewPayment}
        onViewReports={handleViewReports}
      />

      {selectedVisit && (
        <PaymentDialog
          visit={selectedVisit}
          isOpen={paymentDialogOpen}
          onClose={handleClosePaymentDialog}
        />
      )}

      {selectedVisit && (
        <ReportsDialog
          visit={selectedVisit}
          isOpen={reportsDialogOpen}
          onClose={handleCloseReportsDialog}
        />
      )}
    </div>
  );
};

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
  const navigate = useNavigate();

  const handleViewDetails = (visit: Visit) => {
    navigate(`/admin/visits/${visit.id}`);
  };

  const handleEdit = (visit: Visit) => {
    navigate(`/admin/visits/edit/${visit.id}`);
  };

  const handleDelete = async (visit: Visit) => {
    // Implement delete logic here
    console.log('Delete visit:', visit.id);
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
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : visits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No visits found.</TableCell>
            </TableRow>
          ) : (
            visits.map(visit => (
              <TableRow key={visit.id}>
                <TableCell>{visit.patientName}</TableCell>
                <TableCell>{visit.doctorName}</TableCell>
                <TableCell>{visit.appointmentDate}</TableCell>
                <TableCell>{visit.appointmentTime}</TableCell>
                <TableCell>{visit.status}</TableCell>
                <TableCell className="text-right">
                  <RowActions actions={getRowActions(visit)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {visits.length} Visits
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default VisitListPage;
