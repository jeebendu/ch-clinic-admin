import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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
import { MedicalCouncil } from "../types/MedicalCouncil";
import MedicalCouncilService from "../service/MedicalCouncilService";
import CouncilTable from "../components/CouncilTable";
import CouncilForm from "../components/CouncilForm";
import FormDialog from "@/components/ui/form-dialog";

const MedicalCouncilList = () => {
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
  const [councilToDelete, setCouncilToDelete] = useState<number | null>(null);
  
  const [councilToEdit, setCouncilToEdit] = useState<MedicalCouncil | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      options: [
        { id: 'central', label: 'Central' },
        { id: 'east', label: 'East' },
        { id: 'west', label: 'West' },
        { id: 'north', label: 'North' },
        { id: 'south', label: 'South' }
      ]
    }
  ]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    location: []
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['branches', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await MedicalCouncilService.list();
      return response;
    },
  });

  const branches = Array.isArray(data) ? data : [];

  const filteredBranches = branches.filter(branch => {
    if (searchTerm && !branch.name.toLowerCase().includes(searchTerm.toLowerCase()))  {
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

  const handleAddCouncil = () => {
    setCouncilToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setCouncilToEdit(null);
    refetch();
  };

  const handleEditCouncil = (branch: MedicalCouncil) => {
    setCouncilToEdit(branch);
    setIsEditFormOpen(true);
  };

  const handleDeleteCouncil = (id: number) => {
    setCouncilToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (councilToDelete === null) return;
    
    try {
      await MedicalCouncilService.deleteById(councilToDelete);
      toast({
        title: "Council deleted",
        description: "Council has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setCouncilToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete council.",
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
      status: [],
      location: []
    });
    setSearchTerm("");
  };

  const totalElements = filteredBranches.length || 0;
  const loadedElements = filteredBranches.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Council List" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Council"
          onAddButtonClick={handleAddCouncil}
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
            <p className="text-muted-foreground">Loading Council List...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading council. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid'  && (
              <CouncilTable 
                councils={filteredBranches} 
                onDelete={handleDeleteCouncil}
                onEdit={handleEditCouncil}
              />
            )}
          </div>
        )}
      </div>
      
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Council"
        description="Add a new Council to your clinic network."
      >
        <CouncilForm onSuccess={handleCloseForm} />
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Council"
        description="Update council information."
      >
        <CouncilForm council={councilToEdit} onSuccess={handleCloseForm} />
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the council
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCouncilToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default MedicalCouncilList;
