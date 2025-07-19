import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { availabilityService } from "../services/availabilityService";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Doctor } from "../../../types/Doctor";
import { DoctorAvailability, TimeRange } from "../types/DoctorAvailability";
import TimeRangeRow from "./TimeRangeRow";
import { ClockTimePicker } from "@/admin/components/ClockTimePicker";

interface WeeklyScheduleTabProps {
  doctor: Doctor;
  branchObj: Branch;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctor, branchObj }) => {
  const [loading, setLoading] = useState(true);
  const [slotMode, setSlotMode] = useState<string>("TIMEWISE");
  const [releaseBefore, setReleaseBefore] = useState<number>(1);
  const [releaseTime, setReleaseTime] = useState<string>("09:00");

  const [schedules, setSchedules] = useState<DoctorAvailability[]>([
    {
      dayOfWeek: "Sunday",
      active: false,
      timeRanges: [{
        id: "sunday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Monday",
      active: false,
      timeRanges: [{
        id: "monday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Tuesday",
      active: false,
      timeRanges: [{
        id: "tuesday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Wednesday",
      active: false,
      timeRanges: [{
        id: "wednesday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Thursday",
      active: false,
      timeRanges: [{
        id: "thursday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Friday",
      active: false,
      timeRanges: [{
        id: "friday-1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    },
    {
      dayOfWeek: "Saturday",
      active: false,
      timeRanges: [{
        id: "saturday-1",
        startTime: "09:00",
        endTime: "14:00",
        slotDuration: 15,
        slotQuantity: 1
      }],
      branch: null,
      doctor: null,
      id: null,
      releaseType: "TIMEWISE",
      releaseBefore: 1,
      releaseTime: "09:00"
    }
  ]);

  useEffect(() => {
    if (doctor && doctor?.id && branchObj && branchObj?.id) {
      fetchAvailability();
    }
  }, [doctor, branchObj]);

  useEffect(() => {
    if (doctor && doctor?.id && branchObj && branchObj?.id) {
      setSchedules((prev) =>
        prev.map((schedule) => ({
          ...schedule,
          doctor: doctor,
          branch: branchObj
        }))
      );
    }
  }, [doctor, branchObj]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const availabilities = await availabilityService.getByDoctorAndBranch(doctor.id, branchObj.id);
      if (availabilities.data && availabilities.data.length > 0) {
        const transformedData = availabilities.data.map((item: any, index: number) => ({
          ...item,
          timeRanges: item.timeRanges || [{
            id: `${item.dayOfWeek.toLowerCase()}-1`,
            startTime: item.startTime || "09:00",
            endTime: item.endTime || "17:00",
            slotDuration: item.slotDuration || 15,
            slotQuantity: item.slotQuantity || 1
          }],
          releaseTime: item.releaseTime || "09:00"
        }));
        setSchedules(transformedData);
        setReleaseBefore(transformedData[0]?.releaseBefore || 1);
        setSlotMode(transformedData[0]?.releaseType || "TIMEWISE");
        setReleaseTime(transformedData[0]?.releaseTime || "09:00");
      }
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      toast.error('Failed to load availability schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].active = !newSchedules[dayIndex].active;
    setSchedules(newSchedules);
  };

  const handleAddTimeRange = (dayIndex: number) => {
    const newSchedules = [...schedules];
    const dayName = newSchedules[dayIndex].dayOfWeek.toLowerCase();
    const newTimeRange: TimeRange = {
      id: `${dayName}-${Date.now()}`,
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 15,
      slotQuantity: slotMode === "COUNTWISE" ? 100 : 1
    };
    
    newSchedules[dayIndex].timeRanges.push(newTimeRange);
    setSchedules(newSchedules);
  };

  const handleUpdateTimeRange = (dayIndex: number, timeRangeId: string, updates: Partial<TimeRange>) => {
    const newSchedules = [...schedules];
    const timeRangeIndex = newSchedules[dayIndex].timeRanges.findIndex(tr => tr.id === timeRangeId);
    if (timeRangeIndex !== -1) {
      newSchedules[dayIndex].timeRanges[timeRangeIndex] = {
        ...newSchedules[dayIndex].timeRanges[timeRangeIndex],
        ...updates
      };
      setSchedules(newSchedules);
    }
  };

  const handleDeleteTimeRange = (dayIndex: number, timeRangeId: string) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeRanges = newSchedules[dayIndex].timeRanges.filter(tr => tr.id !== timeRangeId);
    setSchedules(newSchedules);
  };

  const handleSaveSchedule = async () => {
    try {
      const apiData = schedules.map(schedule => ({
        ...schedule,
        startTime: schedule.timeRanges[0]?.startTime || "09:00",
        endTime: schedule.timeRanges[0]?.endTime || "17:00",
        slotDuration: schedule.timeRanges[0]?.slotDuration || 15,
        slotQuantity: schedule.timeRanges[0]?.slotQuantity || 1,
        releaseType: slotMode,
        releaseBefore: releaseBefore,
        releaseTime: releaseTime
      }));

      const res = await availabilityService.saveSchedule(apiData);
      if (res.data.status) {
        toast.success('Weekly schedule saved successfully!');
      } else {
        toast.error('Failed to save weekly schedule');
      }
      fetchAvailability();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save weekly schedule');
    }
  };

  const handleReleaseBeforeChange = (value: string) => {
    setReleaseBefore(Number(value));
    setSchedules((prev) =>
      prev.map((schedule) => ({
        ...schedule,
        releaseBefore: Number(value)
      }))
    );
  };

  const handleReleaseTimeChange = (value: string) => {
    setReleaseTime(value);
    setSchedules((prev) =>
      prev.map((schedule) => ({
        ...schedule,
        releaseTime: value
      }))
    );
  };

  const handleSlotModeChange = (value: string) => {
    setSlotMode(value);
    setSchedules((prev) =>
      prev.map((schedule) => ({
        ...schedule,
        releaseType: value,
        timeRanges: schedule.timeRanges.map(tr => ({
          ...tr,
          slotQuantity: value === "COUNTWISE" ? 100 : 1
        }))
      }))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>Set doctor's weekly working hours for this branch</CardDescription>
        
        <div className="space-y-6">
          {/* Release Configuration - All in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Release Type Radio Buttons */}
            <div>
              <Label className="text-base font-medium mb-3 block">Release Type</Label>
              <RadioGroup value={slotMode} onValueChange={handleSlotModeChange} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TIMEWISE" id="timewise" />
                  <Label htmlFor="timewise" className="cursor-pointer">Timewise</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COUNTWISE" id="countwise" />
                  <Label htmlFor="countwise" className="cursor-pointer">Countwise</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Release Before */}
            <div>
              <Label className="text-base font-medium mb-2 block">Release Before</Label>
              <Select value={String(releaseBefore)} onValueChange={handleReleaseBeforeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select release day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Same Day</SelectItem>
                  <SelectItem value="1">Before 1 Day</SelectItem>
                  <SelectItem value="2">Before 2 Days</SelectItem>
                  <SelectItem value="3">Before 3 Days</SelectItem>
                  <SelectItem value="4">Before 4 Days</SelectItem>
                  <SelectItem value="5">Before 5 Days</SelectItem>
                  <SelectItem value="6">Before 6 Days</SelectItem>
                  <SelectItem value="7">Before 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Release Time with new ClockTimePicker */}
            <div>
              <Label className="text-base font-medium mb-2 block">Release Time</Label>
              <ClockTimePicker
                value={releaseTime}
                onChange={handleReleaseTimeChange}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {schedules.map((day, dayIndex) => (
                <div key={day.dayOfWeek} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={day.active}
                        onCheckedChange={() => handleToggleDay(dayIndex)}
                      />
                      <h3 className="text-lg font-semibold">{day.dayOfWeek}</h3>
                    </div>
                    {day.active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTimeRange(dayIndex)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Time Range
                      </Button>
                    )}
                  </div>

                  {day.active && (
                    <div className="space-y-3">
                      {day.timeRanges.map((timeRange) => (
                        <TimeRangeRow
                          key={timeRange.id}
                          timeRange={timeRange}
                          onUpdate={(id, updates) => handleUpdateTimeRange(dayIndex, id, updates)}
                          onDelete={(id) => handleDeleteTimeRange(dayIndex, id)}
                          canDelete={day.timeRanges.length > 1}
                          isDisabled={!day.active}
                          releaseType={slotMode}
                        />
                      ))}
                    </div>
                  )}

                  {!day.active && (
                    <p className="text-sm text-muted-foreground ml-10">
                      Day is not available
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveSchedule} size="lg">
                Save Weekly Schedule
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleTab;
