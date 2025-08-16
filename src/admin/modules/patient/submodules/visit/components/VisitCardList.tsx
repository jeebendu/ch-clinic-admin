
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowUp, ArrowDown } from 'lucide-react';
import VisitCard from './VisitCard';

interface AutoScrollControls {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToNext: () => void;
}

interface VisitCardListProps {
  visits: any[];
  isLoading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onVisitClick: (visit: any) => void;
  onVisitView: (visit: any) => void;
  onVisitEdit: (visit: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  autoScrollControls: AutoScrollControls;
}

const VisitCardList: React.FC<VisitCardListProps> = ({
  visits,
  isLoading,
  loadingMore,
  hasNextPage,
  onLoadMore,
  onVisitClick,
  onVisitView,
  onVisitEdit,
  containerRef,
  autoScrollControls
}) => {
  const { isPaused, setIsPaused, scrollToTop, scrollToBottom, scrollToNext } = autoScrollControls;

  if (isLoading && visits.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading visits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Auto-scroll Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className="h-8 w-8 bg-white shadow-md"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="h-8 w-8 bg-white shadow-md"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="h-8 w-8 bg-white shadow-md"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-full">
        <div ref={containerRef} className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits.map((visit, index) => (
              <VisitCard
                key={`${visit.id}-${index}`}
                visit={visit}
                onClick={() => onVisitClick(visit)}
                onView={() => onVisitView(visit)}
                onEdit={() => onVisitEdit(visit)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                disabled={loadingMore}
                variant="outline"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading more...
                  </div>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {/* No more data indicator */}
          {!hasNextPage && visits.length > 0 && (
            <div className="text-center mt-6 py-4 text-muted-foreground">
              No more visits to load
            </div>
          )}

          {/* Empty state */}
          {visits.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No visits found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VisitCardList;
