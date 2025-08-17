
import React from 'react';
import { X, Clock, Phone, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useQueueData } from '@/hooks/useQueueData';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  // Fetch queue data only when drawer is opened
  const { data: queueResponse, isLoading } = useQueueData({
    enabled: isOpen, // Only fetch when drawer is open
  });

  const queueItems = queueResponse?.data || [];
  const waitingCount = queueItems.filter(item => 
    item.status?.toLowerCase() === 'waiting' || item.status?.toLowerCase() === 'checked_in'
  ).length;
  const inConsultationCount = queueItems.filter(item => 
    item.status?.toLowerCase() === 'in_consultation' || item.status?.toLowerCase() === 'consulting'
  ).length;

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'waiting':
      case 'checked_in':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_consultation':
      case 'consulting':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'waiting':
      case 'checked_in':
        return 'Waiting';
      case 'in_consultation':
      case 'consulting':
        return 'In Consultation';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  };

  const handleCallPatient = (mobile: string) => {
    if (mobile) {
      window.open(`tel:${mobile}`, '_self');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">Patient Queue</h2>
            <p className="text-sm text-muted-foreground">
              {waitingCount} waiting • {inConsultationCount} in consultation
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="rounded-lg bg-yellow-50 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{waitingCount}</div>
            <div className="text-sm text-yellow-600">Waiting</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{inConsultationCount}</div>
            <div className="text-sm text-blue-600">In Consultation</div>
          </div>
        </div>

        {/* Queue List */}
        <ScrollArea className="flex-1 px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading queue...</p>
              </div>
            </div>
          ) : queueItems.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No patients in queue</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {queueItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  {/* Patient Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {item.patient_name || 'Unknown Patient'}
                        </h3>
                        <Badge
                          className={cn(
                            "text-xs",
                            getStatusColor(item.status || '')
                          )}
                        >
                          {getStatusDisplay(item.status || '')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {item.age && (
                          <span>{item.age} years</span>
                        )}
                        {item.gender && (
                          <span>{item.gender}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">#{item.actual_sequence || index + 1}</div>
                    </div>
                  </div>

                  {/* Contact and Time Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.mobile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleCallPatient(item.mobile)}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {item.mobile}
                        </Button>
                      )}
                    </div>
                    {item.appointment_time && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.appointment_time}</span>
                      </div>
                    )}
                  </div>

                  {item.doctor_name && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Dr. {item.doctor_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
