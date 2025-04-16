
import { useState, useEffect } from 'react';
import { AppointmentQueryParams } from '../types/Appointment';
import { fetchAppointmentsByDoctorId } from '../services/appointmentService';
import { useToast } from '@/hooks/use-toast';
import { useBranchContext } from '@/contexts/BranchContext';

export const useAppointments = (initialParams: AppointmentQueryParams) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [queryParams, setQueryParams] = useState<AppointmentQueryParams>(initialParams);
  const { toast } = useToast();
  const { selectedBranchId } = useBranchContext();

  const fetchAppointments = async (params: AppointmentQueryParams, append = false) => {
    setLoading(true);
    setError(null);
    try {
      // Include branch ID in the request
      const enhancedParams = {
        ...params,
        branchId: selectedBranchId
      };
      
      const response = await fetchAppointmentsByDoctorId(enhancedParams);
      // Handle both production (Axios) and mock responses
      const content = 'data' in response ? response.data.content : response.content;
      const totalElements = 'data' in response ? response.data.totalElements : response.totalElements;
      const pageSize = 'data' in response ? response.data.size : response.size;
      const pageNumber = 'data' in response ? response.data.number : response.number;
      
      if (append) {
        setAppointments(prev => [...prev, ...content]);
      } else {
        setAppointments(content);
      }
      
      // Check if there are more appointments to load
      setHasMore(totalElements > (pageNumber + 1) * pageSize);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
      toast({
        title: 'Error',
        description: 'Failed to fetch appointments. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load more appointments
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = queryParams.page + 1;
      const nextParams = { ...queryParams, page: nextPage };
      setQueryParams(nextParams);
      fetchAppointments(nextParams, true);
    }
  };

  // Refresh appointments
  const refreshAppointments = () => {
    const resetParams = { ...queryParams, page: 0 };
    setQueryParams(resetParams);
    fetchAppointments(resetParams, false);
  };

  // Update filter parameters
  const updateFilters = (filters: Partial<AppointmentQueryParams>) => {
    const newParams = { ...queryParams, ...filters, page: 0 };
    setQueryParams(newParams);
    fetchAppointments(newParams, false);
  };

  // Refresh data when branch changes
  useEffect(() => {
    if (selectedBranchId) {
      const resetParams = { ...queryParams, page: 0 };
      setQueryParams(resetParams);
      fetchAppointments(resetParams, false);
    }
  }, [selectedBranchId]);

  // Initial fetch
  useEffect(() => {
    fetchAppointments(initialParams, false);
  }, []);

  return {
    appointments,
    loading,
    error,
    hasMore,
    loadMore,
    refreshAppointments,
    updateFilters
  };
};
