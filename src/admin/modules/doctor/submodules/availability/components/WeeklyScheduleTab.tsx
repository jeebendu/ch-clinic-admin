
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { DoctorAvailability, TimeRange } from "../types/DoctorAvailability";
import { availabilityService } from "../services/availabilityService";
import TimeRangeRow from "./TimeRangeRow";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const RELEASE_TYPES = [
  { value: "TIMEWISE", label: "Time-wise Slots" },
  { value: "COUNTWISE", label: "Count-wise Slots" }
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewWeek, setPreviewWeek] = useState(0); // 0 = current week, 1 = next week, etc.

  useEffect(() => {
    fetchAvailabilities();
  }, [doctorBranch?.id]);

  const fetchAvailabilities = async () => {
    if (!doctorBranch?.id) return;
    
    setLoading(true);
    try {
      const response = await availabilityService.findAllByDoctorBranchId(doctorBranch.id);
      const data = response.data || [];
      
      // Initialize with default availability for each day if not exists
      const initializedData = DAYS_OF_WEEK.map(day => {
        const existing = data.find((avail: DoctorAvailability) => avail.dayOfWeek === day);
        return existing || {
          id: 0,
          dayOfWeek: day,
          active: false,
          timeRanges: [],
          doctorBranch,
          releaseType: "TIMEWISE",
          releaseBefore: 1,
          releaseTime: "09:00"
        };
      });
      
      setAvailabilities(initializedData);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      toast.error("Failed to load weekly schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDayActiveToggle = (dayOfWeek: string, active: boolean) => {
    setAvailabilities(prev =>
      prev.map(avail =>
        avail.dayOfWeek === dayOfWeek ? { ...avail, active } : avail
      )
    );
  };

  const handleReleaseTypeChange = (dayOfWeek: string, releaseType: string) => {
    setAvailabilities(prev =>
      prev.map(avail =>
        avail.dayOfWeek === dayOfWeek ? { ...avail, releaseType } : avail
      )
    );
  };

  const addTimeRange = (dayOfWeek: string) => {
    const newTimeRange: TimeRange = {
      id: Date.now(),
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 15,
      slotQuantity: 1
    };

    setAvailabilities(prev =>
      prev.map(avail =>
        avail.dayOfWeek === dayOfWeek
          ? { ...avail, timeRanges: [...avail.timeRanges, newTimeRange] }
          : avail
      )
    );
  };

  const updateTimeRange = (dayOfWeek: string, id: number, updates: Partial<TimeRange>) => {
    setAvailabilities(prev =>
      prev.map(avail =>
        avail.dayOfWeek === dayOfWeek
          ? {
              ...avail,
              timeRanges: avail.timeRanges.map(tr =>
                tr.id === id ? { ...tr, ...updates } : tr
              )
            }
          : avail
      )
    );
  };

  const deleteTimeRange = (dayOfWeek: string, id: number) => {
    setAvailabilities(prev =>
      prev.map(avail =>
        avail.dayOfWeek === dayOfWeek
          ? { ...avail, timeRanges: avail.timeRanges.filter(tr => tr.id !== id) }
          : avail
      )
    );
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "0min";
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) return "0min";
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const calculateTotalSlots = (timeRange: TimeRange, releaseType: string): number => {
    if (!timeRange.startTime || !timeRange.endTime) return 0;
    
    const start = new Date(`2000-01-01T${timeRange.startTime}:00`);
    const end = new Date(`2000-01-01T${timeRange.endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return 0;
    
    if (releaseType === "TIMEWISE") {
      return Math.floor(diffMins / timeRange.slotDuration);
    } else {
      const hours = Math.ceil(diffMins / 60);
      return hours * timeRange.slotQuantity;
    }
  };

  const generateSlotPreview = () => {
    const previewData: { [key: string]: string[] } = {};
    
    availabilities.forEach(avail => {
      if (!avail.active || avail.timeRanges.length === 0) {
        previewData[avail.dayOfWeek] = [];
        return;
      }
      
      const slots: string[] = [];
      
      avail.timeRanges.forEach(timeRange => {
        if (avail.releaseType === "TIMEWISE") {
          const start = new Date(`2000-01-01T${timeRange.startTime}:00`);
          const end = new Date(`2000-01-01T${timeRange.endTime}:00`);
          let current = new Date(start);
          
          while (current < end) {
            const next = new Date(current.getTime() + timeRange.slotDuration * 60000);
            if (next <= end) {
              slots.push(
                `${current.toTimeString().slice(0, 5)} - ${next.toTimeString().slice(0, 5)}`
              );
            }
            current = next;
          }
        } else {
          const start = new Date(`2000-01-01T${timeRange.startTime}:00`);
          const end = new Date(`2000-01-01T${timeRange.endTime}:00`);
          const diffMs = end.getTime() - start.getTime();
          const diffMins = Math.floor(diffMs / (1000 * 60));
          const hours = Math.ceil(diffMins / 60);
          
          for (let i = 0; i < hours; i++) {
            const hourStart = new Date(start.getTime() + i * 60 * 60000);
            const hourEnd = new Date(hourStart.getTime() + 60 * 60000);
            
            for (let j = 0; j < timeRange.slotQuantity; j++) {
              slots.push(
                `${hourStart.toTimeString().slice(0, 5)} - ${Math.min(hourEnd.getTime(), end.getTime()) === hourEnd.getTime() ? hourEnd.toTimeString().slice(0, 5) : end.toTimeString().slice(0, 5)} (${j + 1})`
              );
            }
          }
        }
      });
      
      previewData[avail.dayOfWeek] = slots;
    });
    
    return previewData;
  };

  const getPreviewWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (previewWeek * 7)); // Start from Monday
    
    return DAYS_OF_WEEK.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await availabilityService.saveSchedule(availabilities, doctorBranch.id);
      toast.success("Weekly schedule saved successfully");
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading weekly schedule...</p>
        </div>
      </div>
    );
  }

  const slotPreview = generateSlotPreview();
  const previewDates = getPreviewWeekDates();

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Weekly Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Set up doctor's availability for each day of the week
              </p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {saving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>

          {/* Days Configuration */}
          <div className="space-y-4">
            {availabilities.map((availability) => (
              <Card key={availability.dayOfWeek} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={availability.active}
                        onCheckedChange={(checked) => 
                          handleDayActiveToggle(availability.dayOfWeek, checked)
                        }
                      />
                      <CardTitle className="text-base font-medium">
                        {availability.dayOfWeek.charAt(0) + availability.dayOfWeek.slice(1).toLowerCase()}
                      </CardTitle>
                    </div>
                    
                    {availability.active && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Release Type:</Label>
                          <Select
                            value={availability.releaseType}
                            onValueChange={(value) => 
                              handleReleaseTypeChange(availability.dayOfWeek, value)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {RELEASE_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeRange(availability.dayOfWeek)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Time Range
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {availability.active && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {availability.timeRanges.map((timeRange) => (
                        <TimeRangeRow
                          key={timeRange.id}
                          timeRange={timeRange}
                          onUpdate={(id, updates) => 
                            updateTimeRange(availability.dayOfWeek, id, updates)
                          }
                          onDelete={(id) => 
                            deleteTimeRange(availability.dayOfWeek, id)
                          }
                          canDelete={availability.timeRanges.length > 1}
                          releaseType={availability.releaseType}
                          duration={calculateDuration(timeRange.startTime, timeRange.endTime)}
                          totalSlots={calculateTotalSlots(timeRange, availability.releaseType)}
                          allTimeRanges={availability.timeRanges}
                        />
                      ))}

                      {availability.timeRanges.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <p>No time ranges configured</p>
                          <p className="text-xs">Click "Add Time Range" to get started</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Slot Preview Sidebar */}
      <div className="w-80">
        <Card className="h-fit sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <CardTitle className="text-base">Slot Preview</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewWeek(Math.max(0, previewWeek - 1))}
                  disabled={previewWeek === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs px-2">
                  Week {previewWeek + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewWeek(previewWeek + 1)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day, index) => {
                  const slots = slotPreview[day] || [];
                  const date = previewDates[index];
                  const isActive = availabilities.find(a => a.dayOfWeek === day)?.active;
                  
                  return (
                    <div key={day} className="border-b border-border/50 pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      {!isActive ? (
                        <p className="text-xs text-muted-foreground italic">Not available</p>
                      ) : slots.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No slots configured</p>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">
                              {slots.length} slot{slots.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="grid gap-1">
                            {slots.slice(0, 3).map((slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border"
                              >
                                {slot}
                              </div>
                            ))}
                            {slots.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{slots.length - 3} more slots
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
