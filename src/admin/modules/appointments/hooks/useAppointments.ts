
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
      
      // Updated to handle the response structure safely
      const responseData = response as any;
      let content: any[] = [];
      let totalElements = 0;
      let pageSize = 10;
      let pageNumber = 0;
      
      if (responseData.data) {
        // Handle Axios response
        content = responseData.data.content || [];
        totalElements = responseData.data.totalElements || 0;
        pageSize = responseData.data.size || 10;
        pageNumber = responseData.data.number || 0;
      } else {
        // Handle direct mock response
        content = responseData.content || [];
        totalElements = responseData.totalElements || 0;
        pageSize = responseData.size || 10;
        pageNumber = responseData.number || 0;
      }
      
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

  // Get single appointment
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id) || null;
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
    updateFilters,
    getAppointmentById
  };
};
