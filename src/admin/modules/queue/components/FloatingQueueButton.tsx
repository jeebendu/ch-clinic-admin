
import React, { useState } from 'react';
import { Users, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QueueDrawer } from './QueueDrawer';
import { useQuery } from '@tanstack/react-query';
import { QueueItem, QueueStats } from '@/admin/modules/queue/types/Queue';



const fetchQueueData = async (): Promise<QueueItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockQueueData;
};

const FloatingQueueButton: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: queueItems = [], isLoading } = useQuery({
    queryKey: ['queue-data'],
    queryFn: fetchQueueData,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;

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
      >
        <div className="flex flex-col items-center">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          {waitingCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {waitingCount}
            </Badge>
          )}
        </div>
      </Button>

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        queueItems={queueItems}
        isLoading={isLoading}
        waitingCount={waitingCount}
        inConsultationCount={inConsultationCount}
      />
    </>
  );
};

export default FloatingQueueButton;
