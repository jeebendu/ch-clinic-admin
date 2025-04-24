import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Fix import casing to match the actual file
import BranchService from '@/admin/modules/branch/services/BranchService';
import { Branch } from '@/admin/modules/branch/types/Branch';

export const useBranchFilter = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { data: branches, isLoading, error } = useQuery(
    'branches',
    () => BranchService.list(),
    {
      select: (response) => response.data,
    }
  );

  useEffect(() => {
    if (branches && branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return {
    branches,
    isLoading,
    error,
    selectedBranch,
    handleBranchChange,
  };
};
