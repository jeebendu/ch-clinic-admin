
import React, { useState } from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePatients } from "../hooks/usePatients";
import PatientTable from "../components/PatientTable";
import PatientCardList from "../components/PatientCardList";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import PatientService from "../services/patientService";

const PatientListPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isMobile ? 'list' : 'grid');
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

  // Define filter options
  const [filters] = useState<FilterOption[]>([
    {
      id: 'gender',
      label: 'Gender',
      options: [
        { id: 'male', label: 'Male' },
        { id: 'female', label: 'Female' },
        { id: 'other', label: 'Other' }
      ]
    },
    {
      id: 'ageGroup',
      label: 'Age Group',
      options: [
        { id: '0-18', label: '0-18 years' },
        { id: '19-35', label: '19-35 years' },
        { id: '36-55', label: '36-55 years' },
        { id: '56+', label: '56+ years' }
      ]
    },
    {
      id: 'lastVisit',
      label: 'Last Visit',
      options: [
        { id: 'today', label: 'Today' },
        { id: 'this-week', label: 'This Week' },
        { id: 'this-month', label: 'This Month' },
        { id: 'older', label: 'Older' }
      ]
    }
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    gender: [],
    ageGroup: [],
    lastVisit: []
  });

  // Use the patients hook
  const {
    patients,
    loading,
    error,
    hasMore,
    loadMore,
    refreshPatients,
    updateFilters,
    totalElements,
    loadedElements
  } = usePatients({
    page: 0,
    size: 20,
    searchTerm,
    gender: selectedFilters.gender,
    ageGroup: selectedFilters.ageGroup,
    lastVisit: selectedFilters.lastVisit
  });

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ searchTerm: value, page: 0 });
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      
      if (newFilters[filterId].includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...newFilters[filterId], optionId];
      }
      
      // Update the patients hook with new filters
      updateFilters({
        gender: newFilters.gender,
        ageGroup: newFilters.ageGroup,
        lastVisit: newFilters.lastVisit,
        page: 0
      });
      
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      gender: [],
      ageGroup: [],
      lastVisit: []
    });
    setSearchTerm("");
    updateFilters({
      searchTerm: "",
      gender: [],
      ageGroup: [],
      lastVisit: [],
      page: 0
    });
  };

  const handleDeletePatient = (id: number) => {
    setPatientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (patientToDelete === null) return;
    
    try {
      await PatientService.deleteById(patientToDelete);
      toast({
        title: "Patient deleted",
        description: "Patient has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refreshPatients();
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient.",
        variant: "destructive",
      });
    }
  };

  const handleAddPatient = () => {
    // TODO: Implement add patient functionality
    console.log("Add patient clicked");
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Patients" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Patient"
          onAddButtonClick={handleAddPatient}
          onRefreshClick={refreshPatients}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onFilterToggle={() => setShowFilter(!showFilter)}
          showFilter={showFilter}
          onSearchChange={handleSearchChange}
          searchValue={searchTerm}
        />

        {showFilter && (
          <FilterCard 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {loading && patients.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading patients. Please try again.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[calc(100vh-180px)]">
            {viewMode === 'grid' ? (
              <PatientTable 
                patients={patients} 
                onDelete={handleDeletePatient}
                loading={loading}
              />
            ) : (
              <PatientCardList 
                patients={patients} 
                onDelete={handleDeletePatient}
                loading={loading}
              />
            )}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-4 py-2 bg-clinic-primary text-white rounded-md hover:bg-clinic-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default PatientListPage;
