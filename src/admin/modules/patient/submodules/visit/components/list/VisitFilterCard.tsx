
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import FilterCard, { FilterOption } from "@/admin/components/FilterCard";
import { cn } from "@/lib/utils";
import { VISIT_STATUS_OPTIONS, VISIT_TYPE_OPTIONS } from "../../types/VisitFilter";

interface VisitFilterCardProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, optionId: string) => void;
  onClearFilters: () => void;
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange: (dateRange: { from?: Date; to?: Date }) => void;
}

const VisitFilterCard = ({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  dateRange,
  onDateRangeChange
}: VisitFilterCardProps) => {
  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      options: VISIT_STATUS_OPTIONS,
    },
    {
      id: 'visitType',
      label: 'Visit Type',
      options: VISIT_TYPE_OPTIONS,
    }
  ];

  const handleDateSelect = (range: { from?: Date; to?: Date }) => {
    onDateRangeChange(range);
  };

  return (
    <div className="space-y-4">
      <FilterCard
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
      
      {/* Date Range Filter */}
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        {dateRange?.from && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDateRangeChange({})}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default VisitFilterCard;
