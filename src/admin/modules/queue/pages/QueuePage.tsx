
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import QueueBoard from '../components/QueueBoard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Clock, CheckCircle, XCircle, RefreshCw, UserPlus } from 'lucide-react';
import QueueTable from '../components/QueueTable';
import AddToQueueDialog from '../components/AddToQueueDialog';
import { queueService } from '../services/queueService';
import { QueueItem, QueueStats, QueueStatus } from '../types/Queue';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QueuePage: React.FC = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    totalWaiting: 0,
    totalInConsultation: 0,
    totalCompleted: 0,
    averageWaitTime: 0,
    longestWaitTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const loadQueueData = async () => {
    try {
      setLoading(true);
      const [items, stats] = await Promise.all([
        queueService.getQueueItems({ date: new Date() }),
        queueService.getQueueStats()
      ]);
      
      setQueueItems(items);
      setQueueStats(stats);
    } catch (error) {
      console.error('Error loading queue data:', error);
      toast({
        title: "Error",
        description: "Failed to load queue data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueueData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (queueId: string, status: QueueStatus) => {
    try {
      const updatedItem = await queueService.updateQueueStatus(queueId, status);
      if (updatedItem) {
        setQueueItems(prev => 
          prev.map(item => item.id === queueId ? updatedItem : item)
        );
        
        // Refresh stats
        const newStats = await queueService.getQueueStats();
        setQueueStats(newStats);
        
        toast({
          title: "Status Updated",
          description: `Queue item status updated to ${status.replace('_', ' ')}`,
        });
      }
    } catch (error) {
      console.error('Error updating queue status:', error);
      toast({
        title: "Error",
        description: "Failed to update queue status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewPatient = (queueItem: QueueItem) => {
    // Navigate to patient details or show patient info modal
    console.log('View patient:', queueItem.patient);
    toast({
      title: "Patient Details",
      description: `Viewing details for ${queueItem.patient.firstname} ${queueItem.patient.lastname}`,
    });
  };

  const handleAddPatientSuccess = () => {
    loadQueueData(); // Refresh the queue data
    toast({
      title: "Patient Added",
      description: "Patient has been successfully added to the queue and visit record created.",
    });
  };

  const statsCards = [
    {
      title: 'Waiting',
      value: queueStats.totalWaiting,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'In Consultation',
      value: queueStats.totalInConsultation,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Completed',
      value: queueStats.totalCompleted,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Avg Wait Time',
      value: `${queueStats.averageWaitTime}m`,
      icon: Clock,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queue Management</h1>
          <p className="text-muted-foreground">Manage patient queue and workflow</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={loadQueueData}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Patient to Queue</span>
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

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Queue</CardTitle>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-sm">
                {queueItems.length} patients
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Live Updates
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <QueueTable
            queueItems={queueItems}
            onStatusUpdate={handleStatusUpdate}
            onViewPatient={handleViewPatient}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Add Patient Dialog */}
      <AddToQueueDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleAddPatientSuccess}
      />
    </div>
  );
};

export default QueuePage;
