
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Calendar, Clock, Mail, MapPin, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appointment, AppointmentStatus, AppointmentType } from '../types/appointment';

interface AppointmentSidebarProps {
  onClose: () => void;
  appointments: Appointment[];
}

const AppointmentSidebar = ({ onClose, appointments }: AppointmentSidebarProps) => {
  const getAppointmentTypeLabel = (type?: AppointmentType) => {
    if (!type) return "Visit";
    switch (type) {
      case "direct-visit": return "Direct Visit";
      case "video-call": return "Video Call";
      case "audio-call": return "Audio Call";
      default: return type;
    }
  };

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "new": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "dd MMM yyyy");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium text-lg">Upcoming Appointments</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center p-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments</h3>
              <p className="text-gray-500">You don't have any upcoming appointments.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusBadgeStyle(appointment.status as AppointmentStatus)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        {getAppointmentTypeLabel(appointment.appointmentType)}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium text-base">{appointment.patient.firstname} {appointment.patient.lastname}</h4>
                    <p className="text-gray-500 text-sm">#{appointment.id}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-amber-600 font-medium">₹ 200</span>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {appointment.slot?.date ? format(new Date(appointment.slot.date), "dd MMM yyyy") : formatDate(appointment.appointmentDate)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {appointment.slot?.startTime ? format(new Date(`1970-01-01T${appointment.slot.startTime}`), "hh:mm a") : "Time not available"}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {appointment.patient.user?.email || "No email available"}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {appointment.patient.user?.phone || "No phone available"}
                  </div>
                  {appointment.patient.address && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{appointment.patient.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <Button size="sm" variant="outline" className="rounded-full h-8">
                    View
                  </Button>
                  <Button size="sm" className="rounded-full h-8 bg-primary hover:bg-primary/90">
                    Start
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentSidebar;
