
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Branch } from "@/admin/modules/branch/types/Branch";
import branchService from "@/admin/modules/branch/services/branchService";

export function useBranchFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const branchParam = searchParams.get("branches");
    if (branchParam) {
      setSelectedBranches(branchParam.split(",").map((id) => parseInt(id)));
    }

    fetchBranches();
  }, [searchParams]);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const response = await branchService.list();
      setBranches(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setIsLoading(false);
    }
  };

  const handleBranchChange = (branchId: number) => {
    let updatedBranches: number[];

    if (selectedBranches.includes(branchId)) {
      updatedBranches = selectedBranches.filter((id) => id !== branchId);
    } else {
      updatedBranches = [...selectedBranches, branchId];
    }

    setSelectedBranches(updatedBranches);

    // Update URL search params
    if (updatedBranches.length > 0) {
      searchParams.set("branches", updatedBranches.join(","));
    } else {
      searchParams.delete("branches");
    }
    setSearchParams(searchParams);
  };

  return {
    branches,
    selectedBranches,
    handleBranchChange,
    isLoading
  };
}
