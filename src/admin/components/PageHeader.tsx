import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus, RefreshCw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  onViewModeToggle?: () => void;
  viewMode?: 'list' | 'calendar' | 'grid';
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddButtonClick?: () => void;
  onRefreshClick?: () => void;
  onFilterToggle?: () => void;
  showFilter?: boolean;
  additionalActions?: React.ReactNode;
  loadedElements?: number; // Add loadedElements prop
  totalElements?: number; // Add totalElements prop
}

export const PageHeader = ({ 
  title,
  onViewModeToggle,
  viewMode = 'list',
  showAddButton = false,
  addButtonLabel = "New",
  onAddButtonClick,
  onRefreshClick,
  onFilterToggle,
  showFilter,
  additionalActions,
  loadedElements, // Destructure loadedElements
  totalElements, // Destructure totalElements
}: PageHeaderProps) => {
  return (
    <div className="sticky-header-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {loadedElements !== undefined && totalElements !== undefined && (
          <p className="text-sm text-muted-foreground">
            Showing {loadedElements} of {totalElements} patients
          </p>
        )}
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex space-x-2">
            {onViewModeToggle && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={onViewModeToggle}
              >
                {viewMode === 'list' ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {onRefreshClick && (
              <Button variant="ghost" size="icon" className="text-gray-600 rounded-full" onClick={onRefreshClick}>
                <RefreshCw className="h-5 w-5 text-primary" />
              </Button>
            )}
            
            {onFilterToggle && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "text-gray-600 rounded-full",
                  showFilter && "bg-primary/10 text-primary"
                )}
                onClick={onFilterToggle}
              >
                <Filter className={cn(
                  "h-5 w-5",
                  showFilter && "text-primary"
                )} />
              </Button>
            )}
            
            {additionalActions}
          </div>
          
          {showAddButton && (
            <Button className="rounded-full hidden sm:flex" onClick={onAddButtonClick}>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{addButtonLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
