
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/admin/components/PageHeader';
import FilterCard, { FilterOption } from '@/admin/components/FilterCard';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Play, Pause, ArrowUp, ArrowDown, List, Grid, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import visitService from '../services/visitService';
import VisitTable from './VisitTable';
import VisitCardRow from './VisitCardRow';
import VisitCalendar from './VisitCalendar';
import { useAutoScroll } from '../hooks/useAutoScroll';

const VisitList = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>(isMobile ? 'list' : 'grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

  // Auto scroll hook for card view only
  const {
    containerRef,
    isPaused,
    isAtBottom,
    setIsPaused,
    scrollToTop,
    scrollToBottom,
    scrollToNext
  } = useAutoScroll({
    enabled: autoScrollEnabled && viewMode === 'list',
    interval: 3000,
    pauseOnHover: true,
    scrollAmount: 150
  });

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'open', label: 'Open' },
        { id: 'closed', label: 'Closed' },
        { id: 'follow-up', label: 'Follow-up' }
      ]
    },
    {
      id: 'visitType',
      label: 'Visit Type',
      options: [
        { id: 'routine', label: 'Routine' },
        { id: 'follow-up', label: 'Follow-up' },
        { id: 'emergency', label: 'Emergency' }
      ]
    },
    {
      id: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { id: 'paid', label: 'Paid' },
        { id: 'partial', label: 'Partial' },
        { id: 'pending', label: 'Pending' },
        { id: 'unpaid', label: 'Unpaid' }
      ]
    }
  ];

  // Fetch visits data
  const { data: visits = [], isLoading, error, refetch } = useQuery({
    queryKey: ['visits', searchTerm, selectedFilters],
    queryFn: async () => {
      if (searchTerm) {
        return await visitService.searchVisits(searchTerm);
      }
      
      const hasFilters = Object.values(selectedFilters).some(filters => filters.length > 0);
      if (hasFilters) {
        return await visitService.filterVisits(selectedFilters);
      }
      
      return await visitService.getAllVisits();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterId] || [];
      const isSelected = currentFilters.includes(optionId);
      
      return {
        ...prev,
        [filterId]: isSelected 
          ? currentFilters.filter(id => id !== optionId)
          : [...currentFilters, optionId]
      };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
  };

  const toggleViewMode = () => {
    // This is for the original two-state toggle in PageHeader
    if (viewMode === 'list') {
      setViewMode('grid');
    } else {
      setViewMode('list');
    }
    // Disable auto scroll when switching away from list view
    if (viewMode === 'list') {
      setAutoScrollEnabled(false);
    }
  };

  const handleViewModeChange = (value: string) => {
    if (value && ['list', 'grid', 'calendar'].includes(value)) {
      setViewMode(value as 'list' | 'grid' | 'calendar');
      // Disable auto scroll when switching away from list view
      if (value !== 'list') {
        setAutoScrollEnabled(false);
      }
    }
  };

  const toggleAutoScroll = () => {
    if (viewMode !== 'list') {
      toast({
        title: "Auto-scroll unavailable",
        description: "Auto-scroll is only available in card view.",
        variant: "destructive",
      });
      return;
    }
    setAutoScrollEnabled(!autoScrollEnabled);
    if (autoScrollEnabled) {
      setIsPaused(false);
    }
  };

  const handleViewVisit = (visit: any) => {
    toast({
      title: "View Visit",
      description: `Opening visit ${visit.id} for ${visit.patientName}`,
      className: "bg-clinic-primary text-white"
    });
    // Navigate to visit details page
  };

  const handleEditVisit = (visit: any) => {
    toast({
      title: "Edit Visit",
      description: `Editing visit ${visit.id} for ${visit.patientName}`,
      className: "bg-clinic-primary text-white"
    });
    // Navigate to visit edit form
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Visits"
        viewMode={viewMode === 'calendar' ? 'list' : viewMode}
        onViewModeToggle={toggleViewMode}
        onRefreshClick={() => refetch()}
        onFilterToggle={() => setShowFilters(!showFilters)}
        showFilter={showFilters}
        loadedElements={visits.length}
        totalElements={visits.length}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        additionalActions={
          <div className="flex items-center gap-2">
            {/* Three-way view mode toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={handleViewModeChange}
              className="border rounded-md"
            >
              <ToggleGroupItem value="list" aria-label="List view" size="sm">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="calendar" aria-label="Calendar view" size="sm">
                <Calendar className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Auto-scroll controls for list view */}
            {viewMode === 'list' && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAutoScroll}
                  className={`rounded-full ${autoScrollEnabled ? 'bg-primary/10 text-primary' : ''}`}
                >
                  {autoScrollEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                {autoScrollEnabled && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={scrollToTop}
                      className="rounded-full text-gray-600"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={scrollToBottom}
                      className="rounded-full text-gray-600"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        }
      />

      {showFilters && (
        <FilterCard
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Auto-scroll status indicator */}
      {autoScrollEnabled && viewMode === 'list' && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700">
            <Play className="h-4 w-4" />
            <span className="text-sm font-medium">
              Auto-scroll is {isPaused ? 'paused' : 'active'}
            </span>
            {isPaused && <span className="text-xs">(hover to pause)</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScrollEnabled(false)}
            className="text-blue-600 hover:text-blue-700"
          >
            Stop
          </Button>
        </div>
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
        <div 
          ref={viewMode === 'list' ? containerRef : undefined}
          className={`${
            viewMode === 'list' 
              ? 'max-h-[calc(100vh-280px)] overflow-y-auto' 
              : 'overflow-auto max-h-[calc(100vh-200px)]'
          }`}
        >
          {viewMode === 'grid' ? (
            <VisitTable
              visits={visits}
              onView={handleViewVisit}
              onEdit={handleEditVisit}
              loading={isLoading}
            />
          ) : viewMode === 'calendar' ? (
            <VisitCalendar
              visits={visits}
              onVisitClick={handleViewVisit}
            />
          ) : (
            <div className="space-y-3">
              {visits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No visits found</p>
                </div>
              ) : (
                visits.map((visit) => (
                  <VisitCardRow
                    key={visit.id}
                    visit={visit}
                    onView={handleViewVisit}
                    onEdit={handleEditVisit}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitList;
