import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash, Save, RotateCcw, Clock, Calendar, Settings } from "lucide-react";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { DoctorAvailability, TimeRange } from "../types/DoctorAvailability";
import { availabilityService } from "../services/availabilityService";
import LeavesSection from "./LeavesSection";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

interface DayScheduleCardProps {
  availability: DoctorAvailability;
  onToggleActive: (dayOfWeek: string, active: boolean) => void;
  onUpdateTimeRanges: (dayOfWeek: string, timeRanges: TimeRange[]) => void;
  onUpdateReleaseSettings: (dayOfWeek: string, releaseType: string, releaseBefore: number, releaseTime: string) => void;
}

const DayScheduleCard: React.FC<DayScheduleCardProps> = ({ availability, onToggleActive, onUpdateTimeRanges, onUpdateReleaseSettings }) => {
  const [active, setActive] = useState(availability.active);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>(availability.timeRanges || []);
  const [newTimeRange, setNewTimeRange] = useState<TimeRange>({ startTime: "09:00", endTime: "17:00", slotDuration: 30, slotQuantity: 1 });
  const [releaseType, setReleaseType] = useState(availability.releaseType || "days");
  const [releaseBefore, setReleaseBefore] = useState(availability.releaseBefore || 1);
  const [releaseTime, setReleaseTime] = useState(availability.releaseTime || "09:00");

  const handleToggleActive = (checked: boolean) => {
    setActive(checked);
    onToggleActive(availability.dayOfWeek, checked);
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, newTimeRange]);
    onUpdateTimeRanges(availability.dayOfWeek, [...timeRanges, newTimeRange]);
    setNewTimeRange({ startTime: "09:00", endTime: "17:00", slotDuration: 30, slotQuantity: 1 }); // Reset newTimeRange
  };

  const handleRemoveTimeRange = (index: number) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges.splice(index, 1);
    setTimeRanges(updatedTimeRanges);
    onUpdateTimeRanges(availability.dayOfWeek, updatedTimeRanges);
  };

  const handleTimeRangeChange = (index: number, field: string, value: string | number) => {
    const updatedTimeRanges = [...timeRanges];
    // Ensure value is a number if field is slotDuration or slotQuantity
    const parsedValue = (field === 'slotDuration' || field === 'slotQuantity') ? Number(value) : value;
    updatedTimeRanges[index] = { ...updatedTimeRanges[index], [field]: parsedValue };
    setTimeRanges(updatedTimeRanges);
    onUpdateTimeRanges(availability.dayOfWeek, updatedTimeRanges);
  };

  const handleUpdateReleaseSettings = (type: string, before: number, time: string) => {
    setReleaseType(type);
    setReleaseBefore(before);
    setReleaseTime(time);
    onUpdateReleaseSettings(availability.dayOfWeek, type, before, time);
  };

  return (
    <div className="border rounded-md p-4 space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{availability.dayOfWeek}</h3>
        <Switch id={`active-${availability.dayOfWeek}`} checked={active} onCheckedChange={handleToggleActive} />
      </div>

      {active && (
        <>
          <div className="space-y-2">
            <h4 className="text-md font-semibold">Time Ranges</h4>
            {timeRanges.map((range, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={range.startTime}
                  onChange={(e) => handleTimeRangeChange(index, "startTime", e.target.value)}
                  className="w-24"
                />
                -
                <Input
                  type="time"
                  value={range.endTime}
                  onChange={(e) => handleTimeRangeChange(index, "endTime", e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  value={String(range.slotDuration)}
                  onChange={(e) => handleTimeRangeChange(index, "slotDuration", e.target.value)}
                  className="w-16"
                  placeholder="Duration"
                />
                <Input
                  type="number"
                  value={String(range.slotQuantity)}
                  onChange={(e) => handleTimeRangeChange(index, "slotQuantity", e.target.value)}
                  className="w-16"
                  placeholder="Quantity"
                />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveTimeRange(index)} className="text-red-500 h-8 w-8 p-0">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                type="time"
                value={newTimeRange.startTime}
                onChange={(e) => setNewTimeRange({ ...newTimeRange, startTime: e.target.value })}
                className="w-24"
              />
              -
              <Input
                type="time"
                value={newTimeRange.endTime}
                onChange={(e) => setNewTimeRange({ ...newTimeRange, endTime: e.target.value })}
                className="w-24"
              />
              <Input
                type="number"
                value={String(newTimeRange.slotDuration)}
                onChange={(e) => setNewTimeRange({ ...newTimeRange, slotDuration: Number(e.target.value) })}
                className="w-16"
                placeholder="Duration"
              />
               <Input
                type="number"
                value={String(newTimeRange.slotQuantity)}
                onChange={(e) => setNewTimeRange({ ...newTimeRange, slotQuantity: Number(e.target.value) })}
                className="w-16"
                placeholder="Quantity"
              />
              <Button size="sm" onClick={handleAddTimeRange}>
                <Plus className="h-4 w-4 mr-2" />
                Add Time
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-md font-semibold">Release Settings</h4>
            <div className="flex items-center space-x-2">
              <Select value={releaseType} onValueChange={(value) => handleUpdateReleaseSettings(value, releaseBefore, releaseTime)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Release Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days Before</SelectItem>
                  <SelectItem value="time">Specific Time</SelectItem>
                </SelectContent>
              </Select>
              {releaseType === "days" ? (
                <Input
                  type="number"
                  value={String(releaseBefore)}
                  onChange={(e) => handleUpdateReleaseSettings(releaseType, Number(e.target.value), releaseTime)}
                  className="w-24"
                  placeholder="Days"
                />
              ) : (
                <Input
                  type="time"
                  value={releaseTime}
                  onChange={(e) => handleUpdateReleaseSettings(releaseType, releaseBefore, e.target.value)}
                  className="w-24"
                  placeholder="Time"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (doctorBranch && doctorBranch.id) {
      fetchAvailabilities();
    }
  }, [doctorBranch]);

  const fetchAvailabilities = async () => {
    setLoading(true);
    try {
      const response = await availabilityService.getByDoctorBranchId(doctorBranch.id);
      setAvailabilities(response.data);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      toast.error("Failed to load availabilities");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (dayOfWeek: string, active: boolean) => {
    const updatedAvailabilities = availabilities.map(availability =>
      availability.dayOfWeek === dayOfWeek ? { ...availability, active } : availability
    );
    setAvailabilities(updatedAvailabilities);
    setHasUnsavedChanges(true);
  };

  const handleUpdateTimeRanges = (dayOfWeek: string, timeRanges: TimeRange[]) => {
    const updatedAvailabilities = availabilities.map(availability =>
      availability.dayOfWeek === dayOfWeek ? { ...availability, timeRanges } : availability
    );
    setAvailabilities(updatedAvailabilities);
    setHasUnsavedChanges(true);
  };

  const handleUpdateReleaseSettings = (dayOfWeek: string, releaseType: string, releaseBefore: number, releaseTime: string) => {
    const updatedAvailabilities = availabilities.map(availability =>
      availability.dayOfWeek === dayOfWeek ? { ...availability, releaseType, releaseBefore, releaseTime } : availability
    );
    setAvailabilities(updatedAvailabilities);
    setHasUnsavedChanges(true);
  };

  const handleBulkSave = async () => {
    setLoading(true);
    try {
      // Prepare the data for saving
      const saveData = availabilities.map(availability => ({
        ...availability,
        doctorBranch: { id: doctorBranch.id }, // Ensure doctorBranch only contains the ID
      }));

      // Call the bulk save API
      const response = await availabilityService.bulkSave(saveData);

      if (response.data.status) {
        toast.success("Availabilities updated successfully");
        setHasUnsavedChanges(false);
        fetchAvailabilities(); // Refresh data to ensure consistency
      } else {
        toast.error("Failed to update availabilities");
      }
    } catch (error) {
      console.error("Error during bulk save:", error);
      toast.error("Failed to update availabilities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Schedule Content */}
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">Weekly Schedule</CardTitle>
              <CardDescription>Manage doctor's weekly availability and time slots</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleBulkSave} 
                disabled={!hasUnsavedChanges || loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={fetchAvailabilities} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {availabilities.map((availability) => (
                  <DayScheduleCard
                    key={availability.dayOfWeek}
                    availability={availability}
                    onToggleActive={handleToggleActive}
                    onUpdateTimeRanges={handleUpdateTimeRanges}
                    onUpdateReleaseSettings={handleUpdateReleaseSettings}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80">
        <LeavesSection 
          doctorBranch={doctorBranch} 
          weeklySchedule={availabilities}
        />
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
