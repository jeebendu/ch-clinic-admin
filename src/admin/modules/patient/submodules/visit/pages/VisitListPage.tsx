import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/admin/components/PageHeader";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import VisitCalendar from "../components/VisitCalendar";
import VisitService from "../services/visitService";
import { useAutoScroll } from "../hooks/useAutoScroll";
import VisitCardList from "../components/VisitCardList";
import VisitTable from "../components/VisitTable";

type ViewMode = 'list' | 'table' | 'calendar';

const VisitListPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    paymentStatus: [],
    visitType: [],
    doctor: [],
    dateRange: []
  });
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(0);
  const [allVisits, setAllVisits] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch visits data
  const { data: visitsData, isLoading, refetch } = useQuery({
    queryKey: ["visits", "paginated", page, search, selectedFilters, refreshTrigger],
    queryFn: async () => {
      const searchCriteria: any = {};
      
      if (search && search.trim()) {
        searchCriteria.patientName = search.trim();
      }

      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          searchCriteria[key] = values;
        }
      });

      const response = await VisitService.getPaginatedVisits(page, 20, searchCriteria);
      return response;
    },
    staleTime: 30_000,
  });

  // Update visits when data arrives
  useEffect(() => {
    if (visitsData) {
      if (page === 0) {
        setAllVisits(visitsData.content || []);
      } else {
        setAllVisits(prev => [...prev, ...(visitsData.content || [])]);
      }
      setHasNextPage(!visitsData.last);
      setLoadingMore(false);
    }
  }, [visitsData, page]);

  // Reset on search/filter changes
  useEffect(() => {
    setPage(0);
    setAllVisits([]);
  }, [search, selectedFilters]);

  const loadMoreVisits = useCallback(() => {
    if (!loadingMore && hasNextPage && !isLoading) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [loadingMore, hasNextPage, isLoading]);

  // Auto-scroll hook with infinite loading
  const autoScroll = useAutoScroll({
    enabled: viewMode !== 'calendar',
    interval: 2000,
    pauseOnHover: true,
    scrollAmount: 150,
    onLoadMore: loadMoreVisits,
    hasNextPage,
    loadingMore
  });

  const filterOptions: FilterOption[] = useMemo(() => [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "open", label: "Open" },
        { id: "closed", label: "Closed" },
        { id: "follow-up", label: "Follow-up" }
      ]
    },
    {
      id: "paymentStatus", 
      label: "Payment",
      options: [
        { id: "paid", label: "Paid" },
        { id: "partial", label: "Partial" },
        { id: "pending", label: "Pending" },
        { id: "unpaid", label: "Unpaid" }
      ]
    },
    {
      id: "visitType",
      label: "Visit Type", 
      options: [
        { id: "routine", label: "Routine" },
        { id: "follow-up", label: "Follow-up" },
        { id: "emergency", label: "Emergency" }
      ]
    },
    {
      id: "dateRange",
      label: "Date Range",
      options: [
        { id: "today", label: "Today" },
        { id: "yesterday", label: "Yesterday" },
        { id: "this-week", label: "This Week" },
        { id: "last-week", label: "Last Week" },
        { id: "this-month", label: "This Month" },
        { id: "last-month", label: "Last Month" }
      ]
    }
  ], []);

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      const isSelected = current.includes(optionId);
      
      return {
        ...prev,
        [filterId]: isSelected 
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      status: [],
      paymentStatus: [],
      visitType: [],
      doctor: [],
      dateRange: []
    });
    setSearch("");
  };

  const handleViewModeToggle = () => {
    setViewMode(prev => {
      if (prev === 'list') return 'table';
      if (prev === 'table') return 'calendar';
      return 'list';
    });
  };

  const handleRefresh = () => {
    setPage(0);
    setAllVisits([]);
    setRefreshTrigger(prev => prev + 1);
    refetch();
  };

  const handleVisitClick = (visit: any) => {
    console.log("Visit clicked:", visit);
  };

  const handleVisitView = (visit: any) => {
    console.log("View visit:", visit);
  };

  const handleVisitEdit = (visit: any) => {
    console.log("Edit visit:", visit);
  };

  const totalVisits = visitsData?.totalElements || 0;
  const loadedVisits = allVisits.length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Visits"
        onViewModeToggle={handleViewModeToggle}
        onRefreshClick={handleRefresh}
        onFilterToggle={() => setShowFilter(!showFilter)}
        showFilter={showFilter}
        loadedElements={loadedVisits}
        totalElements={totalVisits}
        onSearchChange={setSearch}
        searchValue={search}
        showAddButton={true}
        addButtonLabel="New Visit"
        onAddButtonClick={() => {
          console.log("Add new visit clicked");
        }}
      />

      {showFilter && (
        <div className="px-4 md:px-6">
          <FilterCard
            searchTerm={search}
            onSearchChange={setSearch}
            filters={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      <div className="flex-1">
        {viewMode === 'calendar' ? (
          <VisitCalendar
            visits={allVisits}
            onVisitClick={handleVisitClick}
          />
        ) : viewMode === 'table' ? (
          <VisitTable
            visits={allVisits}
            isLoading={isLoading}
            loadingMore={loadingMore}
            onVisitClick={handleVisitClick}
            onVisitView={handleVisitView}
            onVisitEdit={handleVisitEdit}
            containerRef={autoScroll.containerRef}
          />
        ) : (
          <VisitCardList
            visits={allVisits}
            isLoading={isLoading}
            loadingMore={loadingMore}
            onVisitClick={handleVisitClick}
            onVisitView={handleVisitView}
            onVisitEdit={handleVisitEdit}
            containerRef={autoScroll.containerRef}
          />
        )}
      </div>
    </div>
  );
};

export default VisitListPage;
