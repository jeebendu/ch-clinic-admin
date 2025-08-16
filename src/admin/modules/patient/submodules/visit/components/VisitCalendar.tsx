
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

interface VisitCalendarProps {
  visits: any[];
  onVisitClick?: (visit: any) => void;
}

const VisitCalendar: React.FC<VisitCalendarProps> = ({ visits, onVisitClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getVisitsForDay = (day: Date) => {
    return visits.filter(visit => {
      try {
        const visitDate = typeof visit.visitDate === 'string' 
          ? parseISO(visit.visitDate) 
          : new Date(visit.visitDate);
        return isSameDay(visitDate, day);
      } catch {
        return false;
      }
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map(day => {
          const dayVisits = getVisitsForDay(day);
          const visibleVisits = dayVisits.slice(0, 3);
          const remainingCount = dayVisits.length - 3;

          return (
            <div
              key={day.toISOString()}
              className="min-h-24 border border-gray-100 p-1 hover:bg-gray-50"
            >
              <div className="text-sm font-medium text-gray-900 mb-1">
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {visibleVisits.map((visit, index) => (
                  <div
                    key={`${visit.id}-${index}`}
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(visit.status)}`}
                    onClick={() => onVisitClick?.(visit)}
                    title={`${visit.patientName} - ${visit.reasonForVisit}`}
                  >
                    <div className="truncate font-medium">
                      {visit.patientName || 'Unknown'}
                    </div>
                  </div>
                ))}
                
                {remainingCount > 0 && (
                  <div className="text-xs text-gray-500 p-1">
                    +{remainingCount} more
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

export default VisitCalendar;
