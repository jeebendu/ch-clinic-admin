
import React from 'react';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBranchFilter } from '@/hooks/use-branch-filter';
import { cn } from '@/lib/utils';

interface BranchFilterProps {
  className?: string;
}

const BranchFilter = ({ className }: BranchFilterProps) => {
  const { branches, selectedBranch, isLoading, handleBranchChange } = useBranchFilter();

  // Find the name of the selected branch
  const selectedBranchName = React.useMemo(() => {
    if (!selectedBranch) return 'Select Branch';
    const branch = branches.find(b => b.id.toString() === selectedBranch);
    return branch ? branch.name : 'Select Branch';
  }, [branches, selectedBranch]);

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
            branches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleBranchChange(branch.id.toString())}
              >
                <span>{branch.name}</span>
                {selectedBranch === branch.id.toString() && <Check className="h-4 w-4 text-clinic-primary" />}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BranchFilter;
