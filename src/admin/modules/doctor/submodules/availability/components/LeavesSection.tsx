
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus, Trash, Grid, List, Clock } from "lucide-react";
import { format, isAfter, isBefore, isEqual, startOfDay, endOfDay } from "date-fns";
import { leaveService } from "../services/leaveService";
import { DoctorLeave } from "../types/DoctorAvailability";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { cn } from "@/lib/utils";

interface LeavesSectionProps {
  doctorBranch: DoctorBranch;
  weeklySchedule?: any[];
}

type ViewMode = 'list' | 'calendar';

const LeavesSection: React.FC<LeavesSectionProps> = ({ doctorBranch, weeklySchedule = [] }) => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<DoctorLeave | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [newLeave, setNewLeave] = useState<DoctorLeave>({
    id: null,
    doctorBranch: doctorBranch,
    leaveEnd: new Date(),
    leaveStart: new Date(),
    reason: "",
    approved: false
  });

  useEffect(() => {
    if (doctorBranch && doctorBranch?.id) {
      setNewLeave((prev) => ({ ...prev, doctorBranch: doctorBranch }))
      fetchLeaves();
    }
  }, [doctorBranch]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const doctorLeaves = await leaveService.getAllByDoctorBranchId(doctorBranch.id);
      setLeaves(doctorLeaves.data);
    } catch (error) {
      console.error('Error fetching doctor leaves:', error);
      toast.error('Failed to load leave information');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (leave: DoctorLeave) => {
    setNewLeave({
      ...leave,
      leaveStart: new Date(leave.leaveStart),
      leaveEnd: new Date(leave.leaveEnd)
    });
    setEditingLeave(leave);
    setIsAddDialogOpen(true);
  };

  const validateDates = () => {
    const today = startOfDay(new Date());
    const startDate = startOfDay(new Date(newLeave.leaveStart));
    const endDate = startOfDay(new Date(newLeave.leaveEnd));

    // Check if dates are in the past
    if (isBefore(startDate, today)) {
      toast.error("Start date cannot be in the past");
      return false;
    }

    if (isBefore(endDate, today)) {
      toast.error("End date cannot be in the past");
      return false;
    }

    // Check if end date is after start date
    if (isBefore(endDate, startDate)) {
      toast.error("End date must be after or equal to start date");
      return false;
    }

    // Check for overlapping leaves (exclude current leave if editing)
    const overlapping = leaves.find(leave => {
      if (editingLeave && leave.id === editingLeave.id) return false;
      
      const leaveStart = startOfDay(new Date(leave.leaveStart));
      const leaveEnd = startOfDay(new Date(leave.leaveEnd));
      
      return (
        (startDate >= leaveStart && startDate <= leaveEnd) ||
        (endDate >= leaveStart && endDate <= leaveEnd) ||
        (startDate <= leaveStart && endDate >= leaveEnd)
      );
    });

    if (overlapping) {
      toast.error(`Leave dates overlap with existing leave from ${format(new Date(overlapping.leaveStart), "dd MMM yyyy")} to ${format(new Date(overlapping.leaveEnd), "dd MMM yyyy")}`);
      return false;
    }

    return true;
  };

  const handleSaveLeave = async () => {
    try {
      // Validation
      if (!newLeave.leaveStart || !newLeave.leaveEnd) {
        toast.error("Please select start and end dates");
        return;
      }

      if (!validateDates()) {
        return;
      }

      const res = await leaveService.saveLeave(newLeave);
      if (res.data.status) {
        toast.success(editingLeave ? 'Leave updated successfully' : 'Leave added successfully');
        setIsAddDialogOpen(false);
        resetForm();
      } else {
        toast.error('Failed to save leave');
      }
    } catch (error) {
      console.error('Error saving leave:', error);
      toast.error('Failed to save leave');
    } finally {
      fetchLeaves();
    }
  };

  const handleDeleteLeave = async (id: number) => {
    try {
      const res = await leaveService.deleteLeave(id);
      if (res.data.status) {
        toast.success('Leave deleted successfully');
      } else {
        toast.error('Failed to delete leave');
      }
    } catch (error) {
      toast.error('Failed to delete leave');
    } finally {
      fetchLeaves();
    }
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    resetForm();
  };

  const leaveDates = leaves.map(leave => ({
    from: new Date(leave.leaveStart),
    to: new Date(leave.leaveEnd)
  }));

  return (
    <div className="space-y-4">
      {/* Leaves Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Leave Management</CardTitle>
            <CardDescription className="text-sm">Schedule doctor's leaves and time off</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="rounded-l-none"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Leave
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <>
                  {leaves.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No leaves scheduled</p>
                      <p className="text-xs text-muted-foreground mt-1">Add leaves when the doctor is unavailable</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {leaves.map((leave) => (
                        <div key={leave.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/20">
                          <div className="flex-1 cursor-pointer" onClick={() => openEditDialog(leave)}>
                            <h4 className="font-medium text-sm">
                              {format(new Date(leave.leaveStart), "dd MMM yyyy")} - {format(new Date(leave.leaveEnd), "dd MMM yyyy")}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">{leave.reason || "No reason provided"}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteLeave(leave.id)} className="text-red-500 h-8 w-8 p-0">
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center">
                  <Calendar
                    mode="multiple"
                    selected={leaveDates}
                    className={cn("rounded-md border", "pointer-events-auto")}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule Section */}
      {weeklySchedule && weeklySchedule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription className="text-sm">Current doctor availability schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {weeklySchedule.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-background">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm capitalize">{schedule.dayOfWeek}</h5>
                    <p className="text-xs text-muted-foreground">
                      {schedule.active ? (
                        schedule.timeRanges?.length > 0 ? (
                          schedule.timeRanges.map((range: any, idx: number) => (
                            <span key={idx} className="mr-2">
                              {range.startTime} - {range.endTime}
                            </span>
                          ))
                        ) : (
                          "No time ranges set"
                        )
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    schedule.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {schedule.active ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Leave Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="pointer-events-auto">
          <DialogHeader>
            <DialogTitle>{editingLeave ? 'Edit Leave' : 'Add New Leave'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <DatePicker
                  date={newLeave.leaveStart ? new Date(newLeave.leaveStart) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveStart: date || new Date() })}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <DatePicker
                  date={newLeave.leaveEnd ? new Date(newLeave.leaveEnd) : undefined}
                  onDateChange={(date) => setNewLeave({ ...newLeave, leaveEnd: date || new Date() })}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <Textarea
                placeholder="Reason for leave"
                value={newLeave.reason || ""}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSaveLeave}>
              {editingLeave ? 'Update Leave' : 'Add Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeavesSection;
