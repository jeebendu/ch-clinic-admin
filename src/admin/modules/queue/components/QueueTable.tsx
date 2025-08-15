
import React from 'react';
import { QueueItem, QueueStatus } from '../types/Queue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Clock, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface QueueTableProps {
  queueItems: QueueItem[];
  onStatusUpdate: (queueId: string, status: QueueStatus) => void;
  onViewPatient: (queueItem: QueueItem) => void;
  loading?: boolean;
}

const QueueTable: React.FC<QueueTableProps> = ({
  queueItems,
  onStatusUpdate,
  onViewPatient,
  loading = false
}) => {
  const getStatusBadge = (status: QueueStatus) => {
    const statusConfig = {
      waiting: { color: 'bg-yellow-100 text-yellow-800', label: 'Waiting' },
      called: { color: 'bg-blue-100 text-blue-800', label: 'Called' },
      in_consultation: { color: 'bg-green-100 text-green-800', label: 'In Consultation' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      no_show: { color: 'bg-red-100 text-red-800', label: 'No Show' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      online_appointment: { color: 'bg-purple-100 text-purple-800', label: 'Online' },
      walk_in: { color: 'bg-orange-100 text-orange-800', label: 'Walk-in' },
      staff_added: { color: 'bg-teal-100 text-teal-800', label: 'Staff Added' }
    };

    const config = sourceConfig[source as keyof typeof sourceConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getWaitTime = (queueItem: QueueItem) => {
    if (queueItem.status === 'completed' || queueItem.status === 'no_show') {
      return 'N/A';
    }
    
    const startTime = queueItem.checkedInTime || queueItem.createdTime;
    const waitTime = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / (1000 * 60));
    return `${waitTime} min`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Wait Time</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-4 w-28 rounded"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-6 w-20 rounded-full"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div></TableCell>
                <TableCell><div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div></TableCell>
                <TableCell className="text-right">
                  <div className="animate-pulse bg-gray-200 h-8 w-20 ml-auto rounded"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Wait Time</TableHead>
            <TableHead>Check-in Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queueItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No patients in queue</p>
                <p className="text-sm">Queue items will appear here when patients check in</p>
              </TableCell>
            </TableRow>
          ) : (
            queueItems.map((queueItem) => (
              <TableRow key={queueItem.id} className="hover:bg-gray-50">
                <TableCell className="font-mono font-medium">
                  {queueItem.tokenNumber}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {queueItem.patient.firstname} {queueItem.patient.lastname}
                      </p>
                      <p className="text-sm text-gray-500">{queueItem.patient.uid}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      Dr. {queueItem.doctor.firstname} {queueItem.doctor.lastname}
                    </p>
                    <p className="text-sm text-gray-500">{queueItem.doctor.qualification}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(queueItem.status)}
                </TableCell>
                <TableCell>
                  {getSourceBadge(queueItem.source)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{getWaitTime(queueItem)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {queueItem.checkedInTime 
                      ? format(new Date(queueItem.checkedInTime), 'HH:mm')
                      : format(new Date(queueItem.createdTime), 'HH:mm')
                    }
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPatient(queueItem)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {queueItem.status === 'waiting' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusUpdate(queueItem.id, 'called')}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Call
                      </Button>
                    )}
                    
                    {queueItem.status === 'called' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusUpdate(queueItem.id, 'in_consultation')}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        Start
                      </Button>
                    )}
                    
                    {queueItem.status === 'in_consultation' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusUpdate(queueItem.id, 'completed')}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QueueTable;
