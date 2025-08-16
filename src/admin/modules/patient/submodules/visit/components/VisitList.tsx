
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import visitService from "../services/visitService";
import VisitTable from "./VisitTable";
import VisitCardRow from "./VisitCardRow";
import VisitCalendar from "./VisitCalendar";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranchFilter } from "@/hooks/use-branch-filter";

const VisitList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>(isMobile ? 'list' : 'grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedBranch } = useBranchFilter();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['visits-paginated', searchTerm, selectedBranch],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching visits page:', pageParam, 'searchTerm:', searchTerm, 'branch:', selectedBranch);
      const response = await visitService.getAllVisits(pageParam, 20, searchTerm);
      console.log('Visits response:', response);
      return response;
    },
    getNextPageParam: (lastPage) => {
      console.log('Last page:', lastPage);
      const hasNext = lastPage && !lastPage.last && lastPage.number < (lastPage.totalPages - 1);
      console.log('Has next page:', hasNext, 'Current page:', lastPage?.number, 'Total pages:', lastPage?.totalPages);
      return hasNext ? (lastPage.number + 1) : undefined;
    },
    initialPageParam: 0,
  });

  // Improved scroll handler with better debugging
  const handleScroll = useCallback(() => {
    if (viewMode !== 'list' || !contentRef.current) {
      console.log('Scroll handler skipped - viewMode:', viewMode, 'contentRef exists:', !!contentRef.current);
      return;
    }
    
    const container = contentRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 200;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    console.log('Scroll metrics:', {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceFromBottom,
      threshold,
      hasNextPage,
      isFetchingNextPage
    });
    
    if (distanceFromBottom < threshold && hasNextPage && !isFetchingNextPage) {
      console.log('Triggering fetchNextPage');
      fetchNextPage();
    }
  }, [viewMode, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Set up scroll listener for list view
  useEffect(() => {
    const container = contentRef.current;
    if (viewMode === 'list' && container) {
      console.log('Adding scroll listener');
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        console.log('Removing scroll listener');
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, viewMode]);

  // Effect to refetch data when branch changes
  useEffect(() => {
    console.log('Branch changed, refetching data. New branch:', selectedBranch);
    refetch();
  }, [selectedBranch, refetch]);

  // Flatten all pages into a single array
  const allVisits = data?.pages.flatMap(page => page.content) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  console.log('All visits count:', allVisits.length, 'Total elements:', totalElements);

  const handleSearchChange = (value: string) => {
    console.log('Search term changed:', value);
    setSearchTerm(value);
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
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete visit.",
        variant: "destructive",
      });
    }
  };

  const handleViewVisit = (visit: any) => {
    console.log('View visit:', visit);
    // Implement view logic
  };

  const handleEditVisit = (visit: any) => {
    console.log('Edit visit:', visit);
    // Implement edit logic
  };

  const additionalActions = (
    <div className="flex items-center gap-4">
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'grid' | 'calendar')}>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="calendar" aria-label="Calendar view">
          <Calendar className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          console.log('Manual refresh triggered');
          refetch();
        }}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        <PageHeader 
          title="Visits"
          showAddButton={true}
          addButtonLabel="Add Visit"
          onAddButtonClick={() => {/* Add visit form would go here */}}
          loadedElements={allVisits.length}
          totalElements={totalElements}
          onSearchChange={handleSearchChange}
          searchValue={searchTerm}
          additionalActions={additionalActions}
        />

        {isLoading && allVisits.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading visits...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Error loading visits: {error.message}</p>
            <Button onClick={() => refetch()} className="ml-2">Retry</Button>
          </div>
        ) : (
          <div 
            ref={viewMode === 'list' ? contentRef : undefined} 
            className={viewMode === 'list' ? "overflow-auto max-h-[calc(100vh-180px)] border rounded-md" : ""}
          >
            {viewMode === 'grid' && (
              <VisitTable 
                visits={allVisits} 
                onView={handleViewVisit}
                onEdit={handleEditVisit}
                loading={isLoading}
              />
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-3 p-4">
                {allVisits.map((visit) => (
                  <VisitCardRow
                    key={visit.id}
                    visit={visit}
                    onView={handleViewVisit}
                    onEdit={handleEditVisit}
                  />
                ))}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-clinic-primary"></div>
                      <p className="text-muted-foreground">Loading more visits...</p>
                    </div>
                  </div>
                )}
                {!hasNextPage && allVisits.length > 0 && (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground text-sm">No more visits to load</p>
                  </div>
                )}
                {allVisits.length === 0 && !isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No visits found</p>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'calendar' && (
              <VisitCalendar 
                visits={allVisits}
                onVisitClick={handleViewVisit}
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
    </>
  );
};

export default VisitList;
