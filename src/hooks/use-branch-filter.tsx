
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BranchService from '@/admin/modules/branch/services/branchService';
import { toast } from '@/components/ui/use-toast';

export const useBranchFilter = () => {
  // If there's a selected branch in localStorage, use it, otherwise null
  const [selectedBranch, setSelectedBranch] = useState<string | null>(
    () => localStorage.getItem('selectedBranch')
  );

  const { data: branches, isLoading, error, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: () => BranchService.list(),
  });

  // Set the first branch as selected if none is selected and branches are loaded
  useEffect(() => {
    if (branches && branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0].id.toString());
      localStorage.setItem('selectedBranch', branches[0].id.toString());
    }
  }, [branches, selectedBranch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading branches",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      console.error("Branch loading error:", error);
    }
  }, [error]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    localStorage.setItem('selectedBranch', branchId);
  };

  return {
    branches: branches || [],
    isLoading,
    error,
    selectedBranch,
    handleBranchChange,
    refetch,
  };
};
