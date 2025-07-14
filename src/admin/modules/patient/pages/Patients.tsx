
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/admin/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { usePatients } from "../hooks/usePatients";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import PageHeader from "@/admin/components/PageHeader";
import PatientGrid from "../components/PatientGrid";
import PatientHorizontalCard from "../components/PatientHorizontalCard";
import PatientFormDialog from "@/admin/components/dialogs/PatientFormDialog";
import { Patient } from "../types/Patient";
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
import PatientService from "../services/patientService";
import PatientCardSkeleton from "@/admin/components/skeletons/PatientCardSkeleton";

const PatientsAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);

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
    page: 0,
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
      lastVisit: []
    });
    
    // Reset filters and fetch patients
    updateFilters({
      searchTerm: "", 
      gender: [], 
      ageGroup: [], 
      lastVisit: []
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
    navigate(`/admin/patients/view/${patient.id}`);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowAddDialog(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowEditDialog(true);
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

  const handleFormSuccess = () => {
    refreshPatients();
  };

  // Save scroll position before loading more data
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      scrollPosRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  // Restore scroll position after new data is loaded
  useEffect(() => {
    if (scrollContainerRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeightRef.current;
      
      // Adjust scroll position to maintain relative position
      scrollContainerRef.current.scrollTop = scrollPosRef.current + heightDifference;
      
      // Reset after applying
      prevScrollHeightRef.current = 0;
    }
  }, [patients.length]);

  // Handle infinite scrolling with improved scroll position handling
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      // Save position before loading more
      saveScrollPosition();
      
      // Load more data
      await loadMore();
      
      // Scroll position will be restored by the useEffect above
    }
  };

  return (
    <>
      <AdminLayout 
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
          ref={scrollContainerRef}
          className="overflow-auto flex-1 pb-6" 
          onScroll={handleScroll}
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {loading && patients.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <PatientCardSkeleton key={index} />
                ))
              ) : (
                patients.map((patient) => (
                  <PatientHorizontalCard
                    key={patient.id}
                    patient={patient}
                    onView={handlePatientClick}
                    onEdit={handleEditPatient}
                    onDelete={handleDeletePatient}
                    onPatientClick={handlePatientClick}
                  />
                ))
              )}
            </div>
          ) : (
            <PatientGrid 
              patients={patients}
              loading={loading}
            />
          )}
          
          {loading && patients.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
            </div>
          )}
        </div>
      </AdminLayout>

      <PatientFormDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleFormSuccess}
      />

      <PatientFormDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleFormSuccess}
        patient={editingPatient}
      />

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
    </>
  );
};

export default PatientsAdmin;
