import React, { useEffect, useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Role } from "../types/Role";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { RoleService } from "../service/RoleService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import RoleTable from "../components/RoleTable";
import FormDialog from "@/components/ui/form-dialog";

const RolesList = () => {
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
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
const [roleList,setRoleList] = useState<Role[]>([]);
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
    queryKey: ['expense', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await RoleService.listByType("role");
      console.log("Expense API response (direct):", response);
      setRoleList(response);
      return response;
    },
  });

 
  const role = Array.isArray(data) ? data : [];
  
 
//   const filteredExpense = expense.filter(expense => {
//     // Filter by search term
//     if (searchTerm && !expense.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
//         !expense.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !expense.location.toLowerCase().includes(searchTerm.toLowerCase())) {
//       return false;
//     }

//     // Filter by status
//     if (selectedFilters.status.length > 0) {
//       const statusMatch = selectedFilters.status.includes(expense.active ? 'active' : 'inactive');
//       if (!statusMatch) return false;
//     }

//     // Filter by location
//     if (selectedFilters.location.length > 0) {
//       const locationMatch = selectedFilters.location.includes(expense.location.toLowerCase());
//       if (!locationMatch) return false;
//     }

//     return true;
//   });

  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleAddRole = () => {
    setRoleToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setRoleToEdit(null);
    refetch();
  };

  const handleEditRole = (role: Role) => {
    setRoleToEdit(role);
    setIsEditFormOpen(true);
  };

  const handleDeleteRole = (id: number) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete === null) return;
    
    try {
      await RoleService.deleteById(roleToDelete);
      toast({
        title: "Role deleted",
        description: "Role has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role.",
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

  const totalElements = role.length || 0;
  const loadedElements = role.length || 0;

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Role" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={false}
          addButtonLabel="Add Role"
          onAddButtonClick={handleAddRole}
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
            <p className="text-muted-foreground">Loading Role...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading Roles. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <RoleTable 
                role={roleList} 
                onDelete={handleDeleteRole}
                onEdit={handleEditRole}
              />
            )}
          </div>
        )}
      </div>
      
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Role"
        description="Add a new Role to your network."
      >
        {/* <RoleForm onSuccess={handleCloseForm} /> */}
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Role"
        description="Update role information."
      >
        {/* <RoleForm role={roleToEdit} onSuccess={handleCloseForm} /> */}
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RolesList;
