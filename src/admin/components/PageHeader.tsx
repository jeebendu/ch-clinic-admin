
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, Plus, List, Table, Calendar } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  viewMode?: 'list' | 'table' | 'calendar';
  onViewModeToggle?: () => void;
  onRefreshClick?: () => void;
  onFilterToggle?: () => void;
  showFilter?: boolean;
  loadedElements?: number;
  totalElements?: number;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddButtonClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  viewMode = 'list',
  onViewModeToggle,
  onRefreshClick,
  onFilterToggle,
  showFilter,
  loadedElements,
  totalElements,
  onSearchChange,
  searchValue,
  showAddButton,
  addButtonLabel = "Add",
  onAddButtonClick,
}) => {
  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'list':
        return <List className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'list':
        return 'List View';
      case 'table':
        return 'Table View';
      case 'calendar':
        return 'Calendar View';
      default:
        return 'List View';
    }
  };

  return (
    <div className="border-b bg-background px-4 md:px-6 py-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Title and Stats */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {loadedElements !== undefined && totalElements !== undefined && (
            <span className="text-sm text-muted-foreground">
              {loadedElements} of {totalElements}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}

          {/* Filter Toggle */}
          {onFilterToggle && (
            <Button
              variant={showFilter ? "default" : "outline"}
              size="sm"
              onClick={onFilterToggle}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}

          {/* View Mode Toggle */}
          {onViewModeToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewModeToggle}
              title={getViewModeLabel()}
            >
              {getViewModeIcon()}
            </Button>
          )}

          {/* Refresh */}
          {onRefreshClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshClick}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}

          {/* Add Button */}
          {showAddButton && onAddButtonClick && (
            <Button
              size="sm"
              onClick={onAddButtonClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
