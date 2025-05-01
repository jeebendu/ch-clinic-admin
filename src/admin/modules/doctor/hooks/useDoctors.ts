
import { useState, useEffect } from 'react';
import { Doctor } from '../types/Doctor';
import { useToast } from '@/hooks/use-toast';
import DoctorService from '../services/doctorService';

export interface DoctorQueryParams {
  page: number;
  size: number;
  searchTerm?: string;
  doctorType?: string | null;
  specialization?: string | null;
}

export const useDoctors = (initialParams: DoctorQueryParams) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [queryParams, setQueryParams] = useState<DoctorQueryParams>(initialParams);
  const [totalElements, setTotalElements] = useState(0);
  const { toast } = useToast();

  const fetchDoctorsData = async (params: DoctorQueryParams, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await DoctorService.fetchPaginated(
        params.page,
        params.size,
        { 
          value: params.searchTerm || '',
          doctorType: params.doctorType? params.doctorType=="external"?true:false : null,
          specialization: params.specialization
        }
      );
      
      if (append) {
        setDoctors(prev => [...prev, ...response.content]);
      } else {
        setDoctors(response.content);
      }
      
      setTotalElements(response.totalElements);
      setHasMore(response.totalElements > (params.page + 1) * params.size);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch doctors');
      toast({
        title: 'Error',
        description: 'Failed to fetch doctors. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = queryParams.page + 1;
      const nextParams = { ...queryParams, page: nextPage };
      setQueryParams(nextParams);
      fetchDoctorsData(nextParams, true);
    }
  };

  const refreshDoctors = () => {
    const resetParams = { ...queryParams, page: 0 };
    setQueryParams(resetParams);
    fetchDoctorsData(resetParams, false);
    
    toast({
      title: 'Refreshed',
      description: 'Doctor list has been refreshed.',
    });
  };

  const updateFilters = (filters: Partial<DoctorQueryParams>) => {
    const newParams = { ...queryParams, ...filters, page: 0 };
    setQueryParams(newParams);
    fetchDoctorsData(newParams, false);
  };

  useEffect(() => {
    fetchDoctorsData(initialParams, false);
  }, []);

  return {
    doctors,
    loading,
    error,
    hasMore,
    loadMore,
    refreshDoctors,
    updateFilters,
    totalElements,
    loadedElements: doctors.length
  };
};
