
import React, { useState } from 'react';
import { X, Users, Clock, Eye, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { QueueItemDto } from '@/admin/modules/queue/types/QueueApi';
import { useQueueData } from '@/hooks/useQueueData';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
}

const QueuePatientItem: React.FC<{ 
  item: QueueItemDto; 
  sequenceNumber: number;
}> = ({ item, sequenceNumber }) => {
  const getStatusBadge = () => {
    const status = item.status?.toLowerCase() || 'waiting';
    switch (status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Waiting
          </Badge>
        );
      case 'in_consultation':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Consultation
          </Badge>
        );
      case 'no_show':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            No-Show
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {status}
          </Badge>
        );
    }
  };

  const formatWaitingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatEstimatedTime = (estimatedTime: string) => {
    const date = new Date(estimatedTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  return (
    <div className="flex flex-col p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors space-y-3">
      <div className="flex items-start justify-between">
        {/* Sequence Number and Patient Name */}
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-clinic-primary/10 text-clinic-primary rounded-full flex items-center justify-center text-sm font-medium">
            {sequenceNumber}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Patient Name */}
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-gray-900">
                {item.patient_name || `Patient #${item.patient_id}`}
              </p>
              {getStatusBadge()}
            </div>
            
            {/* Patient Details */}
            <div className="mt-1 space-y-1">
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                {item.patient_age && (
                  <span>Age: {item.patient_age}</span>
                )}
                {item.patient_gender && (
                  <span>Gender: {item.patient_gender}</span>
                )}
              </div>
              
              {/* Mobile Number with Call Button */}
              {item.patient_mobile && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Mobile:</span>
                  <button
                    onClick={() => handlePhoneCall(item.patient_mobile)}
                    className="flex items-center space-x-1 text-xs text-clinic-primary hover:text-clinic-primary/80 transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{item.patient_mobile}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Timing Information */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded">
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>Waiting: {formatWaitingTime(item.waiting_minutes)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Est. Time: {formatEstimatedTime(item.estimated_consultation_time)}</span>
        </div>
      </div>
    </div>
  );
};

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  branchId
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today's date in YYYY-MM-DD format
    return new Date().toISOString().split('T')[0];
  });

  // Fetch queue data
  const { data: queueResponse, isLoading } = useQueueData({
    branch_id: parseInt(branchId),
    date: selectedDate,
    sort_by: 'actual_sequence',
    limit: showAll ? undefined : 10,
    enabled: isOpen,
  });

  const queueItems = queueResponse?.queue_items || [];
  
  // Filter active items only
  const activeItems = queueItems
  
  const sortedItems = activeItems.sort((a, b) => {
    // Sort by status first (in_consultation, then waiting), then by actual_sequence
    if (a.status !== b.status) {
      if (a.status === 'in_consultation') return -1;
      if (b.status === 'in_consultation') return 1;
    }
    return a.actual_sequence - b.actual_sequence;
  });

  // Calculate counts
  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;

  const displayItems = showAll ? sortedItems : sortedItems.slice(0, 4);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 transition-opacity z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-clinic-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Live Queue</h2>
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

        {/* Date Filter */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Label htmlFor="queue-date" className="text-sm font-medium text-gray-700">
              Date:
            </Label>
            <Input
              id="queue-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="flex-1 h-8 text-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                <span className="font-medium text-green-700">{waitingCount}</span> waiting
              </span>
              <span className="text-gray-600">
                <span className="font-medium text-blue-700">{inConsultationCount}</span> in consultation
              </span>
            </div>
            {isLoading && (
              <div className="h-2 w-2 bg-clinic-primary rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Queue List */}
        <ScrollArea className="flex-1 max-h-[calc(100vh-240px)]">
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-4 w-4 bg-clinic-primary rounded-full animate-pulse mr-2" />
                <span className="text-sm text-gray-500">Loading queue...</span>
              </div>
            ) : displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm">No patients in queue for {selectedDate}</p>
              </div>
            ) : (
              displayItems.map((item, index) => (
                <QueuePatientItem
                  key={item.patient_schedule_id}
                  item={item}
                  sequenceNumber={index + 1}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {sortedItems.length > 4 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full"
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showAll ? 'Show Less' : `View All (${sortedItems.length})`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
