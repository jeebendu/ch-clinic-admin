import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, FileText, Building2, DollarSign } from "lucide-react";
import { PageHeader } from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const statsData = [
  {
    title: "Total Appointments",
    value: "2,856",
    icon: <Calendar className="h-6 w-6 text-primary" />,
    change: "+12.5%",
    isPositive: true
  },
  {
    title: "Today's Appointments",
    value: "24",
    icon: <Clock className="h-6 w-6 text-primary" />,
    change: "+3.2%",
    isPositive: true
  },
  {
    title: "Registered Patients",
    value: "5,243",
    icon: <Users className="h-6 w-6 text-primary" />,
    change: "+8.7%",
    isPositive: true
  },
  {
    title: "Active Doctors",
    value: "42",
    icon: <FileText className="h-6 w-6 text-primary" />,
    change: "+2.4%",
    isPositive: true
  },
  {
    title: "Branches",
    value: "12",
    icon: <Building2 className="h-6 w-6 text-primary" />,
    change: "0%",
    isPositive: false
  },
  {
    title: "Revenue (Monthly)",
    value: "$128,450",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    change: "+15.3%",
    isPositive: true
  }
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Admin Dashboard" 
          description="Comprehensive overview of your clinic's performance"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="border border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
                  <div className="p-2 rounded-full bg-primary/10">{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription className="flex items-center mt-1">
                  <span className={`inline-flex items-center ${
                    stat.isPositive ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-1">since last month</span>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across your clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">New patient registered</p>
                      <p className="text-sm text-gray-500">John Smith completed registration</p>
                    </div>
                    <div className="text-sm text-gray-500">2h ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current health of your clinic management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">API Status</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">Database</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">Storage</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="font-medium">SMS Service</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-yellow-600">Degraded</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Backup System</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
