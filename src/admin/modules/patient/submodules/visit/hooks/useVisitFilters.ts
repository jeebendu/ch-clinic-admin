
import { useState, useCallback } from 'react';
import { VisitFilter, VisitFilterState } from '../types/VisitFilter';

export const useVisitFilters = (onFilterChange: (filters: VisitFilter) => void) => {
  const [filterState, setFilterState] = useState<VisitFilterState>({
    searchTerm: '',
    selectedFilters: {},
    dateRange: undefined
  });

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilterState(prev => ({ ...prev, searchTerm }));
    
    const filters: VisitFilter = {
      patientName: searchTerm || undefined,
    };
    
    onFilterChange(filters);
  }, [onFilterChange]);

  const updateFilter = useCallback((filterId: string, optionId: string) => {
    setFilterState(prev => {
      const currentFilter = prev.selectedFilters[filterId] || [];
      const newFilter = currentFilter.includes(optionId)
        ? currentFilter.filter(id => id !== optionId)
        : [...currentFilter, optionId];

      const newSelectedFilters = {
        ...prev.selectedFilters,
        [filterId]: newFilter
      };

      // Apply filters
      const filters: VisitFilter = {
        patientName: prev.searchTerm || undefined,
        status: newSelectedFilters.status?.length ? newSelectedFilters.status : undefined,
        visitType: newSelectedFilters.visitType?.length ? newSelectedFilters.visitType : undefined,
        branch: newSelectedFilters.branch?.length ? newSelectedFilters.branch : undefined,
        dateRange: prev.dateRange
      };

      onFilterChange(filters);

      return {
        ...prev,
        selectedFilters: newSelectedFilters
      };
    });
  }, [onFilterChange]);

  const updateDateRange = useCallback((dateRange: { from?: Date; to?: Date }) => {
    setFilterState(prev => {
      const newState = { ...prev, dateRange };
      
      const filters: VisitFilter = {
        patientName: prev.searchTerm || undefined,
        status: prev.selectedFilters.status?.length ? prev.selectedFilters.status : undefined,
        visitType: prev.selectedFilters.visitType?.length ? prev.selectedFilters.visitType : undefined,
        branch: prev.selectedFilters.branch?.length ? prev.selectedFilters.branch : undefined,
        dateRange: dateRange.from && dateRange.to ? {
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString()
        } : undefined
      };

      onFilterChange(filters);
      return newState;
    });
  }, [onFilterChange]);

  const clearFilters = useCallback(() => {
    setFilterState({
      searchTerm: '',
      selectedFilters: {},
      dateRange: undefined
    });
    
    onFilterChange({});
  }, [onFilterChange]);

  return {
    filterState,
    updateSearchTerm,
    updateFilter,
    updateDateRange,
    clearFilters
  };
};
