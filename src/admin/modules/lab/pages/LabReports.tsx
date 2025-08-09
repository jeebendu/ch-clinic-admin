
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Eye, Print, FileText } from "lucide-react";

const LabReports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const reports = [
    {
      id: "RPT-001",
      orderId: "LAB-001",
      patient: "John Doe",
      age: 35,
      tests: ["Complete Blood Count"],
      reportDate: "2024-01-15",
      status: "Ready",
      doctor: "Dr. Smith"
    },
    {
      id: "RPT-002",
      orderId: "LAB-003",
      patient: "Mike Johnson",
      age: 42,
      tests: ["X-Ray Chest"],
      reportDate: "2024-01-14",
      status: "Delivered",
      doctor: "Dr. Johnson"
    },
    {
      id: "RPT-003",
      orderId: "LAB-005",
      patient: "Anna Davis",
      age: 29,
      tests: ["Lipid Profile", "Liver Function Test"],
      reportDate: "2024-01-13",
      status: "Ready",
      doctor: "Dr. Wilson"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Delivered':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lab Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by report ID or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Report ID</th>
                  <th className="text-left p-2 font-medium">Order ID</th>
                  <th className="text-left p-2 font-medium">Patient</th>
                  <th className="text-left p-2 font-medium">Tests</th>
                  <th className="text-left p-2 font-medium">Doctor</th>
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <span className="font-medium text-blue-600">{report.id}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-gray-600">{report.orderId}</span>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{report.patient}</p>
                        <p className="text-sm text-gray-500">{report.age} years</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        {report.tests.map((test, index) => (
                          <div key={index} className="text-sm">{test}</div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 text-sm">{report.doctor}</td>
                    <td className="p-2 text-sm text-gray-600">{report.reportDate}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" title="View Report">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Print Report">
                          <Print className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Download Report">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabReports;
