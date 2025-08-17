
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import PatientService from "../services/patientService";
import { Patient } from "../types/Patient";
import PatientTable from "./PatientTable";
import PatientCardList from "./PatientCardList";
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
import { useBranchFilter } from "@/hooks/use-branch-filter";

interface PatientListProps {
  showHeader?: boolean;
  onPatientSelect?: (patient: Patient) => void;
  onPatientEdit?: (patient: Patient) => void;
  onPatientDelete?: (patient: Patient) => void;
  onPatientAdd?: () => void;
  initialViewMode?: 'list' | 'grid';
  maxHeight?: string;
}

const PatientList: React.FC<PatientListProps> = ({
  showHeader = true,
  onPatientSelect,
  onPatientEdit,
  onPatientDelete,
  onPatientAdd,
  initialViewMode,
  maxHeight = "calc(100vh-180px)"
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(
    initialViewMode || (isMobile ? 'list' : 'grid')
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const { selectedBranch } = useBranchFilter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['patients', page, size, searchTerm, selectedBranch],
    queryFn: async () => {
      const response = await PatientService.list(page, size, searchTerm);
      return response;
    },
  });

  // Extract patients from the response - handle different response formats
  const patients = data?.content || (Array.isArray(data) ? data : []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleDeletePatient = (patient: Patient) => {
    if (onPatientDelete) {
      onPatientDelete(patient);
    } else {
      setPatientToDelete(patient);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (patientToDelete === null) return;
    
    try {
      await PatientService.deleteById(patientToDelete.id);
      toast({
        title: "Patient deleted",
        description: "Patient has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
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

  const totalElements = data?.totalElements || patients.length || 0;
  const loadedElements = patients.length || 0;

  return (
    <>
      <div className="space-y-4">
        {showHeader && (
          <PageHeader 
            title="Patients" 
            viewMode={viewMode}
            onViewModeToggle={toggleViewMode}
            showAddButton={!!onPatientAdd}
            addButtonLabel="Add Patient"
            onAddButtonClick={onPatientAdd}
            onRefreshClick={() => refetch()}
            loadedElements={loadedElements}
            totalElements={totalElements}
            onSearchChange={handleSearchChange}
            searchValue={searchTerm}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading patients. Please try again.</p>
          </div>
        ) : (
          <div className="overflow-auto" style={{ maxHeight }}>
            {viewMode === 'grid' ? (
              <PatientTable 
                patients={patients} 
                onDelete={(id) => {
                  const patient = patients.find(p => p.id === id);
                  if (patient) handleDeletePatient(patient);
                }}
                onEdit={onPatientEdit}
                onView={onPatientSelect}
                loading={isLoading}
              />
            ) : (
              <PatientCardList 
                patients={patients} 
                onDelete={(id) => {
                  const patient = patients.find(p => p.id === id);
                  if (patient) handleDeletePatient(patient);
                }}
                onEdit={onPatientEdit}
                onView={onPatientSelect}
                loading={isLoading}
              />
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
    </>
  );
};

export default PatientList;
