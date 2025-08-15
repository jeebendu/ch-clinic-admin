
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Phone, User, MoreVertical, PhoneCall, UserCheck, CheckCircle, XCircle } from 'lucide-react';
import { QueueItem, QueueStatus } from '../types/Queue';
import { formatDistance } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface QueueItemCardProps {
  item: QueueItem;
  onStatusUpdate: (queueId: string, status: QueueStatus, notes?: string) => void;
  onRemove: (queueId: string) => void;
}

const QueueItemCard: React.FC<QueueItemCardProps> = ({ item, onStatusUpdate, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: QueueStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(item.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getSourceBadge = () => {
    switch (item.source) {
      case 'online_appointment':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Online</Badge>;
      case 'walk_in':
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Walk-in</Badge>;
      case 'staff_added':
        return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">Staff</Badge>;
      default:
        return null;
    }
  };

  const getWaitTime = () => {
    const startTime = item.checkedInTime || item.createdTime;
    return formatDistance(new Date(startTime), new Date(), { addSuffix: false });
  };

  const getStatusActions = () => {
    switch (item.status) {
      case 'waiting':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate('called')}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PhoneCall className="h-3 w-3 mr-1" />
            Call
          </Button>
        );
      case 'called':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate('in_consultation')}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Start
          </Button>
        );
      case 'in_consultation':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate('completed')}
            disabled={isUpdating}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.patient.photoUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {item.patient.firstname.charAt(0)}{item.patient.lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">
                  {item.patient.firstname} {item.patient.lastname}
                </h4>
                <p className="text-xs text-gray-500">Token: {item.tokenNumber}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate('no_show')}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark No Show
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onRemove(item.id)}
                  className="text-red-600"
                >
                  Remove from Queue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Patient Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <User className="h-3 w-3" />
              <span>Dr. {item.doctor.firstname} {item.doctor.lastname}</span>
            </div>
            
            {item.patient.mobile && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{item.patient.mobile}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Wait: {getWaitTime()}</span>
            </div>
          </div>

          {/* Source Badge */}
          <div className="flex justify-between items-center">
            {getSourceBadge()}
            {item.appointment && (
              <Badge variant="outline" className="text-xs">
                #{item.appointment.id}
              </Badge>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p className="text-gray-700">{item.notes}</p>
            </div>
          )}

          {/* Action Button */}
          {getStatusActions()}
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueItemCard;
