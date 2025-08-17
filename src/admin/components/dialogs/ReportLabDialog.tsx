
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  TestTube, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';

interface PatientReport {
  id: number;
  reportType: string;
  patientName: string;
  patientId: number;
  reportno: number;
  createdTime: string;
  status?: string;
}

interface LabOrder {
  id: number;
  orderNumber: string;
  patientName: string;
  patientId: number;
  status: string;
  priority: string;
  orderDate: string;
  testCount: number;
}

interface ReportLabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportLabDialog: React.FC<ReportLabDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('reports');

  // Mock data - replace with actual API calls
  const mockReports: PatientReport[] = [
    {
      id: 1,
      reportType: 'Audiometry',
      patientName: 'John Doe',
      patientId: 101,
      reportno: 1001,
      createdTime: '2024-01-15T10:30:00Z',
      status: 'Completed'
    },
    {
      id: 2,
      reportType: 'Speech',
      patientName: 'Jane Smith',
      patientId: 102,
      reportno: 1002,
      createdTime: '2024-01-14T14:20:00Z',
      status: 'Draft'
    },
    {
      id: 3,
      reportType: 'Laboratory',
      patientName: 'Mike Johnson',
      patientId: 103,
      reportno: 1003,
      createdTime: '2024-01-13T09:15:00Z',
      status: 'Completed'
    }
  ];

  const mockLabOrders: LabOrder[] = [
    {
      id: 1,
      orderNumber: 'LAB001',
      patientName: 'John Doe',
      patientId: 101,
      status: 'COMPLETED',
      priority: 'ROUTINE',
      orderDate: '2024-01-15T08:30:00Z',
      testCount: 3
    },
    {
      id: 2,
      orderNumber: 'LAB002',
      patientName: 'Jane Smith',
      patientId: 102,
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      orderDate: '2024-01-14T11:45:00Z',
      testCount: 2
    },
    {
      id: 3,
      orderNumber: 'LAB003',
      patientName: 'Mike Johnson',
      patientId: 103,
      status: 'PENDING',
      priority: 'STAT',
      orderDate: '2024-01-13T16:20:00Z',
      testCount: 5
    }
  ];

  const filteredReports = mockReports.filter(report =>
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportno.toString().includes(searchTerm)
  );

  const filteredLabOrders = mockLabOrders.filter(order =>
    order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'stat':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Lab Management
          </DialogTitle>
          <DialogDescription>
            Manage patient reports and laboratory orders
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, report type, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports ({filteredReports.length})
              </TabsTrigger>
              <TabsTrigger value="labs" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Lab Orders ({filteredLabOrders.length})
              </TabsTrigger>
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports" className="flex-1 overflow-auto">
              <div className="grid gap-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {report.reportType} Report #{report.reportno}
                        </CardTitle>
                        <Badge className={getStatusColor(report.status || '')}>
                          {report.status || 'Draft'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.patientName}</span>
                          <span className="text-muted-foreground">#{report.patientId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(report.createdTime), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredReports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports found matching your search criteria.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Lab Orders Tab */}
            <TabsContent value="labs" className="flex-1 overflow-auto">
              <div className="grid gap-4">
                {filteredLabOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TestTube className="h-5 w-5 text-primary" />
                          Lab Order {order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.patientName}</span>
                          <span className="text-muted-foreground">#{order.patientId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TestTube className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{order.testCount} tests</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Results
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredLabOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lab orders found matching your search criteria.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportLabDialog;
