import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, FileText, Phone, MessageSquare } from "lucide-react";
import { PageHeader } from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const statsData = [
  {
    title: "Today's Appointments",
    value: "28",
    icon: <Calendar className="h-6 w-6 text-primary" />,
    change: "4 unconfirmed",
    isPositive: false
  },
  {
    title: "Wait Time",
    value: "12 min",
    icon: <Clock className="h-6 w-6 text-primary" />,
    change: "On target",
    isPositive: true
  },
  {
    title: "Check-ins Today",
    value: "18",
    icon: <Users className="h-6 w-6 text-primary" />,
    change: "10 remaining",
    isPositive: true
  },
  {
    title: "Messages",
    value: "6",
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    change: "Unread",
    isPositive: false
  }
];

const appointmentTasks = [
  { task: "Confirm upcoming appointments", status: "Pending", count: 4 },
  { task: "Process new patient registrations", status: "Pending", count: 3 },
  { task: "Update patient contact information", status: "Completed", count: 0 },
  { task: "Send appointment reminders", status: "Completed", count: 0 },
  { task: "Process insurance verification", status: "Pending", count: 7 }
];

const recentCalls = [
  { name: "Robert Johnson", time: "9:24 AM", status: "Missed", type: "Incoming" },
  { name: "Maria Garcia", time: "10:15 AM", status: "Completed", type: "Outgoing" },
  { name: "James Williams", time: "11:32 AM", status: "Completed", type: "Incoming" },
  { name: "Emily Brown", time: "1:05 PM", status: "Completed", type: "Outgoing" }
];

const StaffDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Staff Dashboard" 
          description="Reception and administrative overview"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    stat.isPositive ? 'text-green-500' : 'text-amber-500'
                  }`}>
                    {stat.change}
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tasks</CardTitle>
              <CardDescription>Administrative tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentTasks.map((task, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                      <span>{task.task}</span>
                    </div>
                    <div className="flex items-center">
                      {task.count > 0 && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {task.count}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Phone Calls</CardTitle>
              <CardDescription>Call history for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call, index) => (
                  <div key={index} className="flex items-center gap-4 pb-3 border-b last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{call.name}</p>
                        <span className="text-sm">{call.time}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">{call.type}</p>
                        <span className={`text-xs font-medium ${
                          call.status === 'Missed' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {call.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StaffDashboard;
