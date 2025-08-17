import React, { useState, useEffect } from 'react';
import { X, Clock, Users, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { useQueueData } from '@/hooks/useQueueData';
import { useBranchFilter } from '@/hooks/use-branch-filter';
import { Skeleton } from "@/components/ui/skeleton"

interface QueueItem {
  id: string;
  patient_name: string;
  time: string;
  status: 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
}

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { selectedBranch } = useBranchFilter();

  const { data: queueResponse, isLoading, refetch } = useQueueData({
    branch_id: selectedBranch ? parseInt(selectedBranch) : undefined,
    date: selectedDate,
    enabled: isOpen && !!selectedBranch,
  });

  const queueItems = queueResponse?.queue_items || [];
  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;

  useEffect(() => {
    if (isOpen && selectedBranch) {
      refetch();
    }
  }, [isOpen, selectedBranch, selectedDate, refetch]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(format(today, 'yyyy-MM-dd'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Queue Management</h2>
              <p className="text-sm text-gray-500">Manage patient queue</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b px-6 py-4 space-y-4">
          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <div className="flex gap-2">
              <DatePicker
                value={selectedDate ? new Date(selectedDate) : undefined}
                onChange={handleDateChange}
                placeholder="Select date"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTodayClick}
                className="shrink-0"
              >
                Today
              </Button>
            </div>
          </div>

          {/* Branch Filter */}
          {selectedBranch && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Branch</label>
              <p className="text-sm text-gray-500">{selectedBranch}</p>
            </div>
          )}

          {/* Queue Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Waiting</p>
              <Badge variant="secondary">{waitingCount}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">In Consultation</p>
              <Badge variant="secondary">{inConsultationCount}</Badge>
            </div>
          </div>
        </div>

        {/* Queue List */}
        <ScrollArea className="flex-1 px-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : queueItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              No patients in the queue for the selected date.
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {queueItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border rounded-md p-4"
                >
                  <User className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">{item.patient_name}</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500">{item.time}</p>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
