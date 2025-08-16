
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VisitList } from "../components/VisitList";
import { VisitTable } from "../components/VisitTable";
import { useAutoScroll } from "../hooks/useAutoScroll";
import visitService from "../services/visitService";
import { Visit } from "../types/Visit";

const VisitListPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['visits', searchTerm],
    queryFn: ({ pageParam = 0 }) => visitService.getVisits({
      page: pageParam,
      size: 20,
      search: searchTerm
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });

  // Use auto-scroll hook
  useAutoScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootRef: scrollContainerRef,
  });

  // Flatten all pages into a single array
  const allVisits: Visit[] = data?.pages.flatMap(page => page.content) || [];
  const totalElements = data?.pages[0]?.totalElements || 0;

  const handleViewModeToggle = () => {
    setViewMode(prev => prev === 'list' ? 'table' : 'list');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (visit: Visit) => {
    console.log('View visit:', visit);
    // Add view logic here
  };

  const handleEdit = (visit: Visit) => {
    console.log('Edit visit:', visit);
    // Add edit logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Visits</h1>
          <p className="text-muted-foreground">
            {totalElements} total visits
          </p>
        </div>
        
        {/* View Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewModeToggle}
          className="flex items-center gap-2"
        >
          {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search visits..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollContainerRef}
        className="h-[calc(100vh-240px)] overflow-auto"
      >
        {viewMode === 'table' ? (
          <VisitTable
            visits={allVisits}
            loading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : (
          <VisitList
            visits={allVisits}
            loading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
        
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitListPage;
