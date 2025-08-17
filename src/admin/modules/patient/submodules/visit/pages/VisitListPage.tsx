import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Visit } from "../types/Visit";
import { VisitList } from "../components/VisitList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { PaymentDialog } from "../components/PaymentDialog";
import { useDebounce } from "@/hooks/use-debounce";
import { FormDialog } from "@/components/ui/form-dialog";
import VisitForm from "../components/VisitForm";
import ReportsDialog from '@/admin/components/dialogs/ReportsDialog';

export const VisitListPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Visit>[] = [
    {
      accessorKey: "patient.firstname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: "patient.lastname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
    },
    {
      accessorKey: "patient.age",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Age" />
      ),
    },
    {
      accessorKey: "patient.gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
    },
    {
      accessorKey: "createdTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created Time" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const visit = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(visit.patient?.firstname || "")}
              >
                Copy patient name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: visits,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      const mockVisits: Visit[] = [
        {
          id: '1',
          patient: { id: '1', firstname: 'John', lastname: 'Doe', age: 30, gender: 'Male' },
          referByDoctor: { id: '1', firstname: 'Dr. Smith', lastname: '', specializationList: [] },
          consultingDoctor: { id: '2', firstname: 'Dr. Jane', lastname: 'Doe', specializationList: [] },
          complaints: 'Headache, fever',
          scheduleDate: '2024-07-15',
          type: 'General Checkup',
          status: 'Open',
          notes: 'Patient reports mild discomfort.',
          paymentStatus: 'Pending',
          paymentAmount: 150,
          paymentPaid: 0,
          referralDoctorName: 'Dr. Adam',
          createdTime: new Date().toISOString()
        },
        {
          id: '2',
          patient: { id: '2', firstname: 'Alice', lastname: 'Smith', age: 25, gender: 'Female' },
          referByDoctor: { id: '3', firstname: 'Dr. Johnson', lastname: '', specializationList: [] },
          consultingDoctor: { id: '4', firstname: 'Dr. David', lastname: 'Lee', specializationList: [] },
          complaints: 'Cough, sore throat',
          scheduleDate: '2024-07-16',
          type: 'Follow-up',
          status: 'Closed',
          notes: 'Patient shows improvement.',
          paymentStatus: 'Paid',
          paymentAmount: 100,
          paymentPaid: 100,
          referralDoctorName: 'Dr. Eve',
          createdTime: new Date().toISOString()
        },
        {
          id: '3',
          patient: { id: '3', firstname: 'Bob', lastname: 'Johnson', age: 40, gender: 'Male' },
          referByDoctor: { id: '5', firstname: 'Dr. Williams', lastname: '', specializationList: [] },
          consultingDoctor: { id: '6', firstname: 'Dr. Sarah', lastname: 'Brown', specializationList: [] },
          complaints: 'Back pain',
          scheduleDate: '2024-07-17',
          type: 'Consultation',
          status: 'Follow-up',
          notes: 'Patient needs physical therapy.',
          paymentStatus: 'Partial',
          paymentAmount: 200,
          paymentPaid: 100,
          referralDoctorName: 'Dr. Frank',
          createdTime: new Date().toISOString()
        },
      ];
      setVisits(mockVisits);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreate = () => {
    navigate("/admin/patients/visit/new");
  };

  const handleViewDetails = (visit: Visit) => {
    toast({
      title: "View Details",
      description: `Viewing details for visit ${visit.id}`,
    });
  };

  const handleEditVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handleMarkPayment = (visit: Visit) => {
    setSelectedVisit(visit);
    setPaymentDialogOpen(true);
  };

  const handleViewReports = (visit: Visit) => {
    setSelectedVisit(visit);
    setReportsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visits</h2>
          <p className="text-muted-foreground">
            Here are all the visits in your account.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">
            Search:
          </Label>
          <Input
            id="search"
            placeholder="Search visits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Create Visit
          </Button>
        </div>
      </div>

      {/* Visit List */}
      <VisitList
        visits={visits}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEditVisit={handleEditVisit}
        onMarkPayment={handleMarkPayment}
        onViewReports={handleViewReports}
      />

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        visit={selectedVisit}
      />

      {/* Edit Visit Dialog */}
      <FormDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Edit Visit"
      >
        <VisitForm
          onClose={() => setEditDialogOpen(false)}
          visit={selectedVisit}
        />
      </FormDialog>

      <ReportsDialog
        isOpen={reportsDialogOpen}
        onClose={() => setReportsDialogOpen(false)}
        visit={selectedVisit}
      />
    </div>
  );
};
