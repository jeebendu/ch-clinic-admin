

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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SpecialityService, { EnquiryServiceTypeMapService } from "../services/EnquiryServiceTypeMapService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import SpecialityTable from "../components/EnquiryServiceTable";
import SpecialityForm from "../components/EnquiryServiceTypeForm";
import { EnquiryServiceType } from "@/admin/modules/doctor/submodules/percentage/types/DoctorPercentage";
import { ClinicServicemap } from "../types/ClinicServicemap";

const EnquiryServiceTypeList = () => {

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isMobile ? 'list' : 'grid');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specialityToDelete, setSpecialityToDelete] = useState<number | null>(null);
  
  const [specialityToEdit, setSpecialityToEdit] = useState<ClinicServicemap | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Define filter options
  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' }
      ]
    },
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    location: []
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['speciality', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await EnquiryServiceTypeMapService.list();
      return response;
    },
  });

  const speciality = Array.isArray(data) ? data : [];
  console.log("Extracted Service:", speciality);

  const filteredSpeciality = speciality.filter(speciality => {
    // Filter by search term
    if (searchTerm && !speciality.name.toLowerCase().includes(searchTerm.toLowerCase()) ) {
      return false;
    }  

    return true;
  });

  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleAddSpeciality = () => {
    setSpecialityToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setSpecialityToEdit(null);
    refetch();
  };

  const handleEditSpeciality = (speciality :ClinicServicemap) => {
    setSpecialityToEdit(speciality);
    setIsEditFormOpen(true);
  };

  const handleDeleteSpeciality = (id: number) => {
    setSpecialityToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (specialityToDelete === null) return;
    
    try {
      await SpecialityService.deleteById(specialityToDelete);
      toast({
        title: "Service deleted",
        description: "Service has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setSpecialityToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Service.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      
      if (newFilters[filterId].includes(optionId)) {
        // Remove filter if already selected
        newFilters[filterId] = newFilters[filterId].filter(id => id !== optionId);
      } else {
        // Add filter if not already selected
        newFilters[filterId] = [...newFilters[filterId], optionId];
      }
      
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      status: [],
      location: []
    });
    setSearchTerm("");
  };

  const renderForm = () => {
    if (isMobile) {
      return (
        <Drawer open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Add New Service</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
            <SpecialityForm onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent mobileDrawer={true}>
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Add New Service</DialogTitle>
            <DialogDescription>Add a new Service to your doctor network.</DialogDescription>
          </DialogHeader>
          <DialogBody>

          <SpecialityForm onSuccess={handleCloseForm} />
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  };

  const renderEditForm = () => {
    if (!specialityToEdit) return null;
    
    if (isMobile) {
      return (
        <Drawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Edit Service</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
            <SpecialityForm speciality={specialityToEdit} onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Edit Service</DialogTitle>
            <DialogDescription>Update Service information.</DialogDescription>
          </DialogHeader>
          <DialogBody>
          <SpecialityForm speciality={specialityToEdit} onSuccess={handleCloseForm} />
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  };

  const totalElements = filteredSpeciality.length || 0;
  const loadedElements = filteredSpeciality.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Service" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Service"
          onAddButtonClick={handleAddSpeciality}
          onRefreshClick={() => refetch()}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onFilterToggle={() => setShowFilter(!showFilter)}
          showFilter={showFilter}
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
            <p className="text-muted-foreground">Loading Service...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading Service. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode=== 'grid' && (
              <SpecialityTable 
                speciality={filteredSpeciality} 
                onDelete={handleDeleteSpeciality}
                onEdit={handleEditSpeciality}
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
              This action cannot be undone. This will permanently delete the Service
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSpecialityToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default EnquiryServiceTypeList;
