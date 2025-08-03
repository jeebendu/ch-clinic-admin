import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DoctorAvailability, TimeRange } from "../types/DoctorAvailability";
import TimeRangeRow from "./TimeRangeRow";
import { ClockTimePicker } from "@/admin/components/ClockTimePicker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import AvailabilityService from "../services/availabilityService";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { key: "MONDAY", label: "Monday" },
    { key: "TUESDAY", label: "Tuesday" },
    { key: "WEDNESDAY", label: "Wednesday" },
    { key: "THURSDAY", label: "Thursday" },
    { key: "FRIDAY", label: "Friday" },
    { key: "SATURDAY", label: "Saturday" },
    { key: "SUNDAY", label: "Sunday" }
  ];

  useEffect(() => {
    if (doctorBranch?.id) {
      fetchAvailability();
    }
  }, [doctorBranch]);

  // Helper function to format time from API (handles both HH:mm and HH:mm:ss formats)
  const formatTimeForDisplay = (timeString: string): string => {
    if (!timeString) return "09:00";
    
    // Remove seconds if present (HH:mm:ss -> HH:mm)
    const timeParts = timeString.split(":");
    if (timeParts.length >= 2) {
      return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
    }
    
    return timeString;
  };

  // Helper function to format time for API (ensures HH:mm:ss format)
  const formatTimeForAPI = (timeString: string): string => {
    if (!timeString) return "09:00:00";
    
    const timeParts = timeString.split(":");
    if (timeParts.length === 2) {
      return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
    }
    
    return timeString;
  };

  const generateId = () => Math.floor(Math.random() * 1000000);

  const createDefaultTimeRange = (): TimeRange => ({
    id: generateId(),
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 15,
    slotQuantity: 1
  });

  const initializeAvailabilities = () => {
    return daysOfWeek.map(day => ({
      id: generateId(),
      dayOfWeek: day.key,
      active: false,
      timeRanges: [createDefaultTimeRange()],
      doctorBranch: doctorBranch,
      releaseType: "COUNTWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    }));
  };

  const validateTimeRange = (range: TimeRange, allRanges: TimeRange[]): string[] => {
    const errors: string[] = [];
    
    if (!range.startTime || !range.endTime) {
      errors.push("Start time and end time are required");
      return errors;
    }

    const start = new Date(`2000-01-01T${range.startTime}:00`);
    const end = new Date(`2000-01-01T${range.endTime}:00`);
    
    if (start >= end) {
      errors.push("End time must be after start time");
    }

    // Check for overlaps with other ranges
    const otherRanges = allRanges.filter(r => r.id !== range.id);
    for (const otherRange of otherRanges) {
      if (!otherRange.startTime || !otherRange.endTime) continue;
      
      const otherStart = new Date(`2000-01-01T${otherRange.startTime}:00`);
      const otherEnd = new Date(`2000-01-01T${otherRange.endTime}:00`);
      
      if (start < otherEnd && end > otherStart) {
        errors.push("Time range overlaps with another range");
        break;
      }
    }

    return errors;
  };

  const validateAvailability = (availability: DoctorAvailability): string[] => {
    const errors: string[] = [];
    
    if (availability.active) {
      if (!availability.timeRanges || availability.timeRanges.length === 0) {
        errors.push("Active days must have at least one time range");
        return errors;
      }

      for (const range of availability.timeRanges) {
        const rangeErrors = validateTimeRange(range, availability.timeRanges);
        errors.push(...rangeErrors);
      }
    }

    return errors;
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "0min";
    
    try {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 0) return "0min";
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
      }
      return `${mins}min`;
    } catch (error) {
      return "0min";
    }
  };

  const calculateTotalSlots = (timeRange: TimeRange, releaseType: string): number => {
    if (!timeRange.startTime || !timeRange.endTime) return 0;
    
    try {
      const start = new Date(`2000-01-01T${timeRange.startTime}:00`);
      const end = new Date(`2000-01-01T${timeRange.endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins <= 0) return 0;
      
      if (releaseType === "COUNTWISE") {
        // For countwise: multiply hours by patients per hour
        const hours = diffMins / 60;
        return Math.floor(hours * timeRange.slotQuantity);
      } else {
        // For timewise: divide total minutes by slot duration
        return Math.floor(diffMins / timeRange.slotDuration);
      }
    } catch (error) {
      return 0;
    }
  };

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const availabilities = await AvailabilityService.findAllByDoctorBranchId(doctorBranch.id);
      if (availabilities.data && availabilities.data.length > 0) {
        const transformedData = availabilities.data.map((item: any, index: number) => ({
          ...item,
          id: item.id || generateId(),
          releaseTime: formatTimeForDisplay(item.releaseTime || "09:00"),
          timeRanges: item.timeRanges && item.timeRanges.length > 0 
            ? item.timeRanges.map((range: any) => ({
                ...range,
                id: range.id || generateId(),
                startTime: formatTimeForDisplay(range.startTime),
                endTime: formatTimeForDisplay(range.endTime),
                slotDuration: range.slotDuration || 15,
                slotQuantity: range.slotQuantity || 1
              }))
            : [createDefaultTimeRange()]
        }));
        
        // Ensure all days are represented
        const existingDays = transformedData.map((item: any) => item.dayOfWeek);
        const missingDays = daysOfWeek.filter(day => !existingDays.includes(day.key));
        
        const allDaysData = [
          ...transformedData,
          ...missingDays.map(day => ({
            id: generateId(),
            dayOfWeek: day.key,
            active: false,
            timeRanges: [createDefaultTimeRange()],
            doctorBranch: doctorBranch,
            releaseType: "COUNTWISE",
            releaseBefore: 1,
            releaseTime: "09:00"
          }))
        ];
        
        // Sort by day order
        const sortedData = daysOfWeek.map(day => 
          allDaysData.find(item => item.dayOfWeek === day.key)
        ).filter(Boolean);
        
        setAvailabilities(sortedData as DoctorAvailability[]);
      } else {
        setAvailabilities(initializeAvailabilities());
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability data');
      setAvailabilities(initializeAvailabilities());
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = (dayOfWeek: string, updates: Partial<DoctorAvailability>) => {
    setAvailabilities(prev => 
      prev.map(availability => 
        availability.dayOfWeek === dayOfWeek 
          ? { ...availability, ...updates }
          : availability
      )
    );
  };

  const updateTimeRange = (dayOfWeek: string, rangeId: number, updates: Partial<TimeRange>) => {
    setAvailabilities(prev => 
      prev.map(availability => 
        availability.dayOfWeek === dayOfWeek 
          ? {
              ...availability,
              timeRanges: availability.timeRanges.map(range => 
                range.id === rangeId ? { ...range, ...updates } : range
              )
            }
          : availability
      )
    );
  };

  const addTimeRange = (dayOfWeek: string) => {
    const newRange = createDefaultTimeRange();
    
    setAvailabilities(prev => 
      prev.map(availability => 
        availability.dayOfWeek === dayOfWeek 
          ? {
              ...availability,
              timeRanges: [...availability.timeRanges, newRange]
            }
          : availability
      )
    );
  };

  const deleteTimeRange = (dayOfWeek: string, rangeId: number) => {
    setAvailabilities(prev => 
      prev.map(availability => 
        availability.dayOfWeek === dayOfWeek 
          ? {
              ...availability,
              timeRanges: availability.timeRanges.filter(range => range.id !== rangeId)
            }
          : availability
      )
    );
  };

  const saveSchedule = async () => {
    // Validate all availabilities
    const validationErrors: { [key: string]: string[] } = {};
    
    for (const availability of availabilities) {
      const errors = validateAvailability(availability);
      if (errors.length > 0) {
        validationErrors[availability.dayOfWeek] = errors;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0][0];
      toast.error(firstError);
      return;
    }

    setSaving(true);
    try {
      // Transform data for API
      const dataToSave = availabilities.map(availability => ({
        ...availability,
        releaseTime: formatTimeForAPI(availability.releaseTime),
        timeRanges: availability.timeRanges.map(range => ({
          ...range,
          startTime: formatTimeForAPI(range.startTime),
          endTime: formatTimeForAPI(range.endTime)
        }))
      }));

      const response = await AvailabilityService.saveSchedule(dataToSave, doctorBranch.id);
      
      if (response.data.status) {
        toast.success('Schedule saved successfully');
        // Refresh the data
        fetchAvailability();
      } else {
        toast.error(response.data.message || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading schedule...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Schedule</CardTitle>
          </div>
          <Button onClick={saveSchedule} disabled={saving}>
            {saving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {availabilities.map(availability => {
            const dayLabel = daysOfWeek.find(d => d.key === availability.dayOfWeek)?.label || availability.dayOfWeek;
            const hasErrors = availability.active && availability.timeRanges.some(range => {
              const errors = validateTimeRange(range, availability.timeRanges);
              return errors.length > 0;
            });

            return (
              <div key={availability.dayOfWeek} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{dayLabel}</h3>
                  <div className="flex items-center space-x-4">
                    {/* Release Settings */}
                    {availability.active && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Release Type:</Label>
                          <Select
                            value={availability.releaseType}
                            onValueChange={(value) => updateAvailability(availability.dayOfWeek, { releaseType: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COUNTWISE">Count-wise</SelectItem>
                              <SelectItem value="TIMEWISE">Time-wise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Release Time:</Label>
                          <ClockTimePicker
                            value={availability.releaseTime}
                            onChange={(value) => updateAvailability(availability.dayOfWeek, { releaseTime: value })}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={availability.active}
                        onCheckedChange={(checked) => updateAvailability(availability.dayOfWeek, { active: checked })}
                      />
                      <Label>{availability.active ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>
                </div>

                {availability.active && (
                  <div className="space-y-3">
                    {hasErrors && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please fix the time range errors below
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {availability.timeRanges.map((timeRange, index) => {
                      const duration = calculateDuration(timeRange.startTime, timeRange.endTime);
                      const totalSlots = calculateTotalSlots(timeRange, availability.releaseType);
                      const rangeErrors = validateTimeRange(timeRange, availability.timeRanges);
                      
                      return (
                        <TimeRangeRow
                          key={timeRange.id}
                          timeRange={timeRange}
                          onUpdate={(rangeId, updates) => updateTimeRange(availability.dayOfWeek, rangeId, updates)}
                          onDelete={(rangeId) => deleteTimeRange(availability.dayOfWeek, rangeId)}
                          canDelete={availability.timeRanges.length > 1} // Allow deletion when more than 1 range
                          releaseType={availability.releaseType}
                          duration={duration}
                          totalSlots={totalSlots}
                          allTimeRanges={availability.timeRanges}
                          hasValidationError={rangeErrors.length > 0}
                        />
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => addTimeRange(availability.dayOfWeek)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time Range
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyScheduleTab;
