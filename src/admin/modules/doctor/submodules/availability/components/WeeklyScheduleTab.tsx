
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, Eye, EyeOff, Save } from "lucide-react";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { DoctorAvailability } from "../../../types/DoctorAvailability";
import { toast } from "sonner";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

interface SlotPreview {
  dayOfWeek: string;
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [slotPreviews, setSlotPreviews] = useState<SlotPreview[]>([]);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];

  const dayLabels: Record<string, string> = {
    'MONDAY': 'Monday',
    'TUESDAY': 'Tuesday', 
    'WEDNESDAY': 'Wednesday',
    'THURSDAY': 'Thursday',
    'FRIDAY': 'Friday',
    'SATURDAY': 'Saturday',
    'SUNDAY': 'Sunday'
  };

  // Generate slot previews based on current availability
  const generateSlotPreviews = () => {
    setLoading(true);
    const previews: SlotPreview[] = [];
    const today = new Date();
    
    // Generate previews for next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]; // Adjust for Sunday = 0
      
      const availability = doctorBranch.doctorAvailabilities?.find(
        (av: DoctorAvailability) => av.dayOfWeek === dayOfWeek && av.active
      );

      const slots: { startTime: string; endTime: string; available: boolean; }[] = [];
      
      if (availability) {
        const startTime = new Date(`2000-01-01T${availability.startTime}`);
        const endTime = new Date(`2000-01-01T${availability.endTime}`);
        const slotDuration = availability.slotDuration || 15; // Default 15 minutes
        
        const current = new Date(startTime);
        while (current < endTime) {
          const slotEnd = new Date(current.getTime() + slotDuration * 60000);
          if (slotEnd <= endTime) {
            slots.push({
              startTime: current.toTimeString().slice(0, 5),
              endTime: slotEnd.toTimeString().slice(0, 5),
              available: true
            });
          }
          current.setTime(current.getTime() + slotDuration * 60000);
        }
      }

      previews.push({
        dayOfWeek: dayLabels[dayOfWeek] || dayOfWeek,
        date: currentDate.toDateString(),
        slots
      });
    }
    
    setSlotPreviews(previews);
    setLoading(false);
  };

  useEffect(() => {
    if (showPreview) {
      generateSlotPreviews();
    }
  }, [showPreview, doctorBranch.doctorAvailabilities]);

  const handleSaveAvailability = async () => {
    try {
      // TODO: Implement save functionality
      toast.success("Availability settings saved successfully");
    } catch (error) {
      toast.error("Failed to save availability settings");
    }
  };

  const handleReleaseSlots = async () => {
    try {
      // TODO: Implement slot release functionality
      toast.success("Slots released successfully");
    } catch (error) {
      toast.error("Failed to release slots");
    }
  };

  const getAvailabilityForDay = (day: string): DoctorAvailability | undefined => {
    return doctorBranch.doctorAvailabilities?.find(
      (av: DoctorAvailability) => av.dayOfWeek === day
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {daysOfWeek.map((day) => {
              const availability = getAvailabilityForDay(day);
              return (
                <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-20 font-medium text-sm">
                      {dayLabels[day]}
                    </div>
                    {availability && availability.active ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({availability.slotDuration || 15} min slots)
                        </span>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveAvailability} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Preview Slots'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slot Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Slot Preview (Next 7 Days)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Preview how slots will be generated based on current availability settings
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Generating preview...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {slotPreviews.map((preview, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{preview.dayOfWeek}</h4>
                        <p className="text-sm text-muted-foreground">{preview.date}</p>
                      </div>
                      <Badge variant="outline">
                        {preview.slots.length} slots
                      </Badge>
                    </div>
                    
                    {preview.slots.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                        {preview.slots.map((slot, slotIndex) => (
                          <div 
                            key={slotIndex}
                            className="text-xs p-2 bg-green-50 border border-green-200 rounded text-center text-green-700"
                          >
                            {slot.startTime}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No slots available</p>
                      </div>
                    )}
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleReleaseSlots} className="bg-green-600 hover:bg-green-700">
                    Release All Slots
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyScheduleTab;
