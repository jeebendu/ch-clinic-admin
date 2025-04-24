
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
    if (loading) return; // Prevent multiple simultaneous requests
    
    setLoading(true);
    setError(null);
    const filter = {
      ...params,
      inputValue: params.searchTerm || "",
      gender: params.gender || null,
      lastVisit: params.lastVisit || null
    };

    try {
      const response = await PatientService.list(params.page, params.size, filter);
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
      
      return newPatients; // Return the loaded patients for scroll position handling
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
      toast({
        title: 'Error',
        description: 'Failed to fetch patients. Please try again.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load more patients and return the newly loaded patients
  const loadMore = async () => {
    if (!loading && hasMore) {
      const nextPage = queryParams.page + 1;
      const nextParams = { ...queryParams, page: nextPage };
      setQueryParams(nextParams);
      return fetchPatientsData(nextParams, true);
    }
    return [];
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
