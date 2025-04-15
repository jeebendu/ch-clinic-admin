import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Appointment } from '../types/Appointment';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  appointments,
  onAppointmentClick
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = startDate.getDay();
  
  // Calculate days from previous month to fill the calendar
  const prevMonthDays = firstDayOfMonth;
  const prevMonth = subMonths(currentMonth, 1);
  const prevMonthEndDate = endOfMonth(prevMonth);
  const prevMonthDateRange = Array.from({ length: prevMonthDays }, (_, i) => 
    new Date(prevMonthEndDate.getFullYear(), prevMonthEndDate.getMonth(), prevMonthEndDate.getDate() - (prevMonthDays - 1) + i)
  );
  
  // Calculate days from next month to fill the calendar
  const totalDaysDisplayed = Math.ceil((dateRange.length + prevMonthDays) / 7) * 7;
  const nextMonthDays = totalDaysDisplayed - (dateRange.length + prevMonthDays);
  const nextMonth = addMonths(currentMonth, 1);
  const nextMonthDateRange = Array.from({ length: nextMonthDays }, (_, i) => 
    new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1)
  );
  
  // Combine all dates
  const allDates = [...prevMonthDateRange, ...dateRange, ...nextMonthDateRange];
  
  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  appointments.forEach(appointment => {
    const dateKey = format(appointment.slot.date, 'yyyy-MM-dd');
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(appointment);
  });
  
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return appointmentsByDate[dateKey] || [];
  };
  
  const today = new Date();
  
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="calendar-header border-b border-gray-200">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPreviousMonth}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextMonth}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="calendar-days">
        {days.map(day => (
          <div key={day} className="calendar-day">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-dates">
        {allDates.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, today);
          const dateAppointments = getAppointmentsForDate(date);
          
          return (
            <div 
              key={index} 
              className={cn(
                "calendar-date", 
                !isCurrentMonth && "other-month",
                isToday && "today"
              )}
            >
              <div className="calendar-date-number">
                {format(date, 'd')}
              </div>
              
              <div>
                {dateAppointments.slice(0, 3).map(appointment => (
                  <div 
                    key={appointment.id}
                    className={cn(
                      "calendar-event", 
                      `event-${appointment.status}`
                    )}
                    onClick={() => onAppointmentClick(appointment)}
                  >
                      {appointment?.slot?.startTime ? format(new Date(`1970-01-01T${appointment?.slot?.startTime}`), "hh:mm a") : "Time not available"} - {appointment.patient.firstname} {appointment.patient.lastname}
                  </div>
                ))}
                
                {dateAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center mt-1">
                    +{dateAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
