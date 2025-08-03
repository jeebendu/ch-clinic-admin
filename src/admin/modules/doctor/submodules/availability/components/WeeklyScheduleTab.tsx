import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Clock } from "lucide-react";
import { TimePicker } from "@/admin/components/TimePicker";

interface TimeRange {
  id: number;
  startTime: string;
  endTime: string;
  patientLimit: number;
  isActive: boolean;
}

interface DaySchedule {
  dayOfWeek: string;
  isActive: boolean;
  timeRanges: TimeRange[];
}

const WeeklyScheduleTab: React.FC = () => {
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    {
      dayOfWeek: "MONDAY",
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "TUESDAY", 
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "WEDNESDAY",
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "THURSDAY",
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "FRIDAY",
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "SATURDAY",
      isActive: true,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    },
    {
      dayOfWeek: "SUNDAY",
      isActive: false,
      timeRanges: [{ id: 1, startTime: "09:00", endTime: "17:00", patientLimit: 10, isActive: true }]
    }
  ]);

  const updateTimeRange = (dayIndex: number, rangeIndex: number, field: string, value: any) => {
    const newSchedules = [...schedules];
    (newSchedules[dayIndex].timeRanges[rangeIndex] as any)[field] = value;
    setSchedules(newSchedules);
  };

  const addTimeRange = (dayIndex: number) => {
    const newSchedules = [...schedules];
    const newId = Math.max(...newSchedules[dayIndex].timeRanges.map(r => r.id)) + 1;
    newSchedules[dayIndex].timeRanges.push({
      id: newId,
      startTime: "09:00",
      endTime: "17:00", 
      patientLimit: 10,
      isActive: true
    });
    setSchedules(newSchedules);
  };

  const removeTimeRange = (dayIndex: number, rangeIndex: number) => {
    const newSchedules = [...schedules];
    if (newSchedules[dayIndex].timeRanges.length > 1) {
      newSchedules[dayIndex].timeRanges.splice(rangeIndex, 1);
      setSchedules(newSchedules);
    }
  };

  const toggleDayActive = (dayIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].isActive = !newSchedules[dayIndex].isActive;
    setSchedules(newSchedules);
  };

  const handleSave = () => {
    console.log("Saving schedules:", schedules);
    // API call logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weekly Schedule</h2>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Schedule
        </Button>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule, dayIndex) => (
          <Card key={schedule.dayOfWeek} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {schedule.dayOfWeek.toLowerCase()}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={schedule.isActive ? "default" : "secondary"}>
                    {schedule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDayActive(dayIndex)}
                  >
                    {schedule.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {schedule.isActive && (
              <CardContent>
                <div className="space-y-4">
                  {schedule.timeRanges.map((range, rangeIndex) => (
                    <div key={range.id} className="flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Start Time</Label>
                        <TimePicker
                          value={range.startTime}
                          onChange={(time) => updateTimeRange(dayIndex, rangeIndex, 'startTime', time)}
                        />
                      </div>

                      <div className="flex-1">
                        <Label className="text-sm font-medium">End Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="time"
                            value={range.endTime}
                            onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'endTime', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="w-32">
                        <Label className="text-sm font-medium">Patient Limit</Label>
                        <Input
                          type="number"
                          value={range.patientLimit}
                          onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'patientLimit', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                        disabled={schedule.timeRanges.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => addTimeRange(dayIndex)}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Range
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
