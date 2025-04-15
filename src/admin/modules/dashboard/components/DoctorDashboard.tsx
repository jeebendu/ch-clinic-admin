
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, FileText, Stethoscope, CalendarClock } from "lucide-react";
import { PageHeader } from "@/admin/components/PageHeader";

const statsData = [
  {
    title: "Today's Appointments",
    value: "8",
    icon: <Calendar className="h-6 w-6 text-primary" />,
    change: "2 remaining",
    isPositive: true
  },
  {
    title: "This Week",
    value: "42",
    icon: <CalendarClock className="h-6 w-6 text-primary" />,
    change: "+5 from last week",
    isPositive: true
  },
  {
    title: "Total Patients",
    value: "1,248",
    icon: <Users className="h-6 w-6 text-primary" />,
    change: "+22 this month",
    isPositive: true
  },
  {
    title: "Avg. Consultation Time",
    value: "24 min",
    icon: <Clock className="h-6 w-6 text-primary" />,
    change: "-2 min since last month",
    isPositive: true
  }
];

const upcomingAppointments = [
  { 
    patientName: "Sarah Johnson", 
    time: "10:30 AM", 
    reason: "Dental Checkup",
    status: "Checked In"
  },
  { 
    patientName: "Michael Smith", 
    time: "11:15 AM", 
    reason: "Root Canal",
    status: "Scheduled"
  },
  { 
    patientName: "Emily Davis", 
    time: "1:00 PM", 
    reason: "Teeth Whitening",
    status: "Scheduled"
  },
  { 
    patientName: "Robert Wilson", 
    time: "2:30 PM", 
    reason: "Dental Implant Consultation",
    status: "Scheduled"
  },
  { 
    patientName: "Jennifer Brown", 
    time: "3:45 PM", 
    reason: "Wisdom Tooth Extraction",
    status: "Scheduled"
  }
];

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Doctor Dashboard" 
        description="Your daily schedule and patient information"
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
                  stat.isPositive ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{appointment.patientName}</p>
                      <span className="text-sm font-medium">{appointment.time}</span>
                    </div>
                    <p className="text-sm text-gray-500">{appointment.reason}</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Notes</CardTitle>
            <CardDescription>Latest updates from your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">David Martinez</h4>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Follow-up for root canal treatment. Patient reports reduced pain and swelling.</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-primary font-medium">View Full Record</div>
                    <div className="text-xs text-gray-500">12:45 PM</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
