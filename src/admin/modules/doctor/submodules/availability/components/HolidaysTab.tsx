
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { Calendar, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { holidayService } from "../services/holidayService";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { ClinicHoliday } from "../types/DoctorAvailability";
import BranchService from "@/admin/modules/branch/services/branchService";
import { Doctor } from "../../../types/Doctor";

interface HolidaysTabProps {
  doctor: Doctor;
  branchObj: Branch;
}

const HolidaysTab: React.FC<HolidaysTabProps> = ({ doctor, branchObj }) => {
  const [loading, setLoading] = useState(true);
  // const [branch, setBranch] = useState<Branch>(null);
  const [holidays, setHolidays] = useState<ClinicHoliday[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<ClinicHoliday>({
    id: null,
    branch: branchObj,
    date: new Date(),
    reason: ""
  });

  useEffect(() => {
   if (branchObj && branchObj?.id) {
     setNewHoliday((prev) => ({ ...prev, branch: branchObj }));
      fetchHolidays();
    }
  }, [branchObj]);



  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await holidayService.getByBranch(branchObj.id);
      setHolidays(res.data);
    } catch (error) {
      console.error('Error fetching branch holidays:', error);
      toast.error('Failed to load holiday information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async () => {
    try {
      if (!newHoliday.date) {
        toast.error("Please select a date");
        return;
      }

      if (!newHoliday.reason) {
        toast.error("Please provide a reason for the holiday");
        return;
      }

      const res = await holidayService.saveHoliday(newHoliday);
      if (res.data.status) {
        toast.success('Holiday added successfully');
        setIsAddDialogOpen(false);
        setNewHoliday({
          id: null,
          branch: null,
          date: new Date(),
          reason: ""
        });
      } else {
        toast.error('Failed to add holiday');
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Failed to add holiday');
    } finally {
      fetchHolidays();
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    try {
      await holidayService.deleteHoliday(id);
      setHolidays(holidays.filter(holiday => holiday.id !== id));
      toast.success('Holiday deleted successfully');
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('Failed to delete holiday');
    } finally {
      fetchHolidays();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clinic Holidays</CardTitle>
            <CardDescription>Manage holidays for the entire clinic branch</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {holidays.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No branch holidays scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">Add holidays when the entire clinic branch is closed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">
                          {format(new Date(holiday.date), "dd MMMM yyyy")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{holiday.reason}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHoliday(holiday.id)} className="text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Holiday Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Branch Holiday</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <DatePicker
                date={newHoliday.date ? new Date(newHoliday.date) : undefined}
                onDateChange={(date) => setNewHoliday({ ...newHoliday, date: date })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <Input
                placeholder="Reason for holiday"
                value={newHoliday.reason || ""}
                onChange={(e) => setNewHoliday({ ...newHoliday, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddHoliday}>Add Holiday</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HolidaysTab;
