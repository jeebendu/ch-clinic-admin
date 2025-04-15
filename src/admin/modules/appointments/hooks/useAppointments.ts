
import { useState, useEffect } from 'react';
import { AppointmentQueryParams } from '../types/Appointment';
import { fetchAppointmentsByDoctorId } from '../services/appointmentService';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = (initialParams: AppointmentQueryParams) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [queryParams, setQueryParams] = useState<AppointmentQueryParams>(initialParams);
  const { toast } = useToast();

  const fetchAppointments = async (params: AppointmentQueryParams, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAppointmentsByDoctorId(params);
      const newAppointments = response.data.content;
      
      if (append) {
        setAppointments(prev => [...prev, ...newAppointments]);
      } else {
        setAppointments(newAppointments);
      }
      
      // Check if there are more appointments to load
      setHasMore(response.data.totalElements > (params.page + 1) * params.size);
      
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
