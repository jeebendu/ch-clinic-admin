
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, UserCheck, CheckCircle, Search, Filter, Plus } from 'lucide-react';
import { QueueItem, QueueStats, QueueStatus, QueueSource } from '../types/Queue';
import { queueService } from '../services/queueService';
import QueueItemCard from './QueueItemCard';
import AddToQueueDialog from './AddToQueueDialog';

const QueueBoard: React.FC = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalWaiting: 0,
    totalInConsultation: 0,
    totalCompleted: 0,
    averageWaitTime: 0,
    longestWaitTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QueueStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<QueueSource | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadQueueData();
    const interval = setInterval(loadQueueData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [searchTerm, statusFilter, sourceFilter]);

  const loadQueueData = async () => {
    try {
      const filter = {
        searchTerm: searchTerm || undefined,
        status: statusFilter !== 'all' ? [statusFilter as QueueStatus] : undefined,
        source: sourceFilter !== 'all' ? [sourceFilter as QueueSource] : undefined,
        date: new Date()
      };

      const [items, queueStats] = await Promise.all([
        queueService.getQueueItems(filter),
        queueService.getQueueStats()
      ]);

      setQueueItems(items);
      setStats(queueStats);
    } catch (error) {
      console.error('Error loading queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queueId: string, status: QueueStatus, notes?: string) => {
    try {
      await queueService.updateQueueStatus(queueId, status, notes);
      loadQueueData();
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const handleRemoveFromQueue = async (queueId: string) => {
    try {
      await queueService.removeFromQueue(queueId);
      loadQueueData();
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  };

  const getStatusColor = (status: QueueStatus): string => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'called': return 'bg-blue-100 text-blue-800';
      case 'in_consultation': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedItems = queueItems.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<QueueStatus, QueueItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600">Manage patient queue and appointments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add to Queue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWaiting}</div>
            <p className="text-xs text-gray-600">patients in queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInConsultation}</div>
            <p className="text-xs text-gray-600">currently consulting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-gray-600">completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWaitTime}m</div>
            <p className="text-xs text-gray-600">average wait time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name or token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QueueStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="called">Called</SelectItem>
                <SelectItem value="in_consultation">In Consultation</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as QueueSource | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="online_appointment">Online</SelectItem>
                <SelectItem value="walk_in">Walk-in</SelectItem>
                <SelectItem value="staff_added">Staff Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['waiting', 'called', 'in_consultation', 'completed'] as QueueStatus[]).map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                {status.replace('_', ' ')}
                <Badge className={getStatusColor(status)}>
                  {groupedItems[status]?.length || 0}
                </Badge>
              </h3>
            </div>
            
            <div className="space-y-3">
              {groupedItems[status]?.map((item) => (
                <QueueItemCard
                  key={item.id}
                  item={item}
                  onStatusUpdate={handleStatusUpdate}
                  onRemove={handleRemoveFromQueue}
                />
              ))}
              
              {(!groupedItems[status] || groupedItems[status].length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No patients {status.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add to Queue Dialog */}
      <AddToQueueDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
          loadQueueData();
        }}
      />
    </div>
  );
};

export default QueueBoard;
