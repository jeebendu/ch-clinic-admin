import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash, Clock, Coffee, Calendar, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { format, addWeeks, startOfWeek, addDays, parseISO, isAfter, isBefore } from "date-fns";
import { availabilityService } from "../services/availabilityService";
import { breakService } from "../services/breakService";
import { leaveService } from "../services/leaveService";
import { TimePicker } from "@/admin/components/TimePicker";
import { DoctorAvailability, TimeRange, DoctorBreak, DoctorLeave } from "../types/DoctorAvailability";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

const weekDays = [
  { value: "Sunday", label: "Sunday", index: 0 },
  { value: "Monday", label: "Monday", index: 1 },
  { value: "Tuesday", label: "Tuesday", index: 2 },
  { value: "Wednesday", label: "Wednesday", index: 3 },
  { value: "Thursday", label: "Thursday", index: 4 },
  { value: "Friday", label: "Friday", index: 5 },
  { value: "Saturday", label: "Saturday", index: 6 }
];

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [breaks, setBreaks] = useState<DoctorBreak[]>([]);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [rightSidebarTab, setRightSidebarTab] = useState<'preview' | 'breaks' | 'leaves'>('preview');
  
  // Dialog states
  const [isAddBreakDialogOpen, setIsAddBreakDialogOpen] = useState(false);
  const [isAddLeaveDialogOpen, setIsAddLeaveDialogOpen] = useState(false);
  const [editingBreak, setEditingBreak] = useState<DoctorBreak | null>(null);
  const [editingLeave, setEditingLeave] = useState<DoctorLeave | null>(null);

  // Form states
  const [newBreak, setNewBreak] = useState<DoctorBreak>({
    dayOfWeek: "Sunday",
    breakStart: "12:00",
    breakEnd: "13:00",
    description: "Lunch Break",
    doctorBranch: doctorBranch
  });

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
      fetchData();
    }
  }, [doctorBranch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAvailability(),
        fetchBreaks(),
        fetchLeaves()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const doctorAvailability = await availabilityService.findAllByDoctorBranchId(doctorBranch.id);
      setAvailability(doctorAvailability.data);
    } catch (error) {
      toast.error('Failed to load schedule');
    }
  };

  const fetchBreaks = async () => {
    try {
      const doctorBreaks = await breakService.getByDoctorBranchId(doctorBranch.id);
      setBreaks(doctorBreaks.data);
    } catch (error) {
      toast.error('Failed to load breaks');
    }
  };

  const fetchLeaves = async () => {
    try {
      const doctorLeaves = await leaveService.getAllByDoctorBranchId(doctorBranch.id);
      setLeaves(doctorLeaves.data);
    } catch (error) {
      toast.error('Failed to load leaves');
    }
  };

  const handleDayChange = (dayIndex: number, field: keyof DoctorAvailability, value: any) => {
    const newAvailability = [...availability];
    const daySchedule = newAvailability[dayIndex] || {
      dayOfWeek: weekDays[dayIndex].value,
      active: false,
      timeRanges: [],
      doctorBranch: doctorBranch,
      id: 0,
      releaseType: "DAYS",
      releaseBefore: 1,
      releaseTime: "09:00"
    };

    if (field === 'active') {
      daySchedule.active = value;
      if (value && daySchedule.timeRanges.length === 0) {
        daySchedule.timeRanges = [{
          startTime: "09:00",
          endTime: "17:00",
          slotDuration: 30,
          slotQuantity: 1
        }];
      }
    } else {
      daySchedule[field] = value;
    }

    newAvailability[dayIndex] = daySchedule;
    setAvailability(newAvailability);
  };

  const handleTimeRangeChange = (dayIndex: number, rangeIndex: number, field: keyof TimeRange, value: any) => {
    const newAvailability = [...availability];
    const daySchedule = newAvailability[dayIndex];
    if (daySchedule) {
      daySchedule.timeRanges[rangeIndex] = {
        ...daySchedule.timeRanges[rangeIndex],
        [field]: value
      };
      setAvailability(newAvailability);
    }
  };

  const addTimeRange = (dayIndex: number) => {
    const newAvailability = [...availability];
    const daySchedule = newAvailability[dayIndex];
    if (daySchedule) {
      daySchedule.timeRanges.push({
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
        slotQuantity: 1
      });
      setAvailability(newAvailability);
    }
  };

  const removeTimeRange = (dayIndex: number, rangeIndex: number) => {
    const newAvailability = [...availability];
    const daySchedule = newAvailability[dayIndex];
    if (daySchedule && daySchedule.timeRanges.length > 1) {
      daySchedule.timeRanges.splice(rangeIndex, 1);
      setAvailability(newAvailability);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const activeSchedules = availability.filter(schedule => schedule.active);
      const res = await availabilityService.saveSchedule(activeSchedules, doctorBranch.id);
      if (res.data.status) {
        toast.success('Weekly schedule saved successfully');
        fetchAvailability();
      } else {
        toast.error('Failed to save schedule');
      }
    } catch (error) {
      toast.error('Failed to save schedule');
    }
  };

  // Break management functions
  const handleAddBreak = async () => {
    try {
      const res = await breakService.saveBreaks([newBreak], doctorBranch.id);
      if (res.data.status) {
        toast.success('Break added successfully');
        setIsAddBreakDialogOpen(false);
        setNewBreak({
          dayOfWeek: "Sunday",
          breakStart: "12:00",
          breakEnd: "13:00",
          description: "Lunch Break",
          doctorBranch: doctorBranch
        });
        fetchBreaks();
      } else {
        toast.error('Failed to add break');
      }
    } catch (error) {
      toast.error('Failed to add break');
    }
  };

  const handleEditBreak = (breakItem: DoctorBreak) => {
    setEditingBreak(breakItem);
    setNewBreak(breakItem);
    setIsAddBreakDialogOpen(true);
  };

  const handleUpdateBreak = async () => {
    try {
      const res = await breakService.saveBreaks([newBreak], doctorBranch.id);
      if (res.data.status) {
        toast.success('Break updated successfully');
        setIsAddBreakDialogOpen(false);
        setEditingBreak(null);
        fetchBreaks();
      } else {
        toast.error('Failed to update break');
      }
    } catch (error) {
      toast.error('Failed to update break');
    }
  };

  const handleDeleteBreak = async (id: number) => {
    try {
      const res = await breakService.deleteById(id);
      if (res.data.status) {
        toast.success('Break deleted successfully');
        fetchBreaks();
      } else {
        toast.error('Failed to delete break');
      }
    } catch (error) {
      toast.error('Failed to delete break');
    }
  };

  // Leave management functions
  const handleAddLeave = async () => {
    try {
      if (!newLeave.leaveStart || !newLeave.leaveEnd) {
        toast.error("Please select start and end dates");
        return;
      }

      if (isAfter(new Date(newLeave.leaveStart), new Date(newLeave.leaveEnd))) {
        toast.error("End date must be after start date");
        return;
      }

      const res = await leaveService.saveLeave(newLeave);
      if (res.data.status) {
        toast.success(editingLeave ? 'Leave updated successfully' : 'Leave added successfully');
        setIsAddLeaveDialogOpen(false);
        setEditingLeave(null);
        setNewLeave({
          id: null,
          doctorBranch: doctorBranch,
          leaveEnd: new Date(),
          leaveStart: new Date(),
          reason: "",
          approved: false
        });
        fetchLeaves();
      } else {
        toast.error('Failed to save leave');
      }
    } catch (error) {
      toast.error('Failed to save leave');
    }
  };

  const handleEditLeave = (leave: DoctorLeave) => {
    setEditingLeave(leave);
    setNewLeave(leave);
    setIsAddLeaveDialogOpen(true);
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

  // Slot preview generation
  const generateSlotPreview = () => {
    const startDate = startOfWeek(currentWeek);
    const weekSlots = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const currentDate = addDays(startDate, dayIndex);
      const dayName = weekDays[dayIndex].value;
      const daySchedule = availability.find(schedule => 
        schedule.active && schedule.dayOfWeek === dayName
      );

      const daySlots = [];

      if (daySchedule && daySchedule.timeRanges) {
        daySchedule.timeRanges.forEach((timeRange) => {
          const startTime = new Date(`2000-01-01T${timeRange.startTime}:00`);
          const endTime = new Date(`2000-01-01T${timeRange.endTime}:00`);
          const duration = timeRange.slotDuration;
          const quantity = timeRange.slotQuantity || 1;

          let currentTime = new Date(startTime);
          while (currentTime < endTime) {
            const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
            if (slotEndTime <= endTime) {
              for (let q = 0; q < quantity; q++) {
                daySlots.push({
                  time: currentTime.toTimeString().slice(0, 5),
                  endTime: slotEndTime.toTimeString().slice(0, 5),
                  available: true,
                  quantity: q + 1
                });
              }
            }
            currentTime = slotEndTime;
          }
        });
      }

      weekSlots.push({
        date: currentDate,
        dayName: dayName,
        slots: daySlots
      });
    }

    return weekSlots;
  };

  const slotPreview = generateSlotPreview();

  const handlePreviousWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  return (
    <div className="flex gap-6">
      {/* Main Content - Weekly Schedule */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule Configuration</CardTitle>
            <CardDescription>Configure doctor's working hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {weekDays.map((day, dayIndex) => {
                  const daySchedule = availability[dayIndex];
                  const isActive = daySchedule?.active || false;

                  return (
                    <div key={day.value} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`day-${dayIndex}`}
                              checked={isActive}
                              onChange={(e) => handleDayChange(dayIndex, 'active', e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`day-${dayIndex}`} className="font-medium text-lg">
                              {day.label}
                            </label>
                          </div>
                        </div>

                        {isActive && (
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-medium">Release:</label>
                              <Select
                                value={daySchedule?.releaseBefore?.toString() || "1"}
                                onValueChange={(value) => handleDayChange(dayIndex, 'releaseBefore', parseInt(value))}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 7, 14, 30].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={daySchedule?.releaseType || "DAYS"}
                                onValueChange={(value) => handleDayChange(dayIndex, 'releaseType', value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DAYS">Days</SelectItem>
                                  <SelectItem value="HOURS">Hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <span className="text-sm">before at</span>
                              <TimePicker
                                value={daySchedule?.releaseTime || "09:00"}
                                onChange={(value) => handleDayChange(dayIndex, 'releaseTime', value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <div className="space-y-3">
                          {daySchedule?.timeRanges?.map((timeRange, rangeIndex) => (
                            <div key={rangeIndex} className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end p-3 bg-muted/30 rounded">
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
                                <Select
                                  value={timeRange.slotDuration?.toString() || "30"}
                                  onValueChange={(value) => handleTimeRangeChange(dayIndex, rangeIndex, 'slotDuration', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="45">45</SelectItem>
                                    <SelectItem value="60">60</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">Quantity</label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={timeRange.slotQuantity || 1}
                                  onChange={(e) => handleTimeRangeChange(dayIndex, rangeIndex, 'slotQuantity', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTimeRange(dayIndex)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                {daySchedule.timeRanges.length > 1 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                                    className="text-red-500"
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSchedule}>
                    Save Weekly Schedule
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex space-x-1">
              <Button
                variant={rightSidebarTab === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRightSidebarTab('preview')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant={rightSidebarTab === 'breaks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRightSidebarTab('breaks')}
              >
                <Coffee className="h-4 w-4 mr-1" />
                Breaks
              </Button>
              <Button
                variant={rightSidebarTab === 'leaves' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRightSidebarTab('leaves')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Leaves
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {rightSidebarTab === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Slot Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {format(startOfWeek(currentWeek), "MMM d")} - {format(addDays(startOfWeek(currentWeek), 6), "MMM d")}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleNextWeek}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {slotPreview.map((day, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-sm">{day.dayName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {format(day.date, "MMM d")}
                        </span>
                      </div>
                      
                      {day.slots.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No slots available</p>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {day.slots.slice(0, 8).map((slot, slotIndex) => (
                              <Badge key={slotIndex} variant="secondary" className="text-xs">
                                {slot.time}
                                {slot.quantity > 1 && ` (${slot.quantity})`}
                              </Badge>
                            ))}
                            {day.slots.length > 8 && (
                              <Badge variant="outline" className="text-xs">
                                +{day.slots.length - 8} more
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Total: {day.slots.length} slots
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightSidebarTab === 'breaks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Breaks</h3>
                  <Button size="sm" onClick={() => setIsAddBreakDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {breaks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No breaks configured
                  </p>
                ) : (
                  <div className="space-y-2">
                    {breaks.map((breakItem) => (
                      <div key={breakItem.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{breakItem.dayOfWeek}</p>
                            <p className="text-xs text-muted-foreground">
                              {breakItem.breakStart} - {breakItem.breakEnd}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBreak(breakItem)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBreak(breakItem.id)}
                              className="text-red-500"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {breakItem.description && (
                          <p className="text-xs text-muted-foreground">{breakItem.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {rightSidebarTab === 'leaves' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Leaves</h3>
                  <Button size="sm" onClick={() => setIsAddLeaveDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {leaves.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No leaves scheduled
                  </p>
                ) : (
                  <div className="space-y-2">
                    {leaves.map((leave) => (
                      <div key={leave.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">
                              {format(new Date(leave.leaveStart), "MMM d")} - {format(new Date(leave.leaveEnd), "MMM d")}
                            </p>
                            <p className="text-xs text-muted-foreground">{leave.reason || "No reason"}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLeave(leave)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLeave(leave.id)}
                              className="text-red-500"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {leave.approved && (
                          <Badge variant="secondary" className="text-xs">Approved</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Break Dialog */}
      <Dialog open={isAddBreakDialogOpen} onOpenChange={setIsAddBreakDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBreak ? 'Edit Break' : 'Add New Break'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Day</label>
              <Select
                value={newBreak.dayOfWeek}
                onValueChange={(value) => setNewBreak({ ...newBreak, dayOfWeek: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Time</label>
                <TimePicker
                  value={newBreak.breakStart}
                  onChange={(value) => setNewBreak({ ...newBreak, breakStart: value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Time</label>
                <TimePicker
                  value={newBreak.breakEnd}
                  onChange={(value) => setNewBreak({ ...newBreak, breakEnd: value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                placeholder="Break description"
                value={newBreak.description}
                onChange={(e) => setNewBreak({ ...newBreak, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddBreakDialogOpen(false);
              setEditingBreak(null);
            }}>
              Cancel
            </Button>
            <Button onClick={editingBreak ? handleUpdateBreak : handleAddBreak}>
              {editingBreak ? 'Update' : 'Add'} Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Leave Dialog */}
      <Dialog open={isAddLeaveDialogOpen} onOpenChange={setIsAddLeaveDialogOpen}>
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
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="approved"
                checked={newLeave.approved}
                onChange={(e) => setNewLeave({ ...newLeave, approved: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="approved" className="text-sm font-medium">Approved</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddLeaveDialogOpen(false);
              setEditingLeave(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddLeave}>
              {editingLeave ? 'Update' : 'Add'} Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyScheduleTab;
