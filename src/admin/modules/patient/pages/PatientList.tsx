
import React, { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import PatientTable from "../components/PatientTable";
import PatientCardList from "../components/PatientCardList";
import { Patient } from "../types/Patient";
import { usePatients } from "../hooks/usePatients";
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientService from "../services/patientService";
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

const PatientList = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

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
    size: 12,
    searchTerm: ""
  });

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadMore();
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <PageHeader 
          title="Patients" 
          description="Manage your clinic's patients"
          viewMode={viewMode}
          onViewModeToggle={handleViewModeToggle}
          showAddButton={true}
          addButtonLabel="Add Patient"
          onAddButtonClick={() => {/* Add patient form would go here */}}
          onRefreshClick={refreshPatients}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onSearchChange={handleSearchChange}
        />

        <ScrollArea 
          className="flex-1 px-1" 
          onScroll={handleScroll}
          style={{ height: 'calc(100vh - 180px)' }}
        >
          {viewMode === 'grid' ? (
            <PatientCardList 
              patients={patients} 
              onDelete={handleDeletePatient}
              loading={loading}
            />
          ) : (
            <PatientTable 
              patients={patients} 
              onDelete={handleDeletePatient}
              loading={loading}
            />
          )}
          
          {loading && patients.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse bg-gray-200 h-8 w-40 rounded-md"></div>
            </div>
          )}
        </ScrollArea>
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

export default PatientList;
