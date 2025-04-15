
import React, { useEffect, useRef, useState } from 'react';
import { AllAppointment } from '../../../types/allappointment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2, Video, MapPin, Bell, ClipboardList, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface InfiniteAppointmentListProps {
  appointments: AllAppointment[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onAppointmentClick: (appointment: AllAppointment) => void;
  onStartAppointment: (appointment: AllAppointment) => void;
}

const InfiniteAppointmentList: React.FC<InfiniteAppointmentListProps> = ({
  appointments,
  loading,
  hasMore,
  loadMore,
  onAppointmentClick,
  onStartAppointment
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [visibleAppointments, setVisibleAppointments] = useState<AllAppointment[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    if (loading) return;

    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin: '100px' });

    // Observe the load more element
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  if (!appointments.length && !loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments found</h3>
        <p className="text-gray-500">No upcoming appointments match your current filters.</p>
      </div>
    );
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video-call':
        return <Video className="w-4 h-4 mr-1.5" />;
      default:
        return null;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {visibleAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4 hover:border-gray-300 transition-all cursor-pointer"
          onClick={() => onAppointmentClick(appointment)}
        >
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-14 w-14 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0">
                {appointment.patient.firstname && (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-lg font-semibold">
                    {appointment.patient?.firstname?.charAt(0)}
                    {appointment.patient?.lastname?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-lg truncate">
                    {appointment.patient.firstname} {appointment.patient.lastname}
                  </h3>
                  <Badge variant="outline" className={cn("rounded-full", getStatusBadgeStyle(appointment.status.toString()))}>
                    {appointment.status.toString().charAt(0).toUpperCase() + appointment.status.toString().slice(1).toLowerCase()}
                  </Badge>
                </div>
                
                <div className="text-gray-500 flex items-center text-sm mb-1">
                  <span>
                    #{appointment.id} · {appointment?.doctorClinic?.doctor?.firstname} {appointment?.doctorClinic?.doctor?.lastname}
                  </span>
                </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{appointment?.patient.city},{appointment?.patient?.district? appointment?.patient?.district?.name:""},{appointment?.patient?.state ? appointment?.patient?.state?.name:""}</span>
                  </div>

              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-end gap-2">
              <div className="flex flex-col items-end gap-1">
                <div className="text-sm text-gray-500">
                  {appointment.slot?.date 
                    ? format(new Date(appointment.slot.date), "EEE, MMM d, yyyy") 
                    : "Date not available"}
                </div>
                <div className="font-medium">
                  {appointment?.slot?.startTime 
                   ? format(new Date(`1970-01-01T${appointment?.slot?.startTime}`), "hh:mm a") 
                    : "Time not available"}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <Link 
                  to={`/admin/appointments/process/${appointment.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Process</span>
                </Link>
                
                {(appointment.status.toString().toLowerCase() === 'upcoming') && (
                  <Link 
                    to={`/admin/appointments/process/${appointment.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartAppointment(appointment);
                    }}
                  >
                    <Button 
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90 rounded-full h-8 flex items-center gap-1"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Start</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {(loading || hasMore) && (
        <div 
          ref={loadMoreRef} 
          className="flex justify-center items-center py-4"
        >
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              <span className="text-gray-500">Loading more appointments...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteAppointmentList;
