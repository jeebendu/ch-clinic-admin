
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  List, 
  Calendar,
  Grid,
  Plus 
} from 'lucide-react';

type ViewMode = 'list' | 'calendar' | 'grid';

interface PageHeaderProps {
  title: string;
  viewMode?: ViewMode;
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
  showFilter = false,
  loadedElements = 0,
  totalElements = 0,
  onSearchChange,
  searchValue = '',
  showAddButton = false,
  addButtonLabel = 'Add New',
  onAddButtonClick,
}) => {
  const getViewIcon = () => {
    switch (viewMode) {
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'grid':
        return <Grid className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-b bg-background px-4 md:px-6 py-4">
      <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {totalElements > 0 && (
              <span className="text-sm text-muted-foreground">
                {loadedElements} of {totalElements}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showAddButton && (
              <Button onClick={onAddButtonClick}>
                <Plus className="h-4 w-4 mr-2" />
                {addButtonLabel}
              </Button>
            )}
            
            {onViewModeToggle && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onViewModeToggle}
                title={`Switch to ${viewMode === 'list' ? 'calendar' : 'list'} view`}
              >
                {getViewIcon()}
              </Button>
            )}
            
            {onRefreshClick && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onRefreshClick}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            
            {onFilterToggle && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onFilterToggle}
                className={showFilter ? 'bg-accent' : ''}
                title="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search bar */}
        {onSearchChange && (
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visits..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
