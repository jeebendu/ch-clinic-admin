
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Visit } from "../types/Visit";
import { useAutoScroll } from "../hooks/useAutoScroll";
import visitService from "../services/visitService";
import VisitTable from "../components/VisitTable";
import VisitCardList from "../components/VisitCardList";
import PageHeader from "@/admin/components/PageHeader";
import FilterCard from "@/admin/components/FilterCard";

const VisitListPage: React.FC = () => {
  const [view, setView] = useState<"list" | "table">("list");
  const [page, setPage] = useState(0);
  const [allVisits, setAllVisits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFilter, setShowFilter] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['visits', page, searchTerm, selectedFilters],
    queryFn: async () => {
      console.log('Fetching visits for page:', page);
      const response = await visitService.getAllVisits(page, 20, searchTerm);
      
      if (page === 0) {
        setAllVisits(response.content || []);
      } else {
        setAllVisits(prev => [...prev, ...(response.content || [])]);
      }
      
      return response;
    },
    enabled: true
  });

  const loadMore = useCallback(() => {
    if (!isLoading && data && !data.last) {
      console.log('Loading more visits, current page:', page);
      setPage(prev => prev + 1);
    }
  }, [isLoading, data, page]);

  const hasMore = data ? !data.last : true;

  // Enable auto-scroll
  useAutoScroll(loadMore, isLoading, hasMore);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(0);
    setAllVisits([]);
  };

  const handleFilterChange = (filterId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, [filterId]: updated };
    });
    setPage(0);
    setAllVisits([]);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchTerm("");
    setPage(0);
    setAllVisits([]);
  };

  const handleViewModeToggle = () => {
    setView(prev => prev === "list" ? "table" : "list");
  };

  const handleVisitClick = (visit: any) => {
    console.log('Visit clicked:', visit);
  };

  const handleVisitView = (visit: any) => {
    console.log('View visit:', visit);
  };

  const handleVisitEdit = (visit: any) => {
    console.log('Edit visit:', visit);
  };

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'open', label: 'Open' },
        { id: 'closed', label: 'Closed' },
        { id: 'follow-up', label: 'Follow-up' }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Visits"
        onViewModeToggle={handleViewModeToggle}
        viewMode={view}
        onRefreshClick={() => {
          setPage(0);
          setAllVisits([]);
          refetch();
        }}
        onFilterToggle={() => setShowFilter(!showFilter)}
        showFilter={showFilter}
        loadedElements={allVisits.length}
        totalElements={data?.totalElements || 0}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      />

      {showFilter && (
        <FilterCard
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <div className="flex-1 overflow-hidden">
        {view === "table" ? (
          <VisitTable
            visits={allVisits}
            isLoading={isLoading && page === 0}
            loadingMore={isLoading && page > 0}
            onVisitClick={handleVisitClick}
            onVisitView={handleVisitView}
            onVisitEdit={handleVisitEdit}
          />
        ) : (
          <VisitCardList
            visits={allVisits}
            isLoading={isLoading && page === 0}
            loadingMore={isLoading && page > 0}
            onVisitClick={handleVisitClick}
            onVisitView={handleVisitView}
            onVisitEdit={handleVisitEdit}
            containerRef={React.createRef()}
          />
        )}
      </div>
    </div>
  );
};

export default VisitListPage;
