
import React from 'react';
import { Clock, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QueueItemDto } from '../types/QueueApi';
import { Skeleton } from '@/components/ui/skeleton';

interface QueueListProps {
  queueItems: QueueItemDto[];
  isLoading: boolean;
  totalCount: number;
}

const QueueListItem: React.FC<{ item: QueueItemDto; index: number }> = ({ item, index }) => {
  const getStatusBadge = () => {
    switch (item.status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Waiting</Badge>;
      case 'in_consultation':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">In Consultation</Badge>;
      case 'no_show':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">No Show</Badge>;
      default:
        return <Badge variant="outline">{item.status}</Badge>;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatWaitingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Sequence Number */}
        <div className="flex-shrink-0 w-10 h-10 bg-clinic-primary/10 text-clinic-primary rounded-full flex items-center justify-center font-medium">
          {item.actual_sequence}
        </div>
        
        <div className="flex-1">
          {/* Patient Info */}
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-medium text-gray-900">Patient #{item.patient_id}</p>
            <p className="text-sm text-gray-500">Dr. ID: {item.consulting_doctor_id}</p>
          </div>
          
          {/* Time Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Check-in: {formatTime(item.checkin_time)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Waiting: {formatWaitingTime(item.waiting_minutes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Est: {formatTime(item.estimated_consultation_time)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status */}
      <div className="flex-shrink-0">
        {getStatusBadge()}
      </div>
    </div>
  );
};

const QueueListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

export const QueueList: React.FC<QueueListProps> = ({ queueItems, isLoading, totalCount }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue List</CardTitle>
        </CardHeader>
        <CardContent>
          <QueueListSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Queue List</CardTitle>
          <Badge variant="outline">{totalCount} patients</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {queueItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm">No patients in queue today</p>
            </div>
          ) : (
            <div>
              {queueItems.map((item, index) => (
                <QueueListItem
                  key={item.patient_schedule_id}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
