import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Calendar, Save, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DoctorAvailability, TimeRange, DoctorLeave } from "../types/DoctorAvailability";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import TimeRangeForm from "./TimeRangeForm";
import LeavesSection from "./LeavesSection";
import SlotReleaseRules from "./SlotReleaseRules";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
  availability: DoctorAvailability[];
  onSave: (availabilities: DoctorAvailability[]) => void;
  className?: string;
}

const WEEKDAYS = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({
  doctorBranch,
  availability,
  onSave,
  className
}) => {
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, DoctorAvailability>>({});
  const [editingTimeRange, setEditingTimeRange] = useState<{
    dayOfWeek: string;
    timeRange?: TimeRange;
    index?: number;
  } | null>(null);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);

  useEffect(() => {
    const availabilityMap: Record<string, DoctorAvailability> = {};
    
    WEEKDAYS.forEach(day => {
      const dayAvailability = availability.find(a => a.dayOfWeek === day);
      if (dayAvailability) {
        availabilityMap[day] = dayAvailability;
      } else {
        availabilityMap[day] = {
          id: 0,
          dayOfWeek: day,
          active: false,
          timeRanges: [],
          doctorBranch,
          releaseType: 'AUTO',
          releaseBefore: 1,
          releaseTime: '06:00:00'
        };
      }
    });
    
    setWeeklyAvailability(availabilityMap);
  }, [availability, doctorBranch]);

  const handleDayToggle = (dayOfWeek: string, active: boolean) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        active,
        timeRanges: active ? prev[dayOfWeek].timeRanges : []
      }
    }));
  };

  const handleAddTimeRange = (dayOfWeek: string) => {
    setEditingTimeRange({ dayOfWeek });
  };

  const handleEditTimeRange = (dayOfWeek: string, index: number) => {
    const timeRange = weeklyAvailability[dayOfWeek].timeRanges[index];
    setEditingTimeRange({ dayOfWeek, timeRange, index });
  };

  const handleDeleteTimeRange = (dayOfWeek: string, index: number) => {
    setWeeklyAvailability(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        timeRanges: prev[dayOfWeek].timeRanges.filter((_, i) => i !== index)
      }
    }));
  };

  const handleTimeRangeSubmit = (timeRange: TimeRange) => {
    if (!editingTimeRange) return;
    
    const { dayOfWeek, index } = editingTimeRange;
    
    setWeeklyAvailability(prev => {
      const dayAvailability = prev[dayOfWeek];
      const updatedTimeRanges = [...dayAvailability.timeRanges];
      
      if (index !== undefined) {
        updatedTimeRanges[index] = timeRange;
      } else {
        updatedTimeRanges.push(timeRange);
      }
      
      return {
        ...prev,
        [dayOfWeek]: {
          ...dayAvailability,
          timeRanges: updatedTimeRanges
        }
      };
    });
    
    setEditingTimeRange(null);
  };

  const handleSave = () => {
    const availabilityList = Object.values(weeklyAvailability).filter(av => av.active);
    onSave(availabilityList);
    toast.success("Weekly schedule saved successfully");
  };

  const handleSlotReleaseRulesSave = (rules: any[]) => {
    // Handle slot release rules save
    console.log('Saving slot release rules:', rules);
    toast.success("Slot release rules saved successfully");
  };

  // Get time ranges for the rules component
  const getTimeRangesForRules = () => {
    const timeRanges: Record<string, TimeRange[]> = {};
    Object.entries(weeklyAvailability).forEach(([day, availability]) => {
      if (availability.active && availability.timeRanges.length > 0) {
        timeRanges[day] = availability.timeRanges;
      }
    });
    return timeRanges;
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Main Schedule Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </span>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Schedule
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {WEEKDAYS.map(day => {
                const dayAvailability = weeklyAvailability[day];
                const isActive = dayAvailability?.active || false;
                
                return (
                  <div key={day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => handleDayToggle(day, checked)}
                        />
                        <span className="font-medium">{day}</span>
                        {isActive && (
                          <Badge variant="outline" className="text-xs">
                            {dayAvailability.timeRanges.length} time ranges
                          </Badge>
                        )}
                      </div>
                      {isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTimeRange(day)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add Time Range
                        </Button>
                      )}
                    </div>
                    
                    {isActive && (
                      <div className="space-y-2">
                        {dayAvailability.timeRanges.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No time ranges configured</p>
                            <p className="text-sm">Add a time range to get started</p>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            {dayAvailability.timeRanges.map((timeRange, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded border">
                                <div className="flex items-center gap-4">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="font-mono">
                                    {timeRange.startTime} - {timeRange.endTime}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {timeRange.slotDuration}min slots
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Qty: {timeRange.slotQuantity}
                                  </Badge>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTimeRange(day, index)}
                                    className="h-8 px-2"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTimeRange(day, index)}
                                    className="h-8 px-2 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Slot Release Rules Section */}
        <SlotReleaseRules
          doctorBranch={doctorBranch}
          timeRanges={getTimeRangesForRules()}
          onSave={handleSlotReleaseRulesSave}
        />
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        {/* Leaves Section */}
        <LeavesSection
          doctorBranch={doctorBranch}
          leaves={leaves}
          onLeavesChange={setLeaves}
          weeklySchedule={weeklyAvailability}
        />
        
        {/* Schedule Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(weeklyAvailability).map(([day, availability]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className={availability.active ? "font-medium" : "text-muted-foreground"}>
                    {day}
                  </span>
                  <span className={availability.active ? "text-green-600" : "text-muted-foreground"}>
                    {availability.active ? `${availability.timeRanges.length} ranges` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Form Modal */}
      {editingTimeRange && (
        <TimeRangeForm
          timeRange={editingTimeRange.timeRange}
          dayOfWeek={editingTimeRange.dayOfWeek}
          onSubmit={handleTimeRangeSubmit}
          onCancel={() => setEditingTimeRange(null)}
        />
      )}
    </div>
  );
};

export default WeeklyScheduleTab;
