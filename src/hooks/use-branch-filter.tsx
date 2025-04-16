
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BranchService from '@/admin/modules/branch/services/branchService';
import { Branch } from '@/admin/modules/branch/types/Branch';
import { useToast } from './use-toast';

export function useBranchFilter() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { toast } = useToast();

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

  // Handle branch selection
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    
    // Save to localStorage
    localStorage.setItem('selectedBranch', branchId);
    
    // Show success toast
    toast({
      title: "Branch Updated",
      description: "Your selected branch has been updated.",
    });
    
    // Reload the page to apply the branch filter to all API calls
    window.location.reload();
  };

  return {
    branches,
    selectedBranch,
    isLoading,
    error,
    handleBranchChange
  };
}
