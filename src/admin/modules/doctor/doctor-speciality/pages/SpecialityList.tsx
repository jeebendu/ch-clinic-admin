

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
import { Speciality } from "../types/Speciality";
import { useQuery } from "@tanstack/react-query";
import SpecialityService from "../services/SpecialityService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import SpecialityTable from "../components/SpcialityTable";
import SpecialityForm from "../components/SpecialityForm";

const SpecialityList = () => {
  const navigate = useNavigate();
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
  
  const [specialityToEdit, setSpecialityToEdit] = useState<Speciality | null>(null);
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
      const response = await SpecialityService.list();
      console.log("Speciality API response (direct):", response);
      return response;
    },
  });

  const speciality = Array.isArray(data) ? data : [];
  console.log("Extracted speciality:", speciality);

  const filteredSpeciality = speciality.filter(speciality => {
    // Filter by search term
    if (searchTerm && !speciality.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !speciality.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !speciality.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(speciality.active ? 'active' : 'inactive');
      if (!statusMatch) return false;
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

  const handleEditSpeciality = (speciality :Speciality) => {
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
        title: "Speciality deleted",
        description: "speciality has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setSpecialityToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete speciality.",
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
              <DrawerTitle className="text-clinic-primary">Add New Speciality</DrawerTitle>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Add New Speciality</DialogTitle>
            <DialogDescription>Add a new speciality to your doctor network.</DialogDescription>
          </DialogHeader>
          <SpecialityForm onSuccess={handleCloseForm} />
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
              <DrawerTitle className="text-clinic-primary">Edit Speciality</DrawerTitle>
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
            <DialogTitle className="text-clinic-primary">Edit Speciality</DialogTitle>
            <DialogDescription>Update Speciality information.</DialogDescription>
          </DialogHeader>
          <SpecialityForm speciality={specialityToEdit} onSuccess={handleCloseForm} />
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
          title="Speciality" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Speciality"
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
            <p className="text-muted-foreground">Loading speciality...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading speciality. Please try again.</p>
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
              This action cannot be undone. This will permanently delete the speciality
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

export default SpecialityList;
