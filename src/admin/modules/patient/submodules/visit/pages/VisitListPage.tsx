
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import VisitTable from '../components/VisitTable';
import VisitFormDialog from '../components/VisitFormDialog';
import VisitFilterCard from '../components/VisitFilterCard';
import { useVisitActions } from '../hooks/useVisitActions';
import { useVisitFilters } from '../hooks/useVisitFilters';
import visitService from '../services/visitService';
import { Visit } from '../types/Visit';
import { VisitFilter } from '../types/VisitFilter';

const VisitListPage = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const pageSize = 10;

  const {
    showAddDialog,
    showEditDialog,
    selectedVisit,
    openAddDialog,
    openEditDialog,
    closeDialogs
  } = useVisitActions();

  const fetchVisits = async (page: number = 0, filters: VisitFilter = {}) => {
    setLoading(true);
    try {
      console.log('Fetching visits with filters:', filters);
      
      // Convert filters to search criteria format expected by the API
      const searchCriteria: any = {};
      
      if (filters.patientName) {
        searchCriteria.patientName = filters.patientName;
      }
      
      if (filters.doctorName) {
        searchCriteria.doctorName = filters.doctorName;
      }
      
      if (filters.status && filters.status.length > 0) {
        searchCriteria.status = filters.status;
      }
      
      if (filters.visitType && filters.visitType.length > 0) {
        searchCriteria.visitType = filters.visitType;
      }
      
      if (filters.dateRange) {
        searchCriteria.fromDate = filters.dateRange.from;
        searchCriteria.toDate = filters.dateRange.to;
      }

      const response = await visitService.getPaginatedVisits(page, pageSize, searchCriteria);
      console.log('API Response:', response);
      
      if (page === 0) {
        setVisits(response.content || []);
      } else {
        setVisits(prev => [...prev, ...(response.content || [])]);
      }
      
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setVisits([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: VisitFilter) => {
    console.log('Filter changed:', filters);
    setCurrentPage(0);
    fetchVisits(0, filters);
  };

  const {
    filterState,
    updateSearchTerm,
    updateFilter,
    updateDateRange,
    clearFilters
  } = useVisitFilters(handleFilterChange);

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleLoadMore = () => {
    if (!loading && visits.length < totalElements) {
      const nextPage = currentPage + 1;
      // Apply current filters when loading more
      const currentFilters: VisitFilter = {
        patientName: filterState.searchTerm || undefined,
        status: filterState.selectedFilters.status?.length ? filterState.selectedFilters.status : undefined,
        visitType: filterState.selectedFilters.visitType?.length ? filterState.selectedFilters.visitType : undefined,
        dateRange: filterState.dateRange ? {
          from: filterState.dateRange.from?.toISOString(),
          to: filterState.dateRange.to?.toISOString()
        } : undefined
      };
      fetchVisits(nextPage, currentFilters);
    }
  };

  const handleVisitSaved = () => {
    // Refresh the list when a visit is saved
    const currentFilters: VisitFilter = {
      patientName: filterState.searchTerm || undefined,
      status: filterState.selectedFilters.status?.length ? filterState.selectedFilters.status : undefined,
      visitType: filterState.selectedFilters.visitType?.length ? filterState.selectedFilters.visitType : undefined,
      dateRange: filterState.dateRange ? {
        from: filterState.dateRange.from?.toISOString(),
        to: filterState.dateRange.to?.toISOString()
      } : undefined
    };
    fetchVisits(0, currentFilters);
    closeDialogs();
  };

  return (
    <div className="space-y-6">
        <PageHeader
          title="Patient Visits"
          subtitle={`${totalElements} total visits`}
          showAddButton
          addButtonLabel="Add Visit"
          addButtonIcon={<Plus className="h-4 w-4" />}
          onAddButtonClick={openAddDialog}
          showFilter
          onFilterToggle={() => setShowFilter(!showFilter)}
          showAddButton={true}
          addButtonLabel="New Visit"
          onAddButtonClick={handleAddVisit}
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

        <VisitTable
          visits={visits}
          loading={loading}
          onEdit={openEditDialog}
          onLoadMore={handleLoadMore}
          hasMore={visits.length < totalElements}
        />

        <VisitFormDialog
          open={showAddDialog}
          onOpenChange={closeDialogs}
          onSuccess={handleVisitSaved}
        />

        <VisitFormDialog
          open={showEditDialog}
          onOpenChange={closeDialogs}
          visit={selectedVisit}
          onSuccess={handleVisitSaved}
        />
      </div>
    </AdminLayout>
  );
};

export default VisitListPage;
