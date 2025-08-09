
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Edit, Download, Plus, Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LabOrderItem {
  id: number;
  testTypeId: number;
  testName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  sampleCollected: boolean;
  sampleCollectionDate?: string;
}

interface LabOrder {
  id: number;
  orderNumber: string;
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    contactNumber: string;
  };
  branchId: number;
  branchName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  orderDate: string;
  expectedDate?: string;
  referringDoctor?: string;
  comments?: string;
  labOrderItems: LabOrderItem[];
}

const LabOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const navigate = useNavigate();

  // Mock data matching the DTO structure
  const orders: LabOrder[] = [
    {
      id: 1,
      orderNumber: "LAB-2025-001",
      patient: {
        id: 1,
        name: "John Doe",
        age: 35,
        gender: "Male",
        contactNumber: "9876543210"
      },
      branchId: 1,
      branchName: "Main Branch",
      status: "PENDING",
      priority: "ROUTINE",
      orderDate: "2025-01-15T09:30:00",
      expectedDate: "2025-01-16T09:30:00",
      referringDoctor: "Dr. Smith",
      comments: "Patient fasting required",
      labOrderItems: [
        {
          id: 1,
          testTypeId: 1,
          testName: "Complete Blood Count (CBC)",
          status: "PENDING",
          sampleCollected: false
        },
        {
          id: 2,
          testTypeId: 3,
          testName: "Blood Sugar (Random)",
          status: "PENDING",
          sampleCollected: false
        }
      ]
    },
    {
      id: 2,
      orderNumber: "LAB-2025-002",
      patient: {
        id: 2,
        name: "Jane Smith",
        age: 28,
        gender: "Female",
        contactNumber: "9876543211"
      },
      branchId: 2,
      branchName: "North Branch",
      status: "IN_PROGRESS",
      priority: "URGENT",
      orderDate: "2025-01-14T14:15:00",
      expectedDate: "2025-01-15T14:15:00",
      referringDoctor: "Dr. Johnson",
      labOrderItems: [
        {
          id: 3,
          testTypeId: 8,
          testName: "Urine Routine",
          status: "COMPLETED",
          sampleCollected: true,
          sampleCollectionDate: "2025-01-14T15:00:00"
        },
        {
          id: 4,
          testTypeId: 5,
          testName: "Lipid Profile",
          status: "IN_PROGRESS",
          sampleCollected: true,
          sampleCollectionDate: "2025-01-14T15:00:00"
        }
      ]
    },
    {
      id: 3,
      orderNumber: "LAB-2025-003",
      patient: {
        id: 3,
        name: "Mike Johnson",
        age: 42,
        gender: "Male",
        contactNumber: "9876543212"
      },
      branchId: 1,
      branchName: "Main Branch",
      status: "COMPLETED",
      priority: "STAT",
      orderDate: "2025-01-13T10:00:00",
      expectedDate: "2025-01-13T16:00:00",
      referringDoctor: "Dr. Wilson",
      comments: "Emergency case",
      labOrderItems: [
        {
          id: 5,
          testTypeId: 11,
          testName: "X-Ray Chest",
          status: "COMPLETED",
          sampleCollected: true,
          sampleCollectionDate: "2025-01-13T10:30:00"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'URGENT':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ROUTINE':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesBranch = branchFilter === 'all' || order.branchId.toString() === branchFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesBranch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lab Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track laboratory orders</p>
        </div>
        <Button onClick={() => navigate('/admin/lab/new-order')}>
          <Plus className="h-4 w-4 mr-2" />
          New Lab Order
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="ROUTINE">Routine</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="STAT">STAT</SelectItem>
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="1">Main Branch</SelectItem>
                  <SelectItem value="2">North Branch</SelectItem>
                  <SelectItem value="3">South Branch</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-gray-600 text-sm">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'PENDING').length}</p>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'IN_PROGRESS').length}</p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'COMPLETED').length}</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.orderNumber}</div>
                    {order.referringDoctor && (
                      <div className="text-sm text-gray-600">Dr: {order.referringDoctor}</div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{order.patient.name}</div>
                    <div className="text-sm text-gray-600">
                      {order.patient.age}y, {order.patient.gender}
                    </div>
                    <div className="text-xs text-gray-500">{order.patient.contactNumber}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.labOrderItems.slice(0, 2).map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.testName.length > 15 ? `${item.testName.substring(0, 15)}...` : item.testName}
                        </Badge>
                      ))}
                      {order.labOrderItems.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-100">
                          +{order.labOrderItems.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.labOrderItems.length} test{order.labOrderItems.length > 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">{order.branchName}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">Ordered: {formatDate(order.orderDate)}</div>
                      <div className="text-gray-600">{formatTime(order.orderDate)}</div>
                      {order.expectedDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expected: {formatDate(order.expectedDate)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit Order">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Download Report">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabOrders;
