
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash, Calendar, Clock, Edit } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { DoctorAvailability, TimeRange, DoctorLeave } from "../types/DoctorAvailability";
import { weeklyScheduleService } from "../services/weeklyScheduleService";
import { leaveService } from "../services/leaveService";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Monday" },
  { key: "TUESDAY", label: "Tuesday" },
  { key: "WEDNESDAY", label: "Wednesday" },
  { key: "THURSDAY", label: "Thursday" },
  { key: "FRIDAY", label: "Friday" },
  { key: "SATURDAY", label: "Saturday" },
  { key: "SUNDAY", label: "Sunday" }
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [schedules, setSchedules] = useState<DoctorAvailability[]>([]);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isAddLeaveDialogOpen, setIsAddLeaveDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<DoctorLeave | null>(null);
  const [newLeave, setNewLeave] = useState<DoctorLeave>({
    id: null,
    doctorBranch: doctorBranch,
    leaveEnd: new Date(),
    leaveStart: new Date(),
    reason: "",
    approved: false
  });

  useEffect(() => {
    if (doctorBranch && doctorBranch.id) {
      setNewLeave((prev) => ({ ...prev, doctorBranch: doctorBranch }));
      fetchSchedules();
      fetchLeaves();
    }
  }, [doctorBranch]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await weeklyScheduleService.getByDoctorBranchId(doctorBranch.id);
      setSchedules(response.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      const doctorLeaves = await leaveService.getAllByDoctorBranchId(doctorBranch.id);
      setLeaves(doctorLeaves.data || []);
    } catch (error) {
      console.error('Error fetching doctor leaves:', error);
      toast.error('Failed to load leave information');
    }
  };

  const addTimeRange = (dayOfWeek: string) => {
    const newTimeRange: TimeRange = {
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 30,
      slotQuantity: 1
    };

    setSchedules(prevSchedules => {
      const existingSchedule = prevSchedules.find(s => s.dayOfWeek === dayOfWeek);
      
      if (existingSchedule) {
        return prevSchedules.map(schedule => 
          schedule.dayOfWeek === dayOfWeek 
            ? { ...schedule, timeRanges: [...schedule.timeRanges, newTimeRange] }
            : schedule
        );
      } else {
        const newSchedule: DoctorAvailability = {
          dayOfWeek,
          active: true,
          timeRanges: [newTimeRange],
          doctorBranch: doctorBranch,
          id: 0,
          releaseType: "DAYS",
          releaseBefore: 1,
          releaseTime: "00:00"
        };
        return [...prevSchedules, newSchedule];
      }
    });
  };

  const removeTimeRange = (dayOfWeek: string, index: number) => {
    setSchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.dayOfWeek === dayOfWeek 
          ? { ...schedule, timeRanges: schedule.timeRanges.filter((_, i) => i !== index) }
          : schedule
      ).filter(schedule => schedule.timeRanges.length > 0)
    );
  };

  const updateTimeRange = (dayOfWeek: string, index: number, field: keyof TimeRange, value: any) => {
    setSchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.dayOfWeek === dayOfWeek 
          ? {
              ...schedule,
              timeRanges: schedule.timeRanges.map((range, i) => 
                i === index ? { ...range, [field]: value } : range
              )
            }
          : schedule
      )
    );
  };

  const toggleDayActive = (dayOfWeek: string) => {
    setSchedules(prevSchedules => {
      const existingSchedule = prevSchedules.find(s => s.dayOfWeek === dayOfWeek);
      
      if (existingSchedule) {
        return prevSchedules.map(schedule => 
          schedule.dayOfWeek === dayOfWeek 
            ? { ...schedule, active: !schedule.active }
            : schedule
        );
      } else {
        const newSchedule: DoctorAvailability = {
          dayOfWeek,
          active: true,
          timeRanges: [],
          doctorBranch: doctorBranch,
          id: 0,
          releaseType: "DAYS",
          releaseBefore: 1,
          releaseTime: "00:00"
        };
        return [...prevSchedules, newSchedule];
      }
    });
  };

  const handleSaveSchedules = async () => {
    setSaving(true);
    try {
      const response = await weeklyScheduleService.saveSchedules(schedules, doctorBranch.id);
      if (response.data.status) {
        toast.success('Schedules saved successfully');
        await fetchSchedules();
      } else {
        toast.error('Failed to save schedules');
      }
    } catch (error) {
      console.error('Error saving schedules:', error);
      toast.error('Failed to save schedules');
    } finally {
      setSaving(false);
    }
  };

  const generateSlots = (timeRanges: TimeRange[], dayOfWeek: string, date: Date) => {
    const slots = [];
    
    timeRanges.forEach((range) => {
      const [startHour, startMin] = range.startTime.split(':').map(Number);
      const [endHour, endMin] = range.endTime.split(':').map(Number);
      
      let currentTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      while (currentTime < endTime) {
        const hour = Math.floor(currentTime / 60);
        const minute = currentTime % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        for (let i = 0; i < range.slotQuantity; i++) {
          slots.push({
            time: timeString,
            date: format(date, 'yyyy-MM-dd'),
            available: true,
            slotNumber: i + 1
          });
        }
        
        currentTime += range.slotDuration;
      }
    });
    
    return slots;
  };

  const handleAddLeave = async () => {
    try {
      if (!newLeave.leaveStart || !newLeave.leaveEnd) {
        toast.error("Please select start and end dates");
        return;
      }

      const res = await leaveService.saveLeave(newLeave);
      if (res.data.status) {
        toast.success('Leave added successfully');
        setIsAddLeaveDialogOpen(false);
        resetLeaveForm();
        fetchLeaves();
      } else {
        toast.error('Failed to add leave');
      }
    } catch (error) {
      console.error('Error adding leave:', error);
      toast.error('Failed to add leave');
    }
  };

  const handleEditLeave = (leave: DoctorLeave) => {
    setEditingLeave(leave);
    setNewLeave({
      ...leave,
      leaveStart: new Date(leave.leaveStart),
      leaveEnd: new Date(leave.leaveEnd)
    });
    setIsAddLeaveDialogOpen(true);
  };

  const handleUpdateLeave = async () => {
    try {
      const res = await leaveService.saveLeave(newLeave);
      if (res.data.status) {
        toast.success('Leave updated successfully');
        setIsAddLeaveDialogOpen(false);
        setEditingLeave(null);
        resetLeaveForm();
        fetchLeaves();
      } else {
        toast.error('Failed to update leave');
      }
    } catch (error) {
      console.error('Error updating leave:', error);
      toast.error('Failed to update leave');
    }
  };

  const handleDeleteLeave = async (id: number) => {
    try {
      const res = await leaveService.deleteLeave(id);
      if (res.data.status) {
        toast.success('Leave deleted successfully');
        fetchLeaves();
      } else {
        toast.error('Failed to delete leave');
      }
    } catch (error) {
      toast.error('Failed to delete leave');
    }
  };

  const resetLeaveForm = () => {
    setNewLeave({
      id: null,
      doctorBranch: doctorBranch,
      leaveEnd: new Date(),
      leaveStart: new Date(),
      reason: "",
      approved: false
    });
    setEditingLeave(null);
  };

  const getScheduleForDay = (dayOfWeek: string) => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const prevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const currentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left side - Weekly Schedule */}
      <div className="flex-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Configure doctor's working hours for each day</CardDescription>
            </div>
            <Button onClick={handleSaveSchedules} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedule = getScheduleForDay(day.key);
                const isActive = daySchedule?.active || false;
                
                return (
                  <div key={day.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleDayActive(day.key)}
                          className="w-4 h-4"
                        />
                        <h3 className="font-medium text-lg">{day.label}</h3>
                      </div>
                      {isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeRange(day.key)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Time Range
                        </Button>
                      )}
                    </div>

                    {isActive && daySchedule?.timeRanges && (
                      <div className="space-y-3">
                        {daySchedule.timeRanges.map((range, index) => (
                          <div key={index} className="grid grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Start Time</label>
                              <Input
                                type="time"
                                value={range.startTime}
                                onChange={(e) => updateTimeRange(day.key, index, 'startTime', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">End Time</label>
                              <Input
                                type="time"
                                value={range.endTime}
                                onChange={(e) => updateTimeRange(day.key, index, 'endTime', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Duration (min)</label>
                              <Input
                                type="number"
                                value={range.slotDuration}
                                onChange={(e) => updateTimeRange(day.key, index, 'slotDuration', parseInt(e.target.value))}
                                className="mt-1"
                                min="15"
                                step="15"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Quantity</label>
                              <Input
                                type="number"
                                value={range.slotQuantity}
                                onChange={(e) => updateTimeRange(day.key, index, 'slotQuantity', parseInt(e.target.value))}
                                className="mt-1"
                                min="1"
                              />
                            </div>
                            <div className="flex justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTimeRange(day.key, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right sidebar */}
      <div className="w-80 space-y-6">
        {/* Leaves Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Leaves</CardTitle>
              <CardDescription>Manage doctor's leaves</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddLeaveDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            {leaves.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No leaves scheduled</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {format(new Date(leave.leaveStart), "dd MMM")} - {format(new Date(leave.leaveEnd), "dd MMM yyyy")}
                      </div>
                      {leave.reason && (
                        <div className="text-xs text-muted-foreground">{leave.reason}</div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleEditLeave(leave)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500"
                        onClick={() => handleDeleteLeave(leave.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slot Preview Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Slot Preview</CardTitle>
                <CardDescription>
                  Week of {format(currentWeekStart, "MMM dd, yyyy")}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={prevWeek}>←</Button>
                <Button variant="outline" size="sm" onClick={currentWeek}>Today</Button>
                <Button variant="outline" size="sm" onClick={nextWeek}>→</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day, index) => {
                const date = addDays(currentWeekStart, index);
                const daySchedule = getScheduleForDay(day.key);
                const isActive = daySchedule?.active || false;
                const slots = isActive && daySchedule?.timeRanges ? 
                  generateSlots(daySchedule.timeRanges, day.key, date) : [];

                return (
                  <div key={day.key} className="border rounded p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">
                        {day.label.substring(0, 3)} {format(date, "dd")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {slots.length} slots
                      </div>
                    </div>
                    
                    {isActive && slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1">
                        {slots.slice(0, 6).map((slot, slotIndex) => (
                          <div 
                            key={slotIndex}
                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded text-center"
                          >
                            {slot.time}
                          </div>
                        ))}
                        {slots.length > 6 && (
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded text-center">
                            +{slots.length - 6}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        {isActive ? "No time ranges" : "Inactive"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Leave Dialog */}
      <Dialog open={isAddLeaveDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetLeaveForm();
        }
        setIsAddLeaveDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLeave ? 'Edit Leave' : 'Add New Leave'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <DatePicker
                  date={newLeave.leaveStart ? new Date(newLeave.leaveStart) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveStart: date })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <DatePicker
                  date={newLeave.leaveEnd ? new Date(newLeave.leaveEnd) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveEnd: date })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <Textarea
                placeholder="Reason for leave"
                value={newLeave.reason || ""}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddLeaveDialogOpen(false);
              resetLeaveForm();
            }}>
              Cancel
            </Button>
            <Button onClick={editingLeave ? handleUpdateLeave : handleAddLeave}>
              {editingLeave ? 'Update Leave' : 'Add Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyScheduleTab;
