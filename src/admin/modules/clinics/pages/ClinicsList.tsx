import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import ClinicService from '../services/clinic/clinicService';
import { Clinic } from "../types/Clinic";
import ClinicTable from "../components/clinic/ClinicTable";
import ClinicCardList from "../components/clinic/ClinicCardList";
import ClinicForm from "../components/clinic/ClinicForm";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import FormDialog from "@/components/ui/form-dialog";
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
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { Building2 } from "lucide-react";

const ClinicsList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<number | null>(null);
  
  const [clinicToEdit, setClinicToEdit] = useState<Clinic | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' }
      ]
    }
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: []
  });

  // For development, using mock service
  const clinicService = ClinicService;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clinics', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await clinicService.list();
      console.log("Clinic API response:", response);
      return response;
    },
  });

  const clinics = Array.isArray(data) ? data : [];

  const filteredClinics = clinics.filter(clinic => {
    // Apply search filter
    if (searchTerm && !clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !clinic.tenant?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !clinic.tenant?.clientUrl?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter if any selected
    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(clinic.tenant?.status === 'active' ? 'active' : 'inactive');
      if (!statusMatch) return false;
    }

    return true;
  });

  useEffect(() => {
    setViewMode('list'); // Always default to list
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  const handleAddClinic = () => {
    setClinicToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setClinicToEdit(null);
    refetch();
  };

  const handleEditClinic = (clinic: Clinic) => {
    setClinicToEdit(clinic);
    setIsEditFormOpen(true);
  };

  const handleDeleteClinic = (id: number) => {
    setClinicToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clinicToDelete === null) return;
    
    try {
      await clinicService.deleteById(clinicToDelete);
      toast({
        title: "Clinic deleted",
        description: "Clinic has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setClinicToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete clinic.",
        variant: "destructive",
      });
    }
  };

  const handleToggleClinicStatus = async (clinic: Clinic) => {
    const currentStatus = clinic.tenant?.status === 'active';
    const newStatus = !currentStatus;
    try {
      await clinicService.updateStatus(clinic.id as number, newStatus);
      toast({
        title: `Clinic ${newStatus ? 'activated' : 'deactivated'}`,
        description: `${clinic.name} is now ${newStatus ? 'active' : 'inactive'}.`,
        className: `${newStatus ? 'bg-green-600' : 'bg-red-600'} text-white`
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update clinic status.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      
      if (newFilters[filterId].includes(optionId)) {
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        newFilters[filterId] = [...newFilters[filterId], optionId];
      }
      
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      status: []
    });
    setSearchTerm("");
  };

  const renderForm = () => {
    return (
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Clinic"
      >
        <ClinicForm onSuccess={handleCloseForm} />
      </FormDialog>
    );
  };

  const renderEditForm = () => {
    if (!clinicToEdit) return null;
    
    if (isMobile) {
      return (
        <Drawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Edit Clinic</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ClinicForm clinic={clinicToEdit} onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Edit Clinic</DialogTitle>
            <DialogDescription>Update clinic information.</DialogDescription>
          </DialogHeader>
          <ClinicForm clinic={clinicToEdit} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  const totalElements = filteredClinics.length || 0;
  const loadedElements = filteredClinics.length || 0;

  // Count active vs. inactive
  const activeClinics = clinics.filter(c => c.tenant?.status === 'active').length;
  const inactiveClinics = clinics.filter(c => c.tenant?.status !== 'active').length;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Clinics" 
          description={`Manage all active (${activeClinics}) and inactive (${inactiveClinics}) clinics in the system`}
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Clinic"
          onAddButtonClick={handleAddClinic}
          onRefreshClick={() => refetch()}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onFilterToggle={() => setShowFilter(!showFilter)}
          showFilter={showFilter}
          icon={<Building2 className="mr-2 h-5 w-5" />}
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

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading clinics...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading clinics. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'table' ? (
              <ClinicTable 
                clinics={filteredClinics} 
                onDelete={handleDeleteClinic}
                onEdit={handleEditClinic}
                onToggleStatus={handleToggleClinicStatus}
              />
            ) : (
              <ClinicCardList 
                clinics={filteredClinics} 
                onDelete={handleDeleteClinic}
                onEdit={handleEditClinic}
                onToggleStatus={handleToggleClinicStatus}
              />
            )}
          </div>
        )}
      </div>
      
      {renderForm()}
      {renderEditForm()}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the clinic
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClinicToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ClinicsList;
