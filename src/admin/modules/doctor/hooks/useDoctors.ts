
import { useState, useEffect, useCallback } from "react";
import { Doctor } from "../types/Doctor";
import doctorService from "../services/doctorService";

interface DoctorsFilter {
  page: number;
  size: number;
  searchTerm?: string;
  doctorType?: string | null;
  specialization?: string | null;
}

export const useDoctors = (initialFilters: DoctorsFilter) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DoctorsFilter>(initialFilters);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [loadedElements, setLoadedElements] = useState(0);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      // Build filter params
      const filterParams: any = {
        pageNumber: filters.page,
        pageSize: filters.size,
      };

      if (filters.searchTerm) filterParams.searchString = filters.searchTerm;
      if (filters.doctorType) filterParams.doctorType = filters.doctorType;
      if (filters.specialization) filterParams.specializationId = filters.specialization;

      const response = await doctorService.filterDoctor(filterParams);
      
      if (response) {
        setDoctors(response.content || []);
        setTotalElements(response.totalElements || 0);
        setLoadedElements(response.content?.length || 0);
        setHasMore(!(response.last || false));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }, [loading, hasMore]);

  const refreshDoctors = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: 0
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<DoctorsFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Reset pagination when filters change
    }));
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    loading,
    hasMore,
    loadMore,
    refreshDoctors,
    updateFilters,
    totalElements,
    loadedElements
  };
};
