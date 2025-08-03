import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, Save, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { WeeklySchedule, DAYS_OF_WEEK } from "../types/DoctorAvailability";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import weeklyScheduleService from "../services/weeklyScheduleService";
import { WeeklyScheduleService } from "../services/WeeklyScheduleService";
import TimeRangeRow from "./TimeRangeRow";
import GeneratedSlotsView from "./GeneratedSlotsView";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doctorBranch?.id) {
      fetchWeeklySchedule();
    }
  }, [doctorBranch?.id]);

  const fetchWeeklySchedule = async () => {
    setLoading(true);
    try {
      const data = await weeklyScheduleService.getByDoctorAndBranch(
        doctorBranch.doctor.id,
        doctorBranch.branch.id
      );

      // Ensure the data is an array before setting the state
      if (Array.isArray(data)) {
        setWeeklySchedule(data);
      } else {
        console.error("Data fetched is not an array:", data);
        toast.error("Failed to load weekly schedule data.");
        setWeeklySchedule([]); // Set to an empty array to avoid further issues
      }
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
      toast.error("Failed to load weekly schedule");
      setWeeklySchedule([]); // Ensure state is an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day: string, index: number, field: string, value: string) => {
    const updatedSchedule = weeklySchedule.map((item) => {
      if (item.day === day) {
        const updatedTimes = [...item.times];
        updatedTimes[index] = { ...updatedTimes[index], [field]: value };
        return { ...item, times: updatedTimes };
      }
      return item;
    });
    setWeeklySchedule(updatedSchedule);
  };

  const addTimeRange = (day: string) => {
    const updatedSchedule = weeklySchedule.map((item) => {
      if (item.day === day) {
        return {
          ...item,
          times: [...item.times, { startTime: "09:00", endTime: "17:00" }],
        };
      }
      return item;
    });
    setWeeklySchedule(updatedSchedule);
  };

  const deleteTimeRange = (day: string, index: number) => {
    const updatedSchedule = weeklySchedule.map((item) => {
      if (item.day === day) {
        const updatedTimes = [...item.times];
        updatedTimes.splice(index, 1);
        return { ...item, times: updatedTimes };
      }
      return item;
    });
    setWeeklySchedule(updatedSchedule);
  };

  const toggleDayAvailability = (day: string) => {
    const updatedSchedule = weeklySchedule.map((item) => {
      if (item.day === day) {
        return { ...item, active: !item.active };
      }
      return item;
    });
    setWeeklySchedule(updatedSchedule);
  };

  const saveWeeklySchedule = async () => {
    setIsSaving(true);
    try {
      // Prepare the data for saving
      const scheduleToSave = weeklySchedule.map((item) => ({
        id: item.id,
        day: item.day,
        active: item.active,
        times: item.times,
        doctorBranch: { id: doctorBranch.id }, // Ensure doctorBranch is included
      }));

      // Call the API to save the weekly schedule
      const response = await weeklyScheduleService.saveOrUpdate(scheduleToSave, doctorBranch.id);

      if (response.success) {
        toast.success("Weekly schedule saved successfully!");
        fetchWeeklySchedule(); // Refresh the schedule
      } else {
        toast.error(`Failed to save weekly schedule: ${response.message}`);
      }
    } catch (error) {
      console.error("Error saving weekly schedule:", error);
      toast.error("Failed to save weekly schedule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="slots" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Generated Slots
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading schedule...</div>
              ) : (
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day) => {
                    const scheduleForDay = weeklySchedule.find((item) => item.day === day);
                    return (
                      <div key={day} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">{day}</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDayAvailability(day)}
                          >
                            {scheduleForDay?.active ? "Active" : "Inactive"}
                          </Button>
                        </div>
                        {scheduleForDay?.active && (
                          <div className="space-y-3">
                            {scheduleForDay.times.map((time, index) => (
                              <TimeRangeRow
                                key={index}
                                time={time}
                                onTimeChange={(field, value) =>
                                  handleTimeChange(day, index, field, value)
                                }
                                onDelete={() => deleteTimeRange(day, index)}
                              />
                            ))}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full justify-center"
                              onClick={() => addTimeRange(day)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Time Range
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <Button
                    disabled={isSaving}
                    onClick={saveWeeklySchedule}
                    className="w-full justify-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Schedule
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slots">
          <GeneratedSlotsView doctorBranch={doctorBranch} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyScheduleTab;
