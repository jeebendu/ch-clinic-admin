
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QueueDrawer } from './QueueDrawer';
import { useQueueCount } from '@/hooks/useQueueData';

const FloatingQueueButton: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Only fetch count for the floating button - no date filter needed for count
  const { data: queueCount = 0, isLoading } = useQueueCount({
    // Count API typically doesn't need date filter, but if it does, you can add it here
  });

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsDrawerOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-clinic-primary hover:bg-clinic-secondary text-white",
          "transition-all duration-300 hover:scale-110",
          "md:h-16 md:w-16"
        )}
        disabled={isLoading}
      >
        <div className="flex flex-col items-center">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          {queueCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {queueCount}
            </Badge>
          )}
        </div>
      </Button>

      {/* Queue Drawer - fetches its own data when opened */}
      <QueueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default FloatingQueueButton;
