import { useEffect, useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "../hooks/useAppointments";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import PageHeader from "@/admin/components/PageHeader";
import InfiniteAppointmentList from "../components/AppointmentList";
import AppointmentCalendar from "../components/AppointmentCalendar";
import AppointmentForm from "../components/AppointmentForm";
import { AppointmentQueryParams } from "../types/Appointment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doctorFromAppointment } from "../services/appointmentService";
import { Doctor } from "../types/Doctor";
import { BookAppointmentModal } from "../components/BookAppointmentModal";

const AppointmentsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("UPCOMING");
  const [appointmentToEdit, setAppointmentToEdit] = useState<any | null>(null);
  const { toast } = useToast();

  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({
    types: [],
    statuses: [],
    branches: [],
    doctors: [],
    searchTerm: null,
    date: null,
    status: activeTab
  });

  // Define filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    // {
    //   id: 'statuses',
    //   label: 'Statussss',
    //   options: [
    //     { id: 'UPCOMING', label: 'Upcoming' },
    //     { id: 'COMPLETED', label: 'Completed' },
    //     { id: 'CANCELLED', label: 'Cancelled' },
    //     { id: 'IN_PROGRESS', label: 'In Progress' }
    //   ]
    // },
    {
      id: 'doctors',
      label: 'Doctor',
      options: []
    },
  ]);


  useEffect(() => {
    fetchDoctorsFromAppointment();
  }, []);

  const fetchDoctorsFromAppointment = async () => {
    try {
      const res = await doctorFromAppointment();
      if (res.data) {

        setFilterOptions(prevOptions => {
          return prevOptions.map(option => {
            if (option.id === 'doctors') {
              return { ...option, options: res.data.map((doctor: Doctor) => ({ id: doctor.id, label: doctor.firstname })) };
            }
            return option;
          });
        });

      }
    } catch (error) {

    }
  }

  // Use the custom hook for appointments with lazy loading
  const {
    appointments,
    loading,
    hasMore,
    loadMore,
    refreshAppointments,
    updateFilters
  } = useAppointments({
    pageno: 0,
    pagesize: 10,
    doctorId: 1,
    searchTerm: null,
    statuses: [],
    branches: [],
    doctors: [],
    date: null
  } as AppointmentQueryParams);

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterId]?.includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...(newFilters[filterId] || []), optionId];
      }

      // Update the filters using the updateFilters function
      updateFilters({
        ...newFilters,
        doctors: newFilters.doctors?.map(Number) || [] // Convert branch IDs to numbers
      });

      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilters({
      types: [],
      statuses: [],
      assignees: [],
      searchTerm: null,
      status: activeTab,
      branches: [],
      doctors: [],
      date: null,
    });
    updateFilters({
      pageno: 0,
      pagesize: 10,
      doctorId: 1,
      status: activeTab,
      searchTerm: null,
      doctors: [],
      statuses: [],
      branches: [], // Added to match the AppointmentQueryParams type
      date: null,
    } as AppointmentQueryParams);
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowSidebar(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setAppointmentToEdit(appointment);
    setIsFormOpen(true);
  };

  const handleAddAppointment = () => {
    setAppointmentToEdit(null);
    setIsFormOpen(true);
  };

  const handleStartAppointment = (appointment: any) => {
    toast({
      title: "Starting Appointment",
      description: "Navigating to appointment...",
    });
  };

  const handlePayment = (appointment: any) => {
    toast({
      title: "Payment Recording",
      description: `Recording payment for ${appointment.patient.firstname} ${appointment.patient.lastname}`,
    });
  };

  const handleProcess = (appointment: any) => {
    toast({
      title: "Processing Appointment",
      description: `Moving appointment to process stage...`,
    });
  };

  const handlePatientClick = (appointment: any) => {
    toast({
      title: "Patient Profile",
      description: `Opening profile for ${appointment.patient.firstname} ${appointment.patient.lastname}`,
    });
    // Here you would open a patient profile dialog/modal
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setAppointmentToEdit(null);
    refreshAppointments();
  };

  const onSearchChanege = async (term: string) => {
    updateFilters({
      ...selectedFilters,
      searchTerm: term,
      pageno: 0,
    });
    setSearchTerm(term);
  };
  const onActiveTabChange = async (activeTabName: string) => {
    updateFilters({
      ...selectedFilters,
      status: activeTabName,
      pageno: 0,
    });
    setActiveTab(activeTabName);
  };
  return (
    <AdminLayout
      showAddButton={true}
      onAddButtonClick={handleAddAppointment}
    >
      <PageHeader
        title="Appointments"
        onViewModeToggle={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
        viewMode={viewMode}
        showAddButton={true}
        addButtonLabel="New Appointment"
        onAddButtonClick={handleAddAppointment}
        onFilterToggle={() => setShowFilters(!showFilters)}
        showFilter={showFilters}
      />

      {showFilters && (
        <FilterCard
          searchTerm={searchTerm}
          onSearchChange={onSearchChanege}
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      )}

      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="UPCOMING">
            UPCOMING
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-muted">
              {/* {clinicRequests.length} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value="CHECKEDIN">
            CHECKED IN
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-muted">
              {/* {clinicRequests.length} */}
            </span>
          </TabsTrigger>

          <TabsTrigger value="IN_PROGRESS">
            IN PROGRESS
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
              {/* {pendingCount} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value="COMPLETED">
            COMPLETED
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
              {/* {approvedCount} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value="CANCELLED">
            CANCELLED
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
              {/* {rejectedCount} */}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <InfiniteAppointmentList
          appointments={appointments}
          loading={loading}
          hasMore={hasMore}
          loadMore={loadMore}
          onAppointmentClick={handleAppointmentClick}
          onStartAppointment={handleStartAppointment}
          onEditAppointment={handleEditAppointment}
          onPayment={handlePayment}
          onProcess={handleProcess}
          onPatientClick={handlePatientClick}
        />
      )}

      <BookAppointmentModal doctor={null} trigger={null} open={isFormOpen} onOpenChange={setIsFormOpen} />



      {/* <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">
              {appointmentToEdit ? "Edit Appointment" : "Create New Appointment"}
            </DialogTitle>
            <DialogDescription>
              {appointmentToEdit ? "Update appointment information." : "Fill in the details to create a new appointment."}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm appointment={appointmentToEdit} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog> */}
    </AdminLayout>
  );
};

export default AppointmentsAdmin;
