
import { useEffect, useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "../hooks/useAppointments";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import AppointmentSidebar from "../components/AppointmentSidebar";
import PageHeader from "@/admin/components/PageHeader";
import InfiniteAppointmentList from "../components/AppointmentList";
import AppointmentCalendar from "../components/AppointmentCalendar";
import { Doctor } from "../../doctor/types/Doctor";
import { AppointmentQueryParams } from "../types/Appointment";
import DoctorService from "../../doctor/services/doctorService";

const AppointmentsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor>();

  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    types: [],
    statuses: [],
    branches: [],
    searchTerm: null,
  });
  // Define filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    {
      id: 'statuses',
      label: 'Status',
      options: [
        { id: 'UPCOMING', label: 'Upcoming' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' },
        { id: 'IN_PROGRESS', label: 'In Progress' }
      ]
    },
    {
      id: 'branches',
      label: 'Branch',
      options: []
    }
  ]);
  // Use the custom hook for appointments with lazy loading
  const {
    appointments,
    loading,
    hasMore,
    loadMore,
    refreshAppointments,
    updateFilters
  } = useAppointments({
    page: 0,
    size: 10,
    doctorId: 1, // Replace with actual doctor ID when available
    searchTerm: null,
    statuses: [],
    branches: [] // Added to match the AppointmentQueryParams type
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
        branches: newFilters.branches?.map(Number) || [] // Convert branch IDs to numbers
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
      branches: []
    });
    updateFilters({
      page: 0,
      size: 10,
      doctorId: 1,
      searchTerm: null,
      statuses: [],
      branches: [] // Added to match the AppointmentQueryParams type
    } as AppointmentQueryParams);
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowSidebar(true);
  };

  const handleAddAppointment = () => {
    toast({
      title: "Add Appointment",
      description: "This feature is coming soon.",
    });
  };

  const handleStartAppointment = (appointment: any) => {
    toast({
      title: "Starting Appointment",
      description: "Navigating to appointment...",
    });
  };

  useEffect(() => {
    const fetchDocttorInfo = async () => {
      const data = await DoctorService.getById(1);
      setDoctor(data);

      // Dynamically update branch options in filterOptions
      setFilterOptions(prevOptions => {
        return prevOptions.map(option => {
          if (option.id === 'branches') {
            return {
              ...option,
              options: data.branchList.map((branch: any) => ({
                id: branch.id,
                label: branch.name
              }))
            };
          }
          return option;
        });
      });
    };

    fetchDocttorInfo();
  }, []);

  
  const onSearchChanege = async (term: string) => {
    updateFilters({
      ...selectedFilters,
      searchTerm: term,
      page: 0,
    });
    setSearchTerm(term);
  };

  return (
    <AdminLayout
      rightSidebar={showSidebar ? <AppointmentSidebar onClose={() => setShowSidebar(false)} appointments={appointments} /> : undefined}
      onUserClick={() => setShowSidebar(!showSidebar)}
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
        />
      )}
    </AdminLayout>
  );
};

export default AppointmentsAdmin;
