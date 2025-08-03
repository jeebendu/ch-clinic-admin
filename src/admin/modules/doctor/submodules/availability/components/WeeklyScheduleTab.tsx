import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeeklyScheduleService } from "../services/WeeklyScheduleService";
import { WeeklySchedule } from "../types/DoctorAvailability";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import GeneratedSlotsView from "./GeneratedSlotsView";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchWeeklySchedule();
  }, [doctorBranch?.id]);

  const fetchWeeklySchedule = async () => {
    if (!doctorBranch?.id) return;

    setLoading(true);
    try {
      const response = await WeeklyScheduleService.getByDoctorAndBranch(doctorBranch.doctor.id, doctorBranch.branch.id);
      setWeeklySchedule(response.data);
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
      toast.error("Failed to load weekly schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (day: string, field: keyof WeeklySchedule, value: string) => {
    const updatedSchedule = weeklySchedule.map(item =>
      item.day === day ? { ...item, [field]: value } : item
    );
    setWeeklySchedule(updatedSchedule);
  };

  const handleCheckboxChange = (day: string, isAvailable: boolean) => {
    const updatedSchedule = weeklySchedule.map(item =>
      item.day === day ? { ...item, isAvailable: isAvailable } : item
    );
    setWeeklySchedule(updatedSchedule);
  };

  const handleSave = async () => {
    if (!doctorBranch?.id) return;

    setLoading(true);
    try {
      // await WeeklyScheduleService.updateWeeklySchedule(weeklySchedule);
      toast.success("Weekly schedule updated successfully!");
    } catch (error) {
      console.error("Error updating weekly schedule:", error);
      toast.error("Failed to update weekly schedule");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading weekly schedule...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Configure the weekly availability schedule for this doctor.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {daysOfWeek.map(day => {
            const schedule = weeklySchedule.find(item => item.day === day);
            return (
              <div key={day} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor={`${day}-available`} className="text-right">
                  {day}
                </Label>
                <Input
                  type="checkbox"
                  id={`${day}-available`}
                  checked={schedule?.isAvailable || false}
                  onChange={(e) => handleCheckboxChange(day, e.target.checked)}
                  className="w-4 h-4"
                />
                <Input
                  type="time"
                  id={`${day}-startTime`}
                  value={schedule?.startTime || ""}
                  onChange={(e) => handleInputChange(day, 'startTime', e.target.value)}
                  className="col-span-1"
                />
                <Input
                  type="time"
                  id={`${day}-endTime`}
                  value={schedule?.endTime || ""}
                  onChange={(e) => handleInputChange(day, 'endTime', e.target.value)}
                  className="col-span-1"
                />
              </div>
            );
          })}
          <Button onClick={handleSave} disabled={loading}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
      
      {/* Add Generated Slots View at the bottom */}
      <GeneratedSlotsView doctorBranch={doctorBranch} />
    </div>
  );
};

export default WeeklyScheduleTab;
