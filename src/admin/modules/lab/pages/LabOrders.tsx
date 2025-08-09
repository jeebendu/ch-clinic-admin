
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import { LabOrder, LabOrderStatus, LabOrderPriority } from '../types/LabOrder';
import { labOrderService } from '../services/labOrderService';

const LabOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<LabOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  useEffect(() => {
    loadLabOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, priorityFilter, branchFilter]);

  const loadLabOrders = async () => {
    setIsLoading(true);
    try {
      const response = await labOrderService.getLabOrders(0, 50);
      setOrders(response.content || []);
    } catch (error) {
      console.error('Error loading lab orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lab orders',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.mobile.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Branch filter
    if (branchFilter !== 'all') {
      filtered = filtered.filter(order => order.branchId.toString() === branchFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadgeVariant = (status: LabOrderStatus) => {
    switch (status) {
      case LabOrderStatus.PENDING:
        return 'secondary';
      case LabOrderStatus.IN_PROGRESS:
        return 'default';
      case LabOrderStatus.COMPLETED:
        return 'default';
      case LabOrderStatus.CANCELLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: LabOrderPriority) => {
    switch (priority) {
      case LabOrderPriority.ROUTINE:
        return 'secondary';
      case LabOrderPriority.URGENT:
        return 'default';
      case LabOrderPriority.STAT:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this lab order?')) return;

    try {
      await labOrderService.deleteLabOrder(orderId);
      toast({
        title: 'Success',
        description: 'Lab order deleted successfully'
      });
      loadLabOrders();
    } catch (error) {
      console.error('Error deleting lab order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lab order',
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Lab Orders"
          showAddButton
          addButtonLabel="New Lab Order"
          onAddButtonClick={() => navigate('/admin/lab/orders/new')}
        />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order number, patient name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={LabOrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={LabOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={LabOrderStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={LabOrderStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value={LabOrderPriority.ROUTINE}>Routine</SelectItem>
                  <SelectItem value={LabOrderPriority.URGENT}>Urgent</SelectItem>
                  <SelectItem value={LabOrderPriority.STAT}>STAT</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setBranchFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">Loading lab orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No lab orders found. {orders.length === 0 ? 'Create your first lab order!' : 'Try adjusting your filters.'}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Patient:</span>
                          <p>{order.patient.firstname} {order.patient.lastname}</p>
                          <p className="text-gray-500">{order.patient.mobile}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Order Date:</span>
                          <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                          {order.expectedDate && (
                            <>
                              <span className="font-medium text-gray-600">Expected:</span>
                              <p>{new Date(order.expectedDate).toLocaleDateString()}</p>
                            </>
                          )}
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Branch:</span>
                          <p>{order.branch?.name || 'N/A'}</p>
                          {order.referringDoctor && (
                            <>
                              <span className="font-medium text-gray-600">Doctor:</span>
                              <p>{order.referringDoctor}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {order.labOrderItems && order.labOrderItems.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-600">Tests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {order.labOrderItems.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item.testType?.name || `Test ${item.testTypeId}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.comments && (
                        <div>
                          <span className="font-medium text-gray-600">Comments:</span>
                          <p className="text-sm text-gray-700">{order.comments}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/lab/orders/${order.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/lab/orders/${order.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LabOrders;
