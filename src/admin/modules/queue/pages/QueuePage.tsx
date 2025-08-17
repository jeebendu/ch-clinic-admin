
import React, { useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Clock, CheckCircle } from 'lucide-react';
import { QueueList } from '../components/QueueList';
import { useQueueData } from '@/hooks/useQueueData';
import { useBranchFilter } from '@/hooks/use-branch-filter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QueuePage: React.FC = () => {
  const { selectedBranch } = useBranchFilter();
  const [sortBy, setSortBy] = useState<'actual_sequence' | 'checkin_time'>('actual_sequence');
  const today = new Date().toISOString().split('T')[0];

  const { data: queueResponse, isLoading, refetch } = useQueueData({
    branch_id: selectedBranch ? parseInt(selectedBranch) : undefined,
    date: today,
    sort_by: sortBy,
    enabled: !!selectedBranch,
  });

  const queueItems = queueResponse?.queue_items || [];
  const totalCount = queueResponse?.total_count || 0;

  // Calculate stats
  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inConsultationCount = queueItems.filter(item => item.status === 'in_consultation').length;
  const completedCount = queueItems.filter(item => item.status === 'completed').length;
  const averageWaitTime = queueItems.length > 0 
    ? Math.round(queueItems.reduce((sum, item) => sum + item.waiting_minutes, 0) / queueItems.length)
    : 0;

  const statsCards = [
    {
      title: 'Waiting',
      value: waitingCount,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'In Consultation',
      value: inConsultationCount,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Avg Wait Time',
      value: `${averageWaitTime}m`,
      icon: Clock,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  if (!selectedBranch) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Users className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg">Please select a branch to view the queue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queue Management</h1>
          <p className="text-muted-foreground">Manage patient queue and workflow</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actual_sequence">Sort by Sequence</SelectItem>
              <SelectItem value="checkin_time">Sort by Check-in Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue List */}
      <QueueList
        queueItems={queueItems}
        isLoading={isLoading}
        totalCount={totalCount}
      />
    </div>
  );
};

export default QueuePage;
