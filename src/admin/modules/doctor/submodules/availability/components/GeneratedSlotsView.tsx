import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { format, addDays } from "date-fns";
import { WeeklyScheduleService } from "../services/WeeklyScheduleService";
import { Slot } from "@/admin/modules/appointments/types/Slot";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { toast } from "sonner";

interface GeneratedSlotsViewProps {
  doctorBranch: DoctorBranch;
}

interface GroupedSlots {
  [date: string]: Slot[];
}

const GeneratedSlotsView: React.FC<GeneratedSlotsViewProps> = ({ doctorBranch }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [groupedSlots, setGroupedSlots] = useState<GroupedSlots>({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (doctorBranch?.id) {
      fetchSlots(selectedDate);
    }
  }, [doctorBranch?.id, selectedDate]);

  const fetchSlots = async (date: Date) => {
    if (!doctorBranch?.id) return;

    setLoading(true);
    try {
      // Pass the selected date to the service
      const fetchedSlots = await WeeklyScheduleService.getSlotsByDoctorBranch(doctorBranch.id, date);
      setSlots(fetchedSlots);
      groupSlotsByDate(fetchedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: GroupedSlots = {};
    
    slots.forEach(slot => {
      if (slot.date) {
        const dateKey = format(new Date(slot.date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(slot);
      }
    });

    // Sort slots within each date by start time
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      });
    });

    setGroupedSlots(grouped);
  };

  const handleGenerateSlots = async () => {
    if (!doctorBranch?.id) return;

    setGenerating(true);
    try {
      await WeeklyScheduleService.generatePreviewSlots(doctorBranch.id);
      toast.success("Preview slots generated successfully");
      await fetchSlots(selectedDate); // Refresh the slots
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error("Failed to generate preview slots");
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    try {
      return format(new Date(`1970-01-01T${timeString}`), 'hh:mm a');
    } catch {
      return timeString;
    }
  };

  // Generate next 7 days starting from today
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // This will trigger the useEffect to fetch slots for the selected date
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading generated slots...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Generated Slots Preview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Future slots generated based on weekly schedule
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchSlots(selectedDate)}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateSlots}
              disabled={generating}
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Generate Preview
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next 7 Days Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getNext7Days().map((date, index) => (
            <Button
              key={index}
              variant={format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0"
              onClick={() => handleDateClick(date)}
            >
              <div className="text-center">
                <div className="text-xs">{format(date, 'EEE')}</div>
                <div className="text-sm font-medium">{format(date, 'MMM d')}</div>
              </div>
            </Button>
          ))}
        </div>

        {Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No slots generated yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Generate Preview" to create slots based on weekly schedule
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSlots)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateKey, dateSlots]) => (
                <div key={dateKey} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">
                      {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Badge variant="outline">
                      {dateSlots.length} slot{dateSlots.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {dateSlots.map((slot, index) => (
                      <div
                        key={slot.id || index}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {formatTime(slot.startTime || '')}
                            {slot.endTime && ` - ${formatTime(slot.endTime)}`}
                          </span>
                          {slot.status && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getStatusColor(slot.status)}`}
                            >
                              {slot.status}
                            </Badge>
                          )}
                        </div>
                        
                        {slot.slotType && (
                          <div className="text-xs text-muted-foreground mb-1">
                            Type: {slot.slotType}
                          </div>
                        )}
                        
                        {slot.availableSlots !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            Available: {slot.availableSlots}
                            {slot.slotType === 'COUNTWISE' ? ' slots' : ''}
                          </div>
                        )}
                        
                        {slot.duration && (
                          <div className="text-xs text-muted-foreground">
                            Duration: {slot.duration} min
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedSlotsView;
