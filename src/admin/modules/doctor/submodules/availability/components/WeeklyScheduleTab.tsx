
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { DoctorAvailability, TimeRange, DoctorLeave } from "../types/DoctorAvailability";
import { Plus, Trash2, Edit, Calendar, ChevronLeft, ChevronRight, Clock, Coffee, X } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfWeek, isToday, isFuture } from "date-fns";
import availabilityService from "../services/availabilityService";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const DAYS_OF_WEEK = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<DoctorLeave | null>(null);
  const [leaveForm, setLeaveForm] = useState({
    leaveStart: "",
    leaveEnd: "",
    reason: "",
  });

  useEffect(() => {
    if (doctorBranch?.id) {
      fetchAvailabilities();
      fetchLeaves();
    }
  }, [doctorBranch?.id]);

  const fetchAvailabilities = async () => {
    if (!doctorBranch?.id) return;
    
    try {
      setLoading(true);
      const data = await availabilityService.getAvailabilities(doctorBranch.id);
      setAvailabilities(data || []);
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
      toast.error("Failed to load availabilities");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    if (!doctorBranch?.id) return;
    
    try {
      const data = await availabilityService.getLeaves(doctorBranch.id);
      setLeaves(data || []);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      toast.error("Failed to load leaves");
    }
  };

  const saveAvailability = async (dayAvailability: DoctorAvailability) => {
    try {
      if (dayAvailability.id) {
        await availabilityService.updateAvailability(dayAvailability.id, dayAvailability);
      } else {
        await availabilityService.createAvailability({
          ...dayAvailability,
          doctorBranch: doctorBranch
        });
      }
      await fetchAvailabilities();
      toast.success("Schedule updated successfully");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save schedule");
    }
  };

  const toggleDayActive = (dayOfWeek: string) => {
    const existing = availabilities.find(a => a.dayOfWeek === dayOfWeek);
    const updatedAvailability: DoctorAvailability = existing 
      ? { ...existing, active: !existing.active }
      : {
          id: 0,
          dayOfWeek,
          active: true,
          timeRanges: [],
          doctorBranch,
          releaseType: "HOURS",
          releaseBefore: 24,
          releaseTime: "09:00"
        };
    
    saveAvailability(updatedAvailability);
  };

  const addTimeRange = (dayOfWeek: string) => {
    const existing = availabilities.find(a => a.dayOfWeek === dayOfWeek);
    const newTimeRange: TimeRange = {
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 30,
      slotQuantity: 1
    };

    const updatedAvailability: DoctorAvailability = existing 
      ? { ...existing, timeRanges: [...existing.timeRanges, newTimeRange] }
      : {
          id: 0,
          dayOfWeek,
          active: true,
          timeRanges: [newTimeRange],
          doctorBranch,
          releaseType: "HOURS",
          releaseBefore: 24,
          releaseTime: "09:00"
        };

    saveAvailability(updatedAvailability);
  };

  const updateTimeRange = (dayOfWeek: string, rangeIndex: number, field: keyof TimeRange, value: string | number) => {
    const availability = availabilities.find(a => a.dayOfWeek === dayOfWeek);
    if (!availability) return;

    const updatedRanges = availability.timeRanges.map((range, index) => 
      index === rangeIndex ? { ...range, [field]: value } : range
    );

    const updatedAvailability = { ...availability, timeRanges: updatedRanges };
    saveAvailability(updatedAvailability);
  };

  const removeTimeRange = (dayOfWeek: string, rangeIndex: number) => {
    const availability = availabilities.find(a => a.dayOfWeek === dayOfWeek);
    if (!availability) return;

    const updatedRanges = availability.timeRanges.filter((_, index) => index !== rangeIndex);
    const updatedAvailability = { ...availability, timeRanges: updatedRanges };
    saveAvailability(updatedAvailability);
  };

  // Leave management functions
  const handleSaveLeave = async () => {
    try {
      if (editingLeave) {
        await availabilityService.updateLeave(editingLeave.id, {
          ...leaveForm,
          leaveStart: new Date(leaveForm.leaveStart),
          leaveEnd: new Date(leaveForm.leaveEnd),
          doctorBranch
        });
        toast.success("Leave updated successfully");
      } else {
        await availabilityService.createLeave({
          ...leaveForm,
          leaveStart: new Date(leaveForm.leaveStart),
          leaveEnd: new Date(leaveForm.leaveEnd),
          doctorBranch,
          approved: false
        });
        toast.success("Leave added successfully");
      }
      
      await fetchLeaves();
      setIsLeaveDialogOpen(false);
      setEditingLeave(null);
      setLeaveForm({ leaveStart: "", leaveEnd: "", reason: "" });
    } catch (error) {
      console.error("Error saving leave:", error);
      toast.error("Failed to save leave");
    }
  };

  const handleEditLeave = (leave: DoctorLeave) => {
    setEditingLeave(leave);
    setLeaveForm({
      leaveStart: format(new Date(leave.leaveStart), "yyyy-MM-dd"),
      leaveEnd: format(new Date(leave.leaveEnd), "yyyy-MM-dd"),
      reason: leave.reason
    });
    setIsLeaveDialogOpen(true);
  };

  const handleDeleteLeave = async (leaveId: number) => {
    try {
      await availabilityService.deleteLeave(leaveId);
      await fetchLeaves();
      toast.success("Leave deleted successfully");
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave");
    }
  };

  // Slot preview functions
  const generateSlots = (timeRange: TimeRange, date: Date): any[] => {
    const slots = [];
    const startTime = new Date(`${format(date, 'yyyy-MM-dd')}T${timeRange.startTime}:00`);
    const endTime = new Date(`${format(date, 'yyyy-MM-dd')}T${timeRange.endTime}:00`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + timeRange.slotDuration * 60000);
      
      for (let i = 0; i < timeRange.slotQuantity; i++) {
        slots.push({
          id: `${format(currentTime, 'HH:mm')}-${i}`,
          startTime: format(currentTime, 'HH:mm'),
          endTime: format(slotEndTime, 'HH:mm'),
          available: true
        });
      }
      
      currentTime = slotEndTime;
    }
    
    return slots;
  };

  const getWeekDates = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getDayAvailability = (dayOfWeek: string) => {
    return availabilities.find(a => a.dayOfWeek === dayOfWeek);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Schedule Configuration - Left Side */}
      <div className="col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {DAYS_OF_WEEK.map((day) => {
              const dayAvailability = getDayAvailability(day);
              const isActive = dayAvailability?.active || false;

              return (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleDayActive(day)}
                      />
                      <Label className="text-base font-medium capitalize">
                        {day.toLowerCase()}
                      </Label>
                    </div>
                    {isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeRange(day)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Range
                      </Button>
                    )}
                  </div>

                  {isActive && dayAvailability?.timeRanges && (
                    <div className="space-y-3 ml-6">
                      {dayAvailability.timeRanges.map((range, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded">
                          <div className="col-span-2">
                            <Label className="text-xs">Start Time</Label>
                            <Input
                              type="time"
                              value={range.startTime}
                              onChange={(e) => updateTimeRange(day, index, 'startTime', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">End Time</Label>
                            <Input
                              type="time"
                              value={range.endTime}
                              onChange={(e) => updateTimeRange(day, index, 'endTime', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Slot Duration (min)</Label>
                            <Input
                              type="number"
                              value={range.slotDuration}
                              onChange={(e) => updateTimeRange(day, index, 'slotDuration', parseInt(e.target.value))}
                              className="h-8"
                              min="1"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Slots per Time</Label>
                            <Input
                              type="number"
                              value={range.slotQuantity}
                              onChange={(e) => updateTimeRange(day, index, 'slotQuantity', parseInt(e.target.value))}
                              className="h-8"
                              min="1"
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="text-xs text-gray-600">
                              Total slots: {Math.floor(
                                ((new Date(`2000-01-01T${range.endTime}:00`).getTime() - 
                                  new Date(`2000-01-01T${range.startTime}:00`).getTime()) / 
                                (range.slotDuration * 60 * 1000)) * range.slotQuantity
                              )}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeRange(day, index)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-4 space-y-6">
        {/* Leaves Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leaves
              </CardTitle>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingLeave(null);
                    setLeaveForm({ leaveStart: "", leaveEnd: "", reason: "" });
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLeave ? "Edit Leave" : "Add New Leave"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="leaveStart">Start Date</Label>
                      <Input
                        id="leaveStart"
                        type="date"
                        value={leaveForm.leaveStart}
                        onChange={(e) => setLeaveForm(prev => ({
                          ...prev,
                          leaveStart: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaveEnd">End Date</Label>
                      <Input
                        id="leaveEnd"
                        type="date"
                        value={leaveForm.leaveEnd}
                        onChange={(e) => setLeaveForm(prev => ({
                          ...prev,
                          leaveEnd: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Textarea
                        id="reason"
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm(prev => ({
                          ...prev,
                          reason: e.target.value
                        }))}
                        placeholder="Enter reason for leave"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsLeaveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveLeave}>
                        {editingLeave ? "Update" : "Add"} Leave
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {leaves.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No leaves scheduled
                </p>
              ) : (
                leaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {format(new Date(leave.leaveStart), "MMM dd")} - {format(new Date(leave.leaveEnd), "MMM dd")}
                      </div>
                      <div className="text-xs text-gray-600">{leave.reason}</div>
                      <Badge
                        variant={leave.approved ? "default" : "secondary"}
                        className="text-xs mt-1"
                      >
                        {leave.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLeave(leave)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLeave(leave.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Slot Preview Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Slot Preview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(currentWeek, 'MMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getWeekDates().map((date, index) => {
                const dayName = DAYS_OF_WEEK[index];
                const dayAvailability = getDayAvailability(dayName);
                const isActiveDay = dayAvailability?.active;
                const isCurrentDay = isToday(date);
                const isFutureDay = isFuture(date) || isToday(date);

                let totalSlots = 0;
                const daySlots: any[] = [];

                if (isActiveDay && dayAvailability?.timeRanges) {
                  dayAvailability.timeRanges.forEach(range => {
                    const slots = generateSlots(range, date);
                    daySlots.push(...slots);
                    totalSlots += slots.length;
                  });
                }

                return (
                  <div key={date.toISOString()} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                          {format(date, 'EEE, MMM dd')}
                        </span>
                        {isCurrentDay && (
                          <Badge variant="outline" className="text-xs">
                            Today
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        {totalSlots} slots
                      </span>
                    </div>

                    {!isActiveDay ? (
                      <div className="text-xs text-gray-500 text-center py-2">
                        No availability
                      </div>
                    ) : daySlots.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-2">
                        No time ranges configured
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1">
                        {daySlots.slice(0, 12).map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className={`text-xs p-1 rounded text-center ${
                              !isFutureDay
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                          >
                            {slot.startTime}
                          </div>
                        ))}
                        {daySlots.length > 12 && (
                          <div className="text-xs text-gray-500 text-center col-span-3 pt-1">
                            +{daySlots.length - 12} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
