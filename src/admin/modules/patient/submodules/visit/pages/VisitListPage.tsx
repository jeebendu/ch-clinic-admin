import { useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PageHeader from "@/admin/components/PageHeader";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useVisitActions } from "../hooks/useVisitActions";
import visitService from "../services/visitService";
import { Visit } from "../types/Visit";
import { useVisitFilters } from "../hooks/useVisitFilters";
import { VisitFilter } from "../types/VisitFilter";
import { VisitList } from "../components/list/VisitList";
import { VisitTable } from "../components/list/VisitTable";
import { VisitCalendar } from "../components/list/VisitCalendar";
import { VisitGrid } from "../components/list/VisitGrid";
import VisitFilterCard from "../components/list/VisitFilterCard";
import VisitFormDialog from "../components/form/VisitFormDialog";
import { VisitDetailsModal } from "../components/details/VisitDetailsModal";

const VisitListPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'table' | 'calendar' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [currentFilters, setCurrentFilters] = useState<VisitFilter>({});

  // Page-level modal state management
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const {
    // Keep the hook for other actions that haven't been moved yet
  } = useVisitActions();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['visits', searchTerm],
    queryFn: ({ pageParam = 0 }) => {
      console.log('🔄 Fetching visits - page:', pageParam, 'search:', searchTerm);
      return visitService.getAllVisits(pageParam, 10, searchTerm);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      console.log('📄 Getting next page param:', {
        currentPage: lastPage.number,
        hasNext: lastPage.hasNext,
        totalPages: lastPage.totalPages
      });
      if (!lastPage.hasNext) return undefined;
      return lastPage.number + 1;
    },
  });

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

  // Enable auto-scroll with explicit rootRef
  const { loadMoreRef } = useAutoScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    rootRef: scrollContainerRef
  });

  // Flatten all pages into a single array
  const allVisits: Visit[] = data?.pages.flatMap(page => page.content) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  // Page-level handlers
  const handleEditVisit = (visit: Visit) => {
    console.log('Editing visit at page level:', visit);
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handleViewDetails = (visit: Visit) => {
    console.log('Viewing visit details at page level:', visit);
    setSelectedVisit(visit);
    setDetailsModalOpen(true);
  };

  const handleViewModeToggle = () => {
    const modes: Array<'list' | 'table' | 'calendar' | 'grid'> = ['table', 'list', 'calendar', 'grid'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddVisit = () => {
    setAddDialogOpen(true);
  };

  const handleVisitSave = (visit?: Visit) => {
    // Refresh the visit list after save
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading visits...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600">Error loading visits: {error?.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return <VisitList visits={allVisits} onEditVisit={handleEditVisit} onViewDetails={handleViewDetails} />;
      case 'table':
        return <VisitTable visits={allVisits} onEditVisit={handleEditVisit} onViewDetails={handleViewDetails} />;
      case 'calendar':
        return <VisitCalendar visits={allVisits} />;
      case 'grid':
        return <VisitGrid visits={allVisits} />;
      default:
        return <VisitTable visits={allVisits} onEditVisit={handleEditVisit} onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <div className="space-y-6">
        <PageHeader
          title="Patient Visits"
          description="Manage patient visits and appointments"
          viewMode={viewMode}
          onViewModeToggle={handleViewModeToggle}
          onRefreshClick={handleRefresh}
          loadedElements={allVisits.length}
          totalElements={totalElements}
          onSearchChange={handleSearchChange}
          searchValue={searchTerm}
          showAddButton={true}
          addButtonLabel="New Visit"
          onAddButtonClick={handleAddVisit}
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

      {/* Main content container with explicit height and overflow */}
      <div
        ref={scrollContainerRef}
        className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        {renderContent()}

        {/* Loading indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading more visits...</span>
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && allVisits.length > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>No more visits to load</p>
            <p className="text-sm">Showing {allVisits.length} of {totalElements} visits</p>
          </div>
        )}

        {/* Empty state */}
        {allVisits.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No visits found</p>
          </div>
        )}

        {/* Sentinel: placed at the bottom to trigger auto-load when visible */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20"
          >
            <span className="text-xs text-muted-foreground">Load More Trigger Zone</span>
          </div>
        )}
      </div>

      {/* Add Visit Dialog */}
      <VisitFormDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleVisitSave}
      />

      {/* Edit Visit Dialog - Using page-level state */}
      <VisitFormDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleVisitSave}
        visit={selectedVisit}
      />

      {/* Visit Details Modal - Using page-level state */}
      <VisitDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        visit={selectedVisit}
        onEdit={(visit) => {
          setDetailsModalOpen(false);
          handleEditVisit(visit);
        }}
        onGenerateInvoice={(visit) => {
          console.log('Generate invoice for:', visit.id);
        }}
        onViewPrescription={(visit) => {
          console.log('View prescription for:', visit.id);
        }}
      />
    </div>
  );
};

export default VisitListPage;
