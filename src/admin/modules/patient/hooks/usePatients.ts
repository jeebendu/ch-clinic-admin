
import { useState, useEffect } from 'react';
import PatientService from '../services/patientService';
import { PatientQueryParams } from '../services/patientService';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '../types/Patient';

export const usePatients = (initialParams: PatientQueryParams) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [queryParams, setQueryParams] = useState<PatientQueryParams>(initialParams);
  const [totalElements, setTotalElements] = useState(0);
  const { toast } = useToast();

  const fetchPatientsData = async (params: PatientQueryParams, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await PatientService.list(params.page, params.size, params.searchTerm || '');
      const newPatients = response.content || (Array.isArray(response) ? response : []);
      
      if (append) {
        setPatients(prev => [...prev, ...newPatients]);
      } else {
        setPatients(newPatients);
      }
      
      // Set total number of elements
      setTotalElements(response.totalElements || newPatients.length);
      
      // Check if there are more patients to load
      setHasMore(response.totalElements > (params.page + 1) * params.size);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
      toast({
        title: 'Error',
        description: 'Failed to fetch patients. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load more patients
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = queryParams.page + 1;
      const nextParams = { ...queryParams, page: nextPage };
      setQueryParams(nextParams);
      fetchPatientsData(nextParams, true);
    }
  };

  // Refresh patients
  const refreshPatients = () => {
    const resetParams = { ...queryParams, page: 0 };
    setQueryParams(resetParams);
    fetchPatientsData(resetParams, false);
    
    toast({
      title: 'Refreshed',
      description: 'Patient list has been refreshed.',
    });
  };

  // Update filter parameters
  const updateFilters = (filters: Partial<PatientQueryParams>) => {
    const newParams = { ...queryParams, ...filters, page: 0 };
    setQueryParams(newParams);
    fetchPatientsData(newParams, false);
  };

  useEffect(() => {
    fetchPatientsData(initialParams, false);
  }, []);

  return {
    patients,
    loading,
    error,
    hasMore,
    loadMore,
    refreshPatients,
    updateFilters,
    totalElements,
    loadedElements: patients.length
  };
};
