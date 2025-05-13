
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DoctorAvailability } from "../types/DoctorAvailability";
import { availabilityService } from "../services/availabilityService";
import TimePicker from "@/admin/components/TimePicker";

interface WeeklyScheduleTabProps {
  doctorId: number;
  branchId: number;
}

interface DaySchedule {
  dayOfWeek: number;
  name: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorId, branchId }) => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { dayOfWeek: 0, name: "Sunday", isAvailable: false, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 1, name: "Monday", isAvailable: true, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 2, name: "Tuesday", isAvailable: true, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 3, name: "Wednesday", isAvailable: true, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 4, name: "Thursday", isAvailable: true, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 5, name: "Friday", isAvailable: true, startTime: "09:00", endTime: "17:00", slotDuration: 15 },
    { dayOfWeek: 6, name: "Saturday", isAvailable: true, startTime: "09:00", endTime: "14:00", slotDuration: 15 }
  ]);
  
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const availabilities = await availabilityService.getByDoctorAndBranch(doctorId, branchId);
        
        if (availabilities && availabilities.length > 0) {
          // Map API data to our state
          const updatedSchedules = [...schedules];
          availabilities.forEach((avail: DoctorAvailability) => {
            const dayIndex = updatedSchedules.findIndex(day => day.dayOfWeek === avail.dayOfWeek);
            if (dayIndex !== -1) {
              updatedSchedules[dayIndex] = {
                ...updatedSchedules[dayIndex],
                isAvailable: true,
                startTime: avail.startTime,
                endTime: avail.endTime,
                slotDuration: 15 // Default slot duration if not provided by API
              };
            }
          });
          setSchedules(updatedSchedules);
        }
      } catch (error) {
        console.error('Error fetching doctor availability:', error);
        toast.error('Failed to load availability schedule');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && branchId) {
      fetchAvailability();
    }
  }, [doctorId, branchId]);

  const handleToggleDay = (dayIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].isAvailable = !newSchedules[dayIndex].isAvailable;
    setSchedules(newSchedules);
  };

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex][field] = value;
    setSchedules(newSchedules);
  };

  const handleSaveSchedule = async () => {
    try {
      const availabilitiesToSave = schedules
        .filter(day => day.isAvailable)
        .map(day => ({
          doctorId,
          branchId,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
          slotDuration: day.slotDuration,
          isAvailable: day.isAvailable
        }));
      
      await availabilityService.saveSchedule(availabilitiesToSave);
      toast.success('Weekly schedule saved successfully');
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save weekly schedule');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <CardDescription>Set doctor's weekly working hours for this branch</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-7 gap-2 mb-4 text-xs font-medium text-muted-foreground">
              <div>Day</div>
              <div>Available</div>
              <div className="col-span-2">Start Time</div>
              <div className="col-span-2">End Time</div>
              <div>Duration</div>
            </div>
            {schedules.map((day, index) => (
              <div key={day.dayOfWeek} className="grid md:grid-cols-7 gap-2 items-center py-4 border-t">
                <div className="font-medium">{day.name}</div>
                <div>
                  <Switch 
                    checked={day.isAvailable}
                    onCheckedChange={() => handleToggleDay(index)}
                  />
                </div>
                <div className="col-span-2">
                  <TimePicker 
                    value={day.startTime}
                    onChange={(value) => handleTimeChange(index, 'startTime', value)}
                    disabled={!day.isAvailable}
                  />
                </div>
                <div className="col-span-2">
                  <TimePicker 
                    value={day.endTime}
                    onChange={(value) => handleTimeChange(index, 'endTime', value)}
                    disabled={!day.isAvailable}
                  />
                </div>
                <div>
                  <select
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={day.slotDuration}
                    onChange={(e) => {
                      const newSchedules = [...schedules];
                      newSchedules[index].slotDuration = parseInt(e.target.value);
                      setSchedules(newSchedules);
                    }}
                    disabled={!day.isAvailable}
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveSchedule}>
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
