
import React, { useEffect } from "react";
import { X, ChevronDown, Filter as FilterIcon, Check } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterOption = {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
  }[];
};

interface FilterCardProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOption[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, optionId: string) => void;
  onClearFilters: () => void;
}

const FilterCard = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  selectedFilters, 
  onFilterChange,
  onClearFilters
}: FilterCardProps) => {
  
  const handleFilterSelect = (filterId: string, optionId: string) => {
    onFilterChange(filterId, optionId);
  };

  const getSelectedCount = (filterId: string) => {
    return selectedFilters[filterId]?.[0] || "Patient";
  };

  return (
    <div className="filter-card mt-2 mb-2">
      {/* Filter by Keyword */}
      <div className="filter-input">
        <FilterIcon className="h-4 w-4 filter-input-icon text-primary" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by keyword..."
        />
      </div>
      
      <div className="filter-divider" />

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger asChild>
            <div className="filter-select">
              <span className="filter-select-label">
                {filter.label} {`(${getSelectedCount(filter.id)})`}
                <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filter.options.map((option) => (
              <DropdownMenuCheckboxItem 
                key={option.id}
                checked={selectedFilters[filter.id]?.includes(option.id)} 
                onCheckedChange={() => handleFilterSelect(filter.id, option.id)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            {getSelectedCount(filter.id) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center text-sm text-primary font-medium"
                  onClick={() => {
                    // Clear just this filter
                    const newSelectedFilters = {...selectedFilters};
                    newSelectedFilters[filter.id] = [];
                    // Call onFilterChange with the updated object
                    filter.options.forEach(option => {
                      if (selectedFilters[filter.id]?.includes(option.id)) {
                        onFilterChange(filter.id, option.id);
                      }
                    });
                  }}
                >
                  Clear Selection
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {/* Clear Button */}
      <div className="filter-clear" onClick={onClearFilters}>
        <X className="h-4 w-4" />
      </div>
    </div>
  );
};

export default FilterCard;
