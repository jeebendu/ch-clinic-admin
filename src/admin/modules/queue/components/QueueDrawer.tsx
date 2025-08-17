
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Phone, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueueService } from '../services/queueService';
import { Appointment } from '../../appointments/types/Appointment';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { data: queueData, isLoading, refetch } = useQueueService.useGetQueue({
    date: format(selectedDate, 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, selectedDate, refetch]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDatePickerOpen(false);
    }
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    setDatePickerOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatPatientDetails = (patient: any): string => {
    if (!patient) return '';
    
    const age = patient.dob ? calculateAge(patient.dob) : patient.age || '';
    const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';
    
    return `${age}${gender ? ` ${gender}` : ''}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-none">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Queue Management
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              onClick={handleTodayClick}
              className="px-4"
            >
              Today
            </Button>
          </div>

          {/* Queue List */}
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : queueData?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found for {format(selectedDate, 'PPP')}
              </div>
            ) : (
              queueData?.map((appointment: Appointment, index: number) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.patient?.firstname} {appointment.patient?.lastname}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatPatientDetails(appointment.patient)}
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(appointment.status)
                    )}>
                      {appointment.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <div className="font-medium">
                        {appointment.slot?.startTime || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Doctor:</span>
                      <div className="font-medium">
                        Dr. {appointment.doctorBranch?.doctor?.firstname} {appointment.doctorBranch?.doctor?.lastname}
                      </div>
                    </div>
                  </div>

                  {appointment.patient?.user?.phone && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`tel:${appointment.patient.user.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {appointment.patient.user.phone}
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
