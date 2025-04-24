
import React, { useEffect, useState } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { useQuery } from "@tanstack/react-query";
import UserService from "../services/userService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Staff, User } from "../types/User";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

const UsersList = () => {
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
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
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
    queryKey: ['user', page, size, searchTerm, selectedFilters],
    queryFn: async () => {
      const response = await UserService.paginatedList(page, size, searchTerm);
      console.log("User API response (direct):", response);
      return response.data.content;
    },
  });

  const branches = Array.isArray(data) ? data : [];

  const filteredUsers = branches.filter(user => {
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(user.active ? 'active' : 'inactive');
      if (!statusMatch) return false;
    }

    if (selectedFilters.location.length > 0) {
      const locationMatch = selectedFilters.location.includes(user.location.toLowerCase());
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

  const handleAddBranch = () => {
    setUserToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setUserToEdit(null);
    refetch();
  };

  const handleSaveUser = (userData: User) => {
    UserService.saveOrUpdate(userData)
      .then(() => {
        toast({
          title: "Success",
          description: `User ${userData.id ? "updated" : "created"} successfully`,
          className: "bg-clinic-primary text-white",
        });
        handleCloseForm();
      })
      .catch((error) => {
        console.error("Error saving user:", error);
        toast({
          title: "Error",
          description: `Failed to ${userData.id ? "update" : "create"} user`,
          variant: "destructive",
        });
      });
  };

  const handleEditUser = (user: Staff) => {
    const userData: User = {
      id: user.id,
      uid: user.uid,
      name: `${user.firstname} ${user.lastname}`,
      username: user.user?.username || '',
      email: user.user?.email,
      phone: user.user?.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      dob: user.dob,
      branch: user.user?.branch,
      role: user.user?.role,
      password: user.user?.password,
      effectiveFrom: user.user?.effectiveFrom,
      effectiveTo: user.user?.effectiveTo,
      image: user.user?.image,
      status: user.user?.status
    };
    
    setUserToEdit(userData);
    setIsEditFormOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete === null) return;
    
    try {
      await UserService.deleteById(userToDelete);
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
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

  const renderForm = () => {
    if (isMobile) {
      return (
        <Drawer open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Add New User</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <UserForm user={null} onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Add New User</DialogTitle>
            <DialogDescription>Add a new User to your clinic network.</DialogDescription>
          </DialogHeader>
          <UserForm user={null} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  const renderEditForm = () => {
    if (!userToEdit) return null;
    
    if (isMobile) {
      return (
        <Drawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Edit User</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <UserForm user={userToEdit} onSuccess={handleCloseForm} />
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          <UserForm user={userToEdit} onSuccess={handleCloseForm} />
        </DialogContent>
      </Dialog>
    );
  };

  const totalElements = filteredUsers.length || 0;
  const loadedElements = filteredUsers.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Users" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add User"
          onAddButtonClick={handleAddBranch}
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
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading users. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <UserTable 
                user={filteredUsers} 
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
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
              This action cannot be undone. This will permanently delete the user
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UsersList;
