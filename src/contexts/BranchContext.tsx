
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface BranchContextType {
  selectedBranchId: string | null;
  setSelectedBranchId: (branchId: string) => void;
  refreshData: () => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load selected branch from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('selectedBranch');
    if (saved) {
      setSelectedBranchId(saved);
    }
  }, []);

  // Function to refresh data when branch changes
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['patients'] });
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    queryClient.invalidateQueries({ queryKey: ['branches'] });
    // Add any other query keys that should be refreshed
  };

  // Function to handle branch change
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem('selectedBranch', branchId);
    
    // Show success toast
    toast({
      title: "Branch Updated",
      description: "Your selected branch has been updated.",
    });
    
    // Refresh all relevant data
    refreshData();
    
    // Dispatch custom event for non-React components
    const branchChangeEvent = new CustomEvent('branch-change', { 
      detail: { branchId } 
    });
    document.dispatchEvent(branchChangeEvent);
  };

  return (
    <BranchContext.Provider 
      value={{ 
        selectedBranchId, 
        setSelectedBranchId: handleBranchChange,
        refreshData
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranchContext must be used within a BranchProvider');
  }
  return context;
};
