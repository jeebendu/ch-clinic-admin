import { useState, useEffect } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Expense } from "../types/Expense";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseForm from "../components/ExpenseForm";
import FormDialog from "@/components/ui/form-dialog";
import ExpenseService from "../service/ExpenseService";

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
      const response = await ExpenseService.list();
      console.log("Expense API response (direct):", response);
      return response;
    },
  });

 
  const expense = Array.isArray(data) ? data : [];
  
 
  const filteredExpense = expense.filter(expense => {
    // Filter by search term
    if (searchTerm && !expense.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !expense.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !expense.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (selectedFilters.status.length > 0) {
      const statusMatch = selectedFilters.status.includes(expense.active ? 'active' : 'inactive');
      if (!statusMatch) return false;
    }

    // Filter by location
    if (selectedFilters.location.length > 0) {
      const locationMatch = selectedFilters.location.includes(expense.location.toLowerCase());
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

  const totalElements = filteredExpense.length || 0;
  const loadedElements = filteredExpense.length || 0;

  return (
    <>
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
            <p className="text-destructive">Error loading Expenses. Please try again.</p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' && (
              <ExpenseTable 
                expense={filteredExpense} 
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
              />
            )}
          </div>
        )}
      </div>
      
      <FormDialog
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm onSuccess={handleCloseForm} />
      </FormDialog>

      <FormDialog
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Expense"
      >
        <ExpenseForm expense={expenseToEdit} onSuccess={handleCloseForm} />
      </FormDialog>

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
    </>
  );
};

export default ExpenseList;
