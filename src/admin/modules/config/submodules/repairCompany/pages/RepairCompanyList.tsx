import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";

import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { RepairCompany } from "../types/repairCompany";
import RepairCompanyService from "../services/repairCompanyService";
import RepairCompanyTable from "../components/RepairCompanyTable";
import RepairCompanyForm from "../components/RepairCompanyForm";
import FormDialog from "@/components/ui/form-dialog";

const RepairCompanyList = () => {
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
  const [repairToDelete, setRepairCompanyToDelete] = useState<number | null>(null);
  
  const [repairToEdit, setRepairCompanyToEdit] = useState<RepairCompany | null>(null);
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
    queryKey: ['repairs', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await RepairCompanyService.list();
      // console.log("RepairCompany API response (direct):", response);
      return response;
    },
  });

  // Extract repairs from the response
  const repairs = Array.isArray(data) ? data : [];
  // console.log("Extracted repairs:", repairs);

  // Filter repairs based on search term and filters
  const filteredRepairCompanies = repairs.filter(repairCompany => {
    // Filter by search term
    if (searchTerm && !repairCompany.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !repairCompany.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !repairCompany.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(repairCompany.active ? 'active' : 'inactive');
      if (!statusMatch) return false;
    }

    // Filter by location
    if (selectedFilters.location.length > 0) {
      const locationMatch = selectedFilters.location.includes(repairCompany.location.toLowerCase());
      if (!locationMatch) return false;
    }

    return true;
  });

  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleAddRepairCompany = () => {
    setRepairCompanyToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setRepairCompanyToEdit(null);
    refetch();
  };

  const handleEditRepairCompany = (repairCompany: RepairCompany) => {
    setRepairCompanyToEdit(repairCompany);
    setIsEditFormOpen(true);
  };

  const handleDeleteRepairCompany = (id: number) => {
    setRepairCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (repairToDelete === null) return;
    
    try {
      await RepairCompanyService.deleteById(repairToDelete);
      toast({
        title: "RepairCompany deleted",
        description: "RepairCompany has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setRepairCompanyToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete repairCompany.",
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

  const totalElements = filteredRepairCompanies.length || 0;
  const loadedElements = filteredRepairCompanies.length || 0;

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Repair Company" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Repair Company"
          onAddButtonClick={handleAddRepairCompany}
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
            <p className="text-muted-foreground">Loading repair companies...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading repair companies. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <RepairCompanyTable 
                repairs={filteredRepairCompanies} 
                onDelete={handleDeleteRepairCompany}
                onEdit={handleEditRepairCompany}
              />
            )}
          </div>
        )}
      </div>
      
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Repair Company"
      >
        <RepairCompanyForm onSuccess={handleCloseForm} />
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Repair Company"
      >
        <RepairCompanyForm repairCompany={repairToEdit} onSuccess={handleCloseForm} />
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the repair company
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRepairCompanyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RepairCompanyList;
