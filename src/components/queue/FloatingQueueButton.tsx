
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { QueueDrawer } from './QueueDrawer';
import { useQueuePreview } from '@/hooks/useQueueData';
import { useBranchFilter } from '@/hooks/use-branch-filter';

const FloatingQueueButton: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { selectedBranch } = useBranchFilter();

  const { data: queueResponse, isLoading } = useQueuePreview({
    branch_id: selectedBranch ? parseInt(selectedBranch) : undefined,
    date: new Date().toISOString().split('T')[0],
    enabled: !!selectedBranch,
  });

  const queueItems = queueResponse?.queue_items || [];
  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;

  if (!selectedBranch) {
    return null; // Don't show button if no branch is selected
  }

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
        branchId={selectedBranch}
      />
    </>
  );
};

export default FloatingQueueButton;
