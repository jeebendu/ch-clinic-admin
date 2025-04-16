
import React from 'react';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import BranchService from '@/admin/modules/branch/services/branchService';
import { Branch } from '@/admin/modules/branch/types/Branch';
import { cn } from '@/lib/utils';
import { useBranchContext } from '@/contexts/BranchContext';

interface BranchFilterProps {
  className?: string;
}

const BranchFilter = ({ className }: BranchFilterProps) => {
  const { selectedBranchId, setSelectedBranchId } = useBranchContext();

  // Fetch branches with React Query
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      try {
        return await BranchService.list();
      } catch (error) {
        console.error("Error fetching branches:", error);
        throw error;
      }
    },
  });

  // Find the name of the selected branch
  const selectedBranchName = React.useMemo(() => {
    if (!selectedBranchId) return 'Select Branch';
    const branch = branches.find(b => b.id.toString() === selectedBranchId);
    return branch ? branch.name : 'Select Branch';
  }, [branches, selectedBranchId]);

  return (
    <div className={cn('flex items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-white/90 backdrop-blur-sm">
            <Building2 className="h-4 w-4 text-clinic-primary" />
            <span className="font-medium truncate max-w-[120px]">
              {isLoading ? 'Loading...' : selectedBranchName}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px] max-h-[400px] overflow-auto">
          {isLoading ? (
            <div className="p-2 text-center text-sm text-muted-foreground">Loading branches...</div>
          ) : branches.length === 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">No branches found</div>
          ) : (
            branches.map((branch: Branch) => (
              <DropdownMenuItem
                key={branch.id}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedBranchId(branch.id.toString())}
              >
                <span>{branch.name}</span>
                {selectedBranchId === branch.id.toString() && <Check className="h-4 w-4 text-clinic-primary" />}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BranchFilter;
