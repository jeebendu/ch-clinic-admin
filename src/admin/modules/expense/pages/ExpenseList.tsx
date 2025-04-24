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
import ExpenseService from "../service/ExpenseService";
import ExpenseTable from "../components/ExpenseTable";
import { Expense } from "../types/Expense";

const ExpenseList = () => {
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
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [expenseList,setExpenseList] = useState<Expense[]>([]);
  
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
      const response = await ExpenseService.list();
      console.log("Expense API response (direct):", response.data);
      setExpenseList(response.data);
      return response;
    },
  });

 
  const expense = Array.isArray(data) ? data : [];
  console.log("Extracted Expenses:", expense);
  console.log("Expense List:", expenseList);

 
  useEffect(() => {
    setViewMode(isMobile ? 'list' : 'grid');
  }, [isMobile]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleAddExpense = () => {
    setExpenseToEdit(null);
    setIsAddFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setExpenseToEdit(null);
    refetch();
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditFormOpen(true);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete === null) return;
    
    try {
      await ExpenseService.deleteById(expenseToDelete);
      toast({
        title: "Expense deleted",
        description: "Expense has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense.",
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
              <DrawerTitle className="text-clinic-primary">Add New Expense</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              {/* <ExpenseForm onSuccess={handleCloseForm} /> */}
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Add New Expense</DialogTitle>
            <DialogDescription>Add a new Expense to your network.</DialogDescription>
          </DialogHeader>
          {/* <ExpenseForm onSuccess={handleCloseForm} /> */}
        </DialogContent>
      </Dialog>
    );
  };

  const renderEditForm = () => {
    if (!expenseToEdit) return null;
    
    if (isMobile) {
      return (
        <Drawer open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DrawerContent className="h-[85%]">
            <DrawerHeader className="border-b border-clinic-accent">
              <DrawerTitle className="text-clinic-primary">Edit Expence</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              {/* <ExpenseForm expense={expenseToEdit} onSuccess={handleCloseForm} /> */}
            </div>
          </DrawerContent>
        </Drawer>
      );
    } 
    
    return (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b border-clinic-accent pb-4">
            <DialogTitle className="text-clinic-primary">Edit Expense</DialogTitle>
            <DialogDescription>Update expense information.</DialogDescription>
          </DialogHeader>
          {/* <ExpenseForm expense={expenseToEdit} onSuccess={handleCloseForm} /> */}
        </DialogContent>
      </Dialog>
    );
  };

  const totalElements = expense.length || 0;
  const loadedElements = expense.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader 
          title="Expense" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Expense"
          onAddButtonClick={handleAddExpense}
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
            <p className="text-muted-foreground">Loading Expense...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading Expences. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <ExpenseTable 
                expense={expenseList} 
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
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
              This action cannot be undone. This will permanently delete the expense
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ExpenseList;
