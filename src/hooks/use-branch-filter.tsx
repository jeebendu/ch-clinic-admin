
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BranchService from '@/admin/modules/branch/services/branchService';
import { Branch } from '@/admin/modules/branch/types/Branch';
import { useToast } from './use-toast';

export function useBranchFilter() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load selected branch from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('selectedBranch');
    if (saved) {
      setSelectedBranch(saved);
    }
  }, []);

  // Fetch branches with React Query
  const { isLoading, error } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      try {
        const data = await BranchService.list();
        setBranches(data || []);
        return data;
      } catch (error) {
        console.error("Error fetching branches:", error);
        throw error;
      }
    },
  });

  // Handle branch selection without page reload
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    
    // Save to localStorage
    localStorage.setItem('selectedBranch', branchId);
    
    // Show success toast
    toast({
      title: "Branch Updated",
      description: "Your selected branch has been updated.",
    });
    
    // Instead of reloading the page, invalidate relevant queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['patients'] });
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    // Add any other query keys that should be refreshed when branch changes
    
    // You can also dispatch a custom event for components that need to react to branch changes
    const branchChangeEvent = new CustomEvent('branch-change', { 
      detail: { branchId } 
    });
    document.dispatchEvent(branchChangeEvent);
  };

  return {
    branches,
    selectedBranch,
    isLoading,
    error,
    handleBranchChange
  };
}
