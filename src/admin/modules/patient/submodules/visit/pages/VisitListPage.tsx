
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import visitService from "../services/visitService";
import VisitTable from "../components/VisitTable";
import VisitCardList from "../components/VisitCardList";
import VisitFormDialog from "../components/VisitFormDialog";
import VisitFilterCard from "../components/VisitFilterCard";
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
import { useVisitFilters } from "../hooks/useVisitFilters";
import { VisitFilter } from "../types/VisitFilter";
import { useBranchFilter } from "@/hooks/use-branch-filter";

const VisitListPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(isMobile ? 'list' : 'grid');
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [currentFilters, setCurrentFilters] = useState<VisitFilter>({});
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVisit, setEditingVisit] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedBranch } = useBranchFilter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['visits', page, size, currentFilters, selectedBranch],
    queryFn: async () => {
      const response = await visitService.list(page, size, currentFilters);
      return response;
    },
  });

  // Effect to refetch data when branch changes
  useEffect(() => {
    refetch();
  }, [selectedBranch, refetch]);

  // Visit filters hook
  const {
    filterState,
    updateSearchTerm,
    updateFilter,
    updateDateRange,
    clearFilters
  } = useVisitFilters((filters: VisitFilter) => {
    setCurrentFilters(filters);
    setPage(0); // Reset to first page when filters change
  });

  // Extract visits from the response
  const visits = data?.content || (Array.isArray(data) ? data : []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateSearchTerm(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleDeleteVisit = (id: number) => {
    setVisitToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (visitToDelete === null) return;
    
    try {
      await visitService.deleteById(visitToDelete);
      toast({
        title: "Visit deleted",
        description: "Visit has been successfully deleted.",
        className: "bg-clinic-primary text-white"
      });
      refetch();
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete visit.",
        variant: "destructive",
      });
    }
  };

  const handleEditVisit = (visit: any) => {
    setEditingVisit(visit);
    setShowAddDialog(true);
  };

  const handleAddVisit = () => {
    setEditingVisit(null);
    setShowAddDialog(true);
  };

  const totalElements = data?.totalElements || visits.length || 0;
  const loadedElements = visits.length || 0;

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Visits" 
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          showAddButton={true}
          addButtonLabel="Add Visit"
          onAddButtonClick={handleAddVisit}
          onRefreshClick={() => refetch()}
          loadedElements={loadedElements}
          totalElements={totalElements}
          onSearchChange={handleSearchChange}
          searchValue={searchTerm}
          showFilter={true}
          onFilterToggle={() => setShowFilter(!showFilter)}
        />

        {showFilter && (
          <VisitFilterCard
            searchTerm={filterState.searchTerm}
            onSearchChange={updateSearchTerm}
            selectedFilters={filterState.selectedFilters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            dateRange={filterState.dateRange}
            onDateRangeChange={updateDateRange}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading visits...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading visits. Please try again.</p>
          </div>
        ) : (
          <div ref={contentRef} className="overflow-auto max-h-[calc(100vh-180px)]">
            {viewMode === 'grid' ? (
              <VisitTable 
                visits={visits} 
                onDelete={handleDeleteVisit}
                onEdit={handleEditVisit}
                loading={isLoading}
              />
            ) : (
              <VisitCardList 
                visits={visits} 
                onDelete={handleDeleteVisit}
                onEdit={handleEditVisit}
                loading={isLoading}
              />
            )}
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the visit
              and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVisitToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VisitFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        visit={editingVisit}
        onSuccess={() => {
          refetch();
          setShowAddDialog(false);
          setEditingVisit(null);
        }}
      />
    </>
  );
};

export default VisitListPage;
