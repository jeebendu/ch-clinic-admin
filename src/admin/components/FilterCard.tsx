
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
  }[];
}

interface FilterCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, optionId: string) => void;
  onClearFilters: () => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}) => {
  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, arr) => total + arr.length, 0);
  };

  const getSelectedFilterLabels = () => {
    const labels: string[] = [];
    filters.forEach(filter => {
      const selected = selectedFilters[filter.id] || [];
      selected.forEach(optionId => {
        const option = filter.options.find(opt => opt.id === optionId);
        if (option) {
          labels.push(`${filter.label}: ${option.label}`);
        }
      });
    });
    return labels;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Active Filters Display */}
          {getTotalSelectedCount() > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              {getSelectedFilterLabels().map((label, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <h4 className="text-sm font-medium">{filter.label}</h4>
                <div className="space-y-1">
                  {filter.options.map(option => {
                    const isSelected = (selectedFilters[filter.id] || []).includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className="flex items-center space-x-2 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onFilterChange(filter.id, option.id)}
                          className="rounded border-gray-300"
                        />
                        <span className={isSelected ? 'font-medium' : ''}>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
