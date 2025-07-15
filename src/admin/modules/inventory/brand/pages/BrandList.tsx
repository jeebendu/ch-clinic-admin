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
import { Brand } from "../types/Brand";
import BrandService from "../service/BrandService";
import BrandTable from "../components/BrandTable";
import BrandForm from "../components/BrandForm";
import FormDialog from "@/admin/components/dialogs/FormDialog";

const BrandList = () => {
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
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
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
    queryKey: ['brands', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await BrandService.list();
      // console.log("Brand API response (direct):", response);
      return response;
    },
  });

  // Extract brands from the response
  const brands = Array.isArray(data) ? data : [];
  // console.log("Extracted brands:", brands);

  // Filter brands based on search term and filters
  const filteredBrands = brands.filter(brand => {
    // Filter by search term
    if (searchTerm && !brand.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !brand.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !brand.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(brand.active ? 'active' : 'inactive');
      if (!statusMatch) return false;
    }

    // Filter by location
    if (selectedFilters.location.length > 0) {
      const locationMatch = selectedFilters.location.includes(brand.location.toLowerCase());
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

  const handleAddBrand = () => {
    setBrandToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setBrandToEdit(null);
    refetch();
  };

  const handleEditBrand = (brand: Brand) => {
    setBrandToEdit(brand);
    setIsEditFormOpen(true);
  };

  const handleDeleteBrand = (id: number) => {
    setBrandToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (brandToDelete === null) return;
    
    try {
      await BrandService.deleteById(brandToDelete);
      toast({
        title: "Brand deleted",
        description: "Brand has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand.",
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

  const totalElements = filteredBrands.length || 0;
  const loadedElements = filteredBrands.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Brand" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Brand"
          onAddButtonClick={handleAddBrand}
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
            <p className="text-muted-foreground">Loading brands...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading brands. Please try again.</p>
          </div>
        ) : (
          <div>
            <BrandTable 
              brands={filteredBrands} 
              onDelete={handleDeleteBrand}
              onEdit={handleEditBrand}
            />
          </div>
        )}
      </div>
      
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Brand"
        description="Add a new brand to your clinic network."
      >
        <BrandForm onSuccess={handleCloseForm} />
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Brand"
        description="Update brand information."
      >
        <BrandForm brand={brandToEdit} onSuccess={handleCloseForm} />
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBrandToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default BrandList;
