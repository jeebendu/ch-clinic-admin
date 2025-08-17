
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueueDrawer } from '@/admin/modules/queue/components/QueueDrawer';
import { useQueueData } from '@/hooks/useQueueData';
import { useBranchFilter } from '@/hooks/use-branch-filter';

export const FloatingQueueButton: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { selectedBranch } = useBranchFilter();

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Fetch queue count for the floating button
  const { data: queueResponse } = useQueueData({
    branch_id: selectedBranch ? parseInt(selectedBranch) : undefined,
    date: today,
    sort_by: 'actual_sequence',
    limit: 50, // Get more data for accurate counts
    enabled: !!selectedBranch,
  });

  const queueItems = queueResponse?.queue_items || [];
  const activeCount = queueItems.filter(item => 
    item.status === 'waiting' || item.status === 'in_consultation'
  ).length;

  if (!selectedBranch) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="relative bg-clinic-primary hover:bg-clinic-primary/90 text-white rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Users className="h-6 w-6" />
          {activeCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
            >
              {activeCount > 99 ? '99+' : activeCount}
            </Badge>
          )}
        </Button>
      </div>

      <QueueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        branchId={selectedBranch}
      />
    </>
  );
};
