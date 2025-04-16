
import { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { usePatients } from "../hooks/usePatients";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import PatientSidebar from "../components/PatientSidebar";
import PageHeader from "@/admin/components/PageHeader";
import PatientTable from "../components/PatientTable";
import PatientGrid from "../components/PatientGrid";
import { Patient } from "../types/Patient";

const PatientsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    gender: [],
    ageGroup: [],
    lastVisit: []
  });

  // Use the custom hook for patients with lazy loading
  const {
    patients,
    loading,
    hasMore,
    loadMore,
    refreshPatients,
    updateFilters,
    totalElements,
    loadedElements
  } = usePatients({
    page: 1,
    size: 10
  });

  // Define filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'gender',
      label: 'Gender',
      options: [
        { id: 'Male', label: 'Male' },
        { id: 'Female', label: 'Female' },
        { id: 'Other', label: 'Other' }
      ]
    },
    {
      id: 'ageGroup',
      label: 'Age Group',
      options: [
        { id: 'pediatric', label: 'Pediatric (<18)' },
        { id: 'young-adult', label: 'Young Adult (18-30)' },
        { id: 'middle-aged', label: 'Middle Aged (30-50)' },
        { id: 'adult', label: 'Adult (50-65)' },
        { id: 'senior', label: 'Senior (65+)' }
      ]
    },
    {
      id: 'lastVisit',
      label: 'Last Visit',
      options: [
        { id: 'recent', label: 'Recent (< 30 days)' },
        { id: 'medium', label: 'Medium (30-180 days)' },
        { id: 'old', label: 'Old (180+ days)' },
        { id: 'none', label: 'No visits' }
      ]
    }
  ];

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterId]?.includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...(newFilters[filterId] || []), optionId];
      }
      return newFilters;
    });
    
    // Update filters and fetch patients
    updateFilters({ 
      [filterId]: selectedFilters[filterId]?.includes(optionId) 
        ? selectedFilters[filterId].filter(id => id !== optionId)
        : [...(selectedFilters[filterId] || []), optionId]
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilters({
      gender: [],
      ageGroup: [],
      lastVisit: [],
      insuranceProvider: []
    });
    
    // Reset filters and fetch patients
    updateFilters({
      searchTerm: "", 
      gender: [], 
      ageGroup: [], 
      lastVisit: [], 
      insuranceProvider: []
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // Debounce for better performance
    const handler = setTimeout(() => {
      updateFilters({ searchTerm: term });
    }, 300);
    
    return () => clearTimeout(handler);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowSidebar(true);
  };

  const handleAddPatient = () => {
    toast({
      title: "Add Patient",
      description: "This feature is coming soon.",
    });
  };

  // Handle infinite scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <AdminLayout 
      rightSidebar={showSidebar ? <PatientSidebar patient={selectedPatient} onClose={() => setShowSidebar(false)} /> : undefined}
      onUserClick={() => setShowSidebar(!showSidebar)}
      showAddButton={true}
      onAddButtonClick={handleAddPatient}
    >
      <PageHeader 
        title="Patients"
        onViewModeToggle={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
        viewMode={viewMode}
        showAddButton={true}
        addButtonLabel="New Patient"
        onAddButtonClick={handleAddPatient}
        onRefreshClick={refreshPatients}
        onFilterToggle={() => setShowFilters(!showFilters)}
        showFilter={showFilters}
        loadedElements={loadedElements}
        totalElements={totalElements}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      />

      {showFilters && (
        <FilterCard 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      )}

     
      <div 
        className="overflow-auto flex-1 pb-6" 
        onScroll={handleScroll}
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {viewMode === 'list' ? (
          <PatientTable 
            patients={patients}
            onDelete={(id) => console.log('Delete patient:', id)}
            onPatientClick={handlePatientClick}
            loading={loading}
          />
        ) : (
          <PatientGrid 
            patients={patients}
            loading={loading}
            onPatientClick={handlePatientClick}
          />
        )}
        
        {loading && patients.length > 0 && (
          <div className="flex justify-center my-4">
            <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PatientsAdmin;
