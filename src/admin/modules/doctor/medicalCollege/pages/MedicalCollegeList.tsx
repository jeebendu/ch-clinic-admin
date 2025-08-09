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
import { MedicalCollege } from "../types/MedicalCollege";
import MedicalCollegeService from "../services/MedicalCollegeService";
import MedicalCollegeForm from "../components/MedicalCollegeForm";
import MedicalCollegeTable from "../components/MedicalCollegeTable";
import FormDialog from "@/components/ui/form-dialog";

const MedicalCollegeList = () => {
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
  const [collegeToDelete, setCollegeToDelete] = useState<number | null>(null);

  const [collegeToEdit, setCollegeToEdit] = useState<MedicalCollege | null>(null);
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
      try {
        const response = await MedicalCollegeService.list();
        return response;
      } catch (error) {
        return [];
      }

    },
  });

  const branches = Array.isArray(data) ? data : [];

  const filteredBranches = branches.filter(branch => {
    if (searchTerm && !branch.name.toLowerCase().includes(searchTerm.toLowerCase())) {
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

  const handleAddCollege = () => {
    setCollegeToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setCollegeToEdit(null);
    refetch();
  };

  const handleEditCollege = (branch: MedicalCollege) => {
    setCollegeToEdit(branch);
    setIsEditFormOpen(true);
  };

  const handleDeleteCollege = (id: number) => {
    setCollegeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (collegeToDelete === null) return;

    try {
      await MedicalCollegeService.deleteById(collegeToDelete);
      toast({
        title: "college deleted",
        description: "college has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setCollegeToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete college.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };

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
    <>
      <div className="space-y-4">
        <PageHeader
          title="College List"
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add College"
          onAddButtonClick={handleAddCollege}
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
            <p className="text-muted-foreground">Loading College List...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading College. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <MedicalCollegeTable
                colleges={filteredBranches}
                onDelete={handleDeleteCollege}
                onEdit={handleEditCollege}
              />
            )}
          </div>
        )}
      </div>

      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New College"
        description="Add a new College to your clinic network."
      >
        <MedicalCollegeForm onSuccess={handleCloseForm} />
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit College"
        description="Update College information."
      >
        <MedicalCollegeForm college={collegeToEdit} onSuccess={handleCloseForm} />
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the College
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCollegeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicalCollegeList;
