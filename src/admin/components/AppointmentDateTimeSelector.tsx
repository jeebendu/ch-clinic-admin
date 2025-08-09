
import React, { useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

interface AppointmentDateTimeSelectorProps {
  onDateTimeSelect?: (date: Date, timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const AppointmentDateTimeSelector: React.FC<AppointmentDateTimeSelectorProps> = ({
  onDateTimeSelect,
  selectedDate,
  selectedTime
}) => {
  const [selected, setSelected] = useState<Date>(selectedDate || new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>(selectedTime || "");

  // Generate 7 days from today
  const generateDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  // Mock time slots - in real app, this would come from API
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const baseSlots = [
      { time: "09:00 AM", period: 'morning' as const },
      { time: "09:30 AM", period: 'morning' as const },
      { time: "10:00 AM", period: 'morning' as const },
      { time: "10:30 AM", period: 'morning' as const },
      { time: "11:00 AM", period: 'morning' as const },
      { time: "11:30 AM", period: 'morning' as const },
      { time: "02:00 PM", period: 'afternoon' as const },
      { time: "02:30 PM", period: 'afternoon' as const },
      { time: "03:00 PM", period: 'afternoon' as const },
      { time: "03:30 PM", period: 'afternoon' as const },
      { time: "04:00 PM", period: 'afternoon' as const },
      { time: "04:30 PM", period: 'afternoon' as const },
      { time: "06:00 PM", period: 'evening' as const },
      { time: "06:30 PM", period: 'evening' as const },
      { time: "07:00 PM", period: 'evening' as const },
      { time: "07:30 PM", period: 'evening' as const },
    ];

    return baseSlots.map((slot, index) => ({
      id: `${format(date, 'yyyy-MM-dd')}-${index}`,
      time: slot.time,
      available: Math.random() > 0.3, // Random availability for demo
      period: slot.period
    }));
  };

  const days = generateDays();
  const timeSlots = generateTimeSlots(selected);

  const handleDateSelect = (date: Date) => {
    setSelected(date);
    setSelectedSlot(""); // Clear selected time when date changes
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot.time);
    onDateTimeSelect?.(selected, slot);
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'morning': return 'Morning';
      case 'afternoon': return 'Afternoon';
      case 'evening': return 'Evening';
      default: return period;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          Select Appointment Date & Time
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Date Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Choose Date</h3>
          <div className="grid grid-cols-7 gap-3">
            {days.map((day, index) => {
              const isSelected = isSameDay(day, selected);
              const isToday = isSameDay(day, new Date());
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "flex flex-col h-20 p-3 border-2 transition-all duration-200",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                      : "hover:border-primary/50 hover:bg-primary/5 hover:scale-102",
                    isToday && !isSelected && "border-primary/30 bg-primary/5"
                  )}
                >
                  <span className="text-xs font-medium opacity-80">
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-lg font-bold">
                    {format(day, 'd')}
                  </span>
                  <span className="text-xs opacity-70">
                    {format(day, 'MMM')}
                  </span>
                  {isToday && (
                    <Badge variant="secondary" className="mt-1 text-xs px-1 py-0">
                      Today
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">
            Available Slots for {format(selected, 'EEEE, MMMM d')}
          </h3>
          
          <div className="space-y-6">
            {Object.entries(groupedSlots).map(([period, slots]) => (
              <div key={period} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-600">
                    {getPeriodLabel(period)}
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                  {slots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={!slot.available}
                      className={cn(
                        "h-12 text-sm font-medium transition-all duration-200",
                        selectedSlot === slot.time
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : slot.available
                          ? "hover:border-primary/50 hover:bg-primary/5 hover:scale-102"
                          : "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400",
                        !slot.available && "line-through"
                      )}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                
                {slots.every(slot => !slot.available) && (
                  <p className="text-sm text-gray-500 italic text-center py-4">
                    No slots available for {getPeriodLabel(period).toLowerCase()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Summary */}
        {selectedSlot && (
          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Selected Appointment</p>
                <p className="text-lg font-semibold text-primary">
                  {format(selected, 'EEEE, MMMM d, yyyy')} at {selectedSlot}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
