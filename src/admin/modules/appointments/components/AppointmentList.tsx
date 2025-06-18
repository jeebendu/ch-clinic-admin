
import React, { useEffect, useRef, useState } from 'react';
import { Appointment } from '../types/Appointment';
import { Loader2, Bell } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import AppointmentCardSkeleton from '@/admin/components/skeletons/AppointmentCardSkeleton';

interface InfiniteAppointmentListProps {
  appointments: Appointment[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onStartAppointment: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
  onProcess?: (appointment: Appointment) => void;
  onPatientClick?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<InfiniteAppointmentListProps> = ({
  appointments,
  loading,
  hasMore,
  loadMore,
  onAppointmentClick,
  onStartAppointment,
  onEditAppointment,
  onPayment,
  onProcess,
  onPatientClick
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [visibleAppointments, setVisibleAppointments] = useState<Appointment[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appointments.length > 0) {
      setVisibleAppointments(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(appointments)) {
          return appointments;
        }
        return prev;
      });
    }
  }, [appointments]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin: '100px' });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  const handlePayment = (appointment: Appointment) => {
    console.log('Payment for appointment:', appointment.id);
    onPayment?.(appointment);
  };

  const handleProcess = (appointment: Appointment) => {
    console.log('Process appointment:', appointment.id);
    onProcess?.(appointment);
  };

  if (!appointments.length && !loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments found</h3>
        <p className="text-gray-500">No appointments match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6" ref={listContainerRef}>
      {/* Horizontal card layout with highlighting */}
      <div className="space-y-3">
        {loading && appointments.length === 0 ? (
          Array.from({ length: 5 }).map((_, index) => (
            <AppointmentCardSkeleton key={index} />
          ))
        ) : (
          visibleAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onView={onAppointmentClick}
              onEdit={onEditAppointment || onAppointmentClick}
              onStart={onStartAppointment}
              onPayment={handlePayment}
              onProcess={handleProcess}
              onPatientClick={onPatientClick}
            />
          ))
        )}
      </div>
      
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

export default AppointmentList;
