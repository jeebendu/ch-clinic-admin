
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Calendar as CalendarIcon, Phone, Clock, User } from 'lucide-react';
import { useQueueData } from '@/hooks/useQueueData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { data: queueData, isLoading, error } = useQueueData({
    date: format(selectedDate, 'yyyy-MM-dd'),
    enabled: isOpen
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
    }
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    setIsDatePickerOpen(false);
  };

  const handleCallPatient = (mobile?: string) => {
    if (mobile) {
      window.open(`tel:${mobile}`, '_self');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_consultation':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPatientInfo = (age?: number, gender?: string) => {
    if (!age && !gender) return '';
    const ageStr = age ? age.toString() : '';
    const genderStr = gender ? gender.charAt(0).toUpperCase() : '';
    return `${ageStr}${genderStr ? ' ' + genderStr : ''}`;
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">Patient Queue</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2 mt-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={handleTodayClick}>
              Today
            </Button>
          </div>
          
          {queueData && (
            <div className="text-sm text-muted-foreground mt-2">
              Total patients: {queueData.total_count}
            </div>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading queue...</div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-red-500">Error loading queue data</div>
                </div>
              )}

              {queueData?.queue_items?.length === 0 && !isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">No patients in queue for this date</div>
                </div>
              )}

              {queueData?.queue_items?.map((item) => (
                <div
                  key={item.patient_schedule_id}
                  className="bg-card border rounded-lg p-4 space-y-3"
                >
                  {/* Header with sequence and status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                        {item.actual_sequence}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.waiting_minutes}min wait
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.patient_name}</span>
                      {formatPatientInfo(item.patient_age, item.patient_gender) && (
                        <span className="text-muted-foreground">
                          ({formatPatientInfo(item.patient_age, item.patient_gender)})
                        </span>
                      )}
                    </div>

                    {item.patient_mobile && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <button
                          onClick={() => handleCallPatient(item.patient_mobile)}
                          className="text-primary hover:underline"
                        >
                          {item.patient_mobile}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Check-in: {new Date(item.checkin_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Estimated: {new Date(item.estimated_consultation_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QueueDrawer;
