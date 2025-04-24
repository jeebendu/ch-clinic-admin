
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Fixed import casing to match the actual file
import BranchService from '@/admin/modules/branch/services/branchService';
import { Branch } from '@/admin/modules/branch/types/Branch';

export const useBranchFilter = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const { data: branches, isLoading, error } = useQuery({
    queryKey: ['branches'],
    queryFn: () => BranchService.list(),
  });

  useEffect(() => {
    if (branches && branches.length > 0) {
      setSelectedBranch(branches[0].id.toString());
    }
  }, [branches]);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  return {
    branches: branches || [],
    isLoading,
    error,
    selectedBranch,
    handleBranchChange,
  };
};
