
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash, Save } from "lucide-react";
import { weeklyScheduleService } from "../services/weeklyScheduleService";
import { timeRangeService } from "../services/timeRangeService";
import { TimePicker } from "@/admin/components/TimePicker";
import { DoctorAvailability, TimeRange } from "../types/DoctorAvailability";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import LeavesSection from "./LeavesSection";

interface WeeklyScheduleTabProps {
  doctor: Doctor;
  selectedBranch: Branch;
  doctorBranch: DoctorBranch;
}

const daysOfWeek = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' }
];

const releaseTypes = [
  { value: 'FIXED', label: 'Fixed Time' },
  { value: 'RELATIVE', label: 'Minutes Before' }
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctor, selectedBranch, doctorBranch }) => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<DoctorAvailability[]>([]);

  useEffect(() => {
    if (doctor && selectedBranch && doctorBranch?.id) {
      fetchSchedules();
    }
  }, [doctor, selectedBranch, doctorBranch]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await weeklyScheduleService.getByDoctorBranchId(doctorBranch.id);
      setSchedules(response.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load weekly schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (dayIndex: number, field: keyof DoctorAvailability, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex] = {
      ...newSchedules[dayIndex],
      [field]: value
    };
    setSchedules(newSchedules);
  };

  const handleTimeRangeChange = (dayIndex: number, rangeIndex: number, field: keyof TimeRange, value: any) => {
    const newSchedules = [...schedules];
    const newTimeRanges = [...newSchedules[dayIndex].timeRanges];
    newTimeRanges[rangeIndex] = {
      ...newTimeRanges[rangeIndex],
      [field]: value
    };
    newSchedules[dayIndex].timeRanges = newTimeRanges;
    setSchedules(newSchedules);
  };

  const handleAddTimeRange = (dayIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeRanges.push({
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 15,
      slotQuantity: 1
    });
    setSchedules(newSchedules);
  };

  const handleRemoveTimeRange = (dayIndex: number, rangeIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeRanges.splice(rangeIndex, 1);
    setSchedules(newSchedules);
  };

  const handleSaveSchedules = async () => {
    try {
      const response = await weeklyScheduleService.saveSchedules(schedules, doctorBranch.id);
      if (response.data.status) {
        toast.success('Weekly schedule saved successfully');
        fetchSchedules();
      } else {
        toast.error('Failed to save weekly schedule');
      }
    } catch (error) {
      console.error('Error saving schedules:', error);
      toast.error('Failed to save weekly schedule');
    }
  };

  // Initialize schedules if empty
  useEffect(() => {
    if (schedules.length === 0 && doctorBranch?.id && !loading) {
      const initialSchedules = daysOfWeek.map((day, index) => ({
        id: index,
        dayOfWeek: day.value,
        active: false,
        timeRanges: [],
        doctorBranch: doctorBranch,
        releaseType: 'FIXED' as const,
        releaseBefore: 1,
        releaseTime: '06:00'
      }));
      setSchedules(initialSchedules);
    }
  }, [schedules, doctorBranch, loading]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Schedule Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Configure doctor's weekly availability</CardDescription>
              </div>
              <Button onClick={handleSaveSchedules}>
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {schedules.map((schedule, dayIndex) => (
                <Card key={dayIndex} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{schedule.dayOfWeek}</h3>
                        <Switch
                          checked={schedule.active}
                          onCheckedChange={(value) => handleScheduleChange(dayIndex, 'active', value)}
                        />
                      </div>
                      {schedule.active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTimeRange(dayIndex)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Time Range
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {schedule.active && (
                    <CardContent className="space-y-4">
                      {/* Release Settings */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-md">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Release Type</label>
                          <Select
                            value={schedule.releaseType}
                            onValueChange={(value) => handleScheduleChange(dayIndex, 'releaseType', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {releaseTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {schedule.releaseType === 'FIXED' ? (
                          <>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Days Before</label>
                              <Input
                                type="number"
                                min="0"
                                max="30"
                                value={schedule.releaseBefore}
                                onChange={(e) => handleScheduleChange(dayIndex, 'releaseBefore', parseInt(e.target.value) || 1)}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Release Time</label>
                              <TimePicker
                                value={schedule.releaseTime}
                                onChange={(value) => handleScheduleChange(dayIndex, 'releaseTime', value)}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2">
                            <label className="text-sm font-medium mb-1 block">Minutes Before Slot</label>
                            <Input
                              type="number"
                              min="0"
                              max="1440"
                              value={schedule.releaseBefore}
                              onChange={(e) => handleScheduleChange(dayIndex, 'releaseBefore', parseInt(e.target.value) || 60)}
                              className="h-9"
                            />
                          </div>
                        )}
                      </div>

                      {/* Time Ranges */}
                      {schedule.timeRanges.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed rounded-md">
                          <p className="text-sm text-muted-foreground">No time ranges configured</p>
                          <p className="text-xs text-muted-foreground mt-1">Add time ranges for this day</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {schedule.timeRanges.map((timeRange, rangeIndex) => (
                            <div key={rangeIndex} className="grid grid-cols-5 gap-3 items-center p-3 border rounded-md">
                              <div>
                                <label className="text-xs font-medium mb-1 block">Start Time</label>
                                <TimePicker
                                  value={timeRange.startTime}
                                  onChange={(value) => handleTimeRangeChange(dayIndex, rangeIndex, 'startTime', value)}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">End Time</label>
                                <TimePicker
                                  value={timeRange.endTime}
                                  onChange={(value) => handleTimeRangeChange(dayIndex, rangeIndex, 'endTime', value)}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">Duration (min)</label>
                                <Input
                                  type="number"
                                  min="5"
                                  max="120"
                                  value={timeRange.slotDuration}
                                  onChange={(e) => handleTimeRangeChange(dayIndex, rangeIndex, 'slotDuration', parseInt(e.target.value) || 15)}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">Quantity</label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={timeRange.slotQuantity}
                                  onChange={(e) => handleTimeRangeChange(dayIndex, rangeIndex, 'slotQuantity', parseInt(e.target.value) || 1)}
                                  className="h-9"
                                />
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTimeRange(dayIndex, rangeIndex)}
                                  className="text-red-500 h-9 w-9 p-0"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Leaves Section */}
      <div>
        <LeavesSection doctorBranch={doctorBranch} />
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
