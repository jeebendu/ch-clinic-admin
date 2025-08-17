
import React, { useState } from 'react';
import { X, Users, Clock, Eye, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { QueueItemDto } from '@/admin/modules/queue/types/QueueApi';
import { useQueueData } from '@/hooks/useQueueData';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queueItems: QueueItemDto[];
  isLoading: boolean;
  waitingCount: number;
  inConsultationCount: number;
  branchId: string;
}

// Normalize backend status values to a consistent set we can rely on
const normalizeStatus = (status?: string): 'waiting' | 'in_consultation' | 'no_show' | 'other' => {
  const s = (status || '').toLowerCase().replace(/[\s-]/g, '_');
  if (s === 'waiting') return 'waiting';
  if (s === 'in_consultation' || s === 'inconsultation') return 'in_consultation';
  if (s === 'no_show' || s === 'noshow' || s === 'no_showup') return 'no_show';
  return 'other';
};

const QueuePatientItem: React.FC<{ 
  item: QueueItemDto; 
  sequenceNumber: number;
}> = ({ item, sequenceNumber }) => {
  const status = normalizeStatus(item.status);

  const getStatusBadge = () => {
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
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            {item.status || 'Unknown'}
          </Badge>
        );
    }
  };

  const formatWaitingTime = (minutes: number) => {
    if (minutes == null || isNaN(Number(minutes))) return '-';
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatEstimatedTime = (estimatedTime?: string) => {
    if (!estimatedTime) return '-';
    const date = new Date(estimatedTime);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const displayName = item.patient_name?.trim() || `Patient #${item.patient_id}`;
  const detailLine = [
    item.patient_age ? `Age ${item.patient_age}` : null,
    item.patient_gender ? item.patient_gender : null,
  ].filter(Boolean).join(' • ');

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        {/* Sequence Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-clinic-primary/10 text-clinic-primary rounded-full flex items-center justify-center text-sm font-medium">
          {sequenceNumber}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Patient Info */}
          <p className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </p>

          {detailLine && (
            <p className="text-xs text-gray-500 mt-0.5">{detailLine}</p>
          )}
          
          {/* Waiting Time and Estimated Time */}
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                waiting {formatWaitingTime(item.waiting_minutes)}
              </span>
            </div>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-500">
              ~{formatEstimatedTime(item.estimated_consultation_time)}
            </span>
            {item.patient_mobile && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <a
                  href={`tel:${item.patient_mobile}`}
                  className="text-xs text-clinic-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.patient_mobile}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Status + Call */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {getStatusBadge()}
        {item.patient_mobile && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            asChild
          >
            <a href={`tel:${item.patient_mobile}`} onClick={(e) => e.stopPropagation()} aria-label="Call patient">
              <Phone className="h-4 w-4 text-clinic-primary" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queueItems: previewItems,
  isLoading: previewLoading,
  waitingCount,
  inConsultationCount,
  branchId
}) => {
  const [showAll, setShowAll] = useState(false);

  // Parse branch id safely
  const parsedBranchId = Number(branchId);
  const canFetch = Number.isFinite(parsedBranchId) && parsedBranchId > 0;

  // Fetch full queue data when showing all items
  const { data: fullQueueResponse, isLoading: fullLoading } = useQueueData({
    branch_id: parsedBranchId,
    date: new Date().toISOString().split('T')[0],
    enabled: showAll && isOpen && canFetch,
  });

  const fullQueueItems = fullQueueResponse?.queue_items || [];
  const displayItems = showAll ? fullQueueItems : (previewItems || []);
  const isLoading = showAll ? fullLoading : previewLoading;

  // Log to verify data reaching the component
  if (isOpen) {
    console.log('[QueueDrawer] isOpen:', isOpen, 'showAll:', showAll);
    console.log('[QueueDrawer] previewItems length:', previewItems?.length || 0);
    console.log('[QueueDrawer] fullQueueItems length:', fullQueueItems.length);
    console.log('[QueueDrawer] sample item:', displayItems?.[0]);
  }

  // Filter and sort queue items - active items only (normalize status before filtering)
  const activeItems = (displayItems || []).filter(item => {
    const s = normalizeStatus(item.status);
    return s === 'waiting' || s === 'in_consultation';
  });
  
  const sortedItems = activeItems.sort((a, b) => {
    // Sort by status first (in_consultation, then waiting), then by actual_sequence
    const sa = normalizeStatus(a.status);
    const sb = normalizeStatus(b.status);
    if (sa !== sb) {
      if (sa === 'in_consultation') return -1;
      if (sb === 'in_consultation') return 1;
    }
    const aSeq = Number(a.actual_sequence ?? Number.MAX_SAFE_INTEGER);
    const bSeq = Number(b.actual_sequence ?? Number.MAX_SAFE_INTEGER);
    return aSeq - bSeq;
  });

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
          "fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50",
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
        <ScrollArea className="flex-1 max-h-[calc(100vh-180px)]">
          <div className="divide-y divide-gray-100">
            {sortedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm">No patients in queue</p>
              </div>
            ) : (
              sortedItems.map((item, index) => (
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
        {!showAll && (previewItems?.length || 0) >= 4 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="w-full"
              disabled={fullLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              {fullLoading ? 'Loading...' : 'View All'}
            </Button>
          </div>
        )}
        
        {showAll && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="outline"
              onClick={() => setShowAll(false)}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Show Less
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
