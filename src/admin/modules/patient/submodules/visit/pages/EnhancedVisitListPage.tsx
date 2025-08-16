
import React, { useState, useMemo } from "react";
import PageHeader from "@/admin/components/PageHeader";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import EnhancedInfiniteVisitList from "../components/EnhancedInfiniteVisitList";
import VisitCalendar from "../components/VisitCalendar";
import { useQuery } from "@tanstack/react-query";
import VisitService from "../services/visitService";

type ViewMode = 'list' | 'calendar';

const EnhancedVisitListPage: React.FC = () => {
  
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

  // Fetch visits for calendar view and stats
  const { data: visitsData, refetch } = useQuery({
    queryKey: ["visits", "calendar", refreshTrigger],
    queryFn: async () => {
      const resp = await VisitService.getAllVisits(0, 20, "");
      return resp;
    },
    staleTime: 30_000,
  });

  const visits = visitsData?.content || [];
  const totalVisits = visitsData?.totalElements || 0;
  const loadedVisits = visits.length;

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
    setViewMode(prev => prev === 'list' ? 'calendar' : 'list');
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    refetch();
  };

  const handleVisitUpdate = () => {
    handleRefresh();
  };

  const handleVisitClick = (visit: any) => {
    console.log("Calendar visit clicked:", visit);
    // TODO: Implement visit detail view from calendar
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PageHeader
        title="Visits"
        viewMode={viewMode}
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
          // TODO: Implement new visit creation
        }}
      />

      {/* Filter Card */}
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

      {/* Content */}
      <div className="flex-1">
        {viewMode === 'list' ? (
          <EnhancedInfiniteVisitList
            searchTerm={search}
            selectedFilters={selectedFilters}
            pageSize={20}
            onVisitUpdate={handleVisitUpdate}
          />
        ) : (
          <VisitCalendar
            visits={visits}
            onVisitClick={handleVisitClick}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedVisitListPage;
