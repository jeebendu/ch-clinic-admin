import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { availabilityService } from "../services/availabilityService";
import { TimePicker } from "@/admin/components/TimePicker";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Doctor } from "../../../types/Doctor";
import { DoctorAvailability } from "../types/DoctorAvailability";
import BranchService from "@/admin/modules/branch/services/branchService";
import DoctorService from "../../../services/doctorService";

interface WeeklyScheduleTabProps {
  doctor: Doctor;
  branchObj: Branch;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctor, branchObj }) => {
  const [loading, setLoading] = useState(true);
  // const [doctor, setDoctor] = useState<Doctor>(null);
  // const [branch, setBranch] = useState<Branch>(null);





  const [schedules, setSchedules] = useState<DoctorAvailability[]>([
    { dayOfWeek: "Sunday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Monday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Tuesday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Wednesday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Thursday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Friday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: null, doctor: null, id: null },
    { dayOfWeek: "Saturday", active: false, startTime: "09:00", endTime: "14:00", slotDuration: 15, branch: null, doctor: null, id: null }
  ]);

  useEffect(() => {
    if (doctor && doctor?.id && branchObj && branchObj?.id) {
      fetchAvailability();
    }
  }, [doctor, branchObj]);


  useEffect(() => {
   if (doctor && doctor?.id && branchObj && branchObj?.id) {console.log(branchObj)
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
        setSchedules(availabilities.data);
      } else {
        setSchedules([
          { dayOfWeek: "Sunday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Monday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Tuesday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Wednesday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Thursday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Friday", active: false, startTime: "09:00", endTime: "17:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null },
          { dayOfWeek: "Saturday", active: false, startTime: "09:00", endTime: "14:00", slotDuration: 15, branch: branchObj, doctor: doctor, id: null }
        ]);
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

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex][field] = value;
    setSchedules(newSchedules);
  };

  const handleSaveSchedule = async () => {
    try {
      const res = await availabilityService.saveSchedule(schedules);
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
              <div key={day.id} className="grid md:grid-cols-7 gap-2 items-center py-4 border-t">
                <div className="font-medium">{day.dayOfWeek}</div>
                <div>
                  <Switch
                    checked={day.active}
                    onCheckedChange={() => handleToggleDay(index)}
                  />
                </div>
                <div className="col-span-2">
                  <TimePicker
                    value={day.startTime}
                    onChange={(value) => handleTimeChange(index, 'startTime', value)}
                    disabled={!day.active}
                  />
                </div>
                <div className="col-span-2">
                  <TimePicker
                    value={day.endTime}
                    onChange={(value) => handleTimeChange(index, 'endTime', value)}
                    disabled={!day.active}
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
                    disabled={!day.active}
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
