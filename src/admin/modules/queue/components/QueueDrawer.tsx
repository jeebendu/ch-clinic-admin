
import React, { useState } from 'react';
import { X, Phone, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useQueueData } from '@/hooks/useQueueData';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format date for API (YYYY-MM-DD)
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Fetch queue data when drawer is open
  const { data: queueData = [], isLoading, error } = useQueueData({
    date: formattedDate,
    enabled: isOpen
  });

  const handleCallPatient = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const setToday = () => {
    setSelectedDate(new Date());
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'waiting':
      case 'upcoming': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
      case 'checked_in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Queue Management</h2>
              <p className="text-sm text-gray-500">Today's appointments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Filter */}
          <div className="border-b p-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                onClick={setToday}
                className="px-3"
              >
                Today
              </Button>
            </div>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">Loading queue...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-red-500">Error loading queue</div>
              </div>
            ) : queueData.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No appointments for this date</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full px-4">
                <div className="space-y-3 py-4">
                  {queueData.map((appointment: any, index: number) => {
                    const patient = appointment.patient;
                    const doctor = appointment.doctor;
                    const branch = appointment.branch;
                    
                    return (
                      <div
                        key={appointment.id || index}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                      >
                        {/* Patient Info */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {patient?.firstname && patient?.lastname 
                                  ? `${patient.firstname} ${patient.lastname}`
                                  : patient?.name || 'Unknown Patient'
                                }
                              </h3>
                              <div className="mt-1 space-y-1 text-sm text-gray-600">
                                {patient?.age && patient?.gender && (
                                  <p>{patient.age} years • {patient.gender}</p>
                                )}
                                {patient?.user?.phone && (
                                  <div className="flex items-center gap-2">
                                    <span>{patient.user.phone}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCallPatient(patient.user.phone)}
                                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                    >
                                      <Phone className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(appointment.checkInStatus || appointment.status)}
                            >
                              {formatStatus(appointment.checkInStatus || appointment.status)}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        {/* Appointment Details */}
                        <div className="space-y-2 text-sm">
                          {appointment.slot?.startTime && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.slot.startTime}</span>
                              {appointment.slot.endTime && (
                                <span>- {appointment.slot.endTime}</span>
                              )}
                            </div>
                          )}
                          
                          {doctor && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>
                                Dr. {doctor.firstname} {doctor.lastname}
                                {doctor.qualification && ` (${doctor.qualification})`}
                              </span>
                            </div>
                          )}
                          
                          {branch?.name && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{branch.name}</span>
                            </div>
                          )}

                          {appointment.consultationFee && (
                            <div className="text-gray-600">
                              <span className="font-medium">Fee: ₹{appointment.consultationFee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
