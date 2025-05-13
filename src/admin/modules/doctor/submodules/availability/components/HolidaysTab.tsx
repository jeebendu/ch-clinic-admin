
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

interface HolidaysTabProps {
  doctorId: number;
  branchId: number;
}

interface Holiday {
  id: number;
  branchId: number;
  holidayDate: Date | string;
  reason: string;
}

const HolidaysTab: React.FC<HolidaysTabProps> = ({ doctorId, branchId }) => {
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<Partial<Holiday>>({
    branchId,
    holidayDate: new Date(),
    reason: ""
  });
  
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const branchHolidays = await holidayService.getByBranch(branchId);
        setHolidays(branchHolidays || []);
      } catch (error) {
        console.error('Error fetching branch holidays:', error);
        toast.error('Failed to load holiday information');
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchHolidays();
    }
  }, [branchId]);

  const handleAddHoliday = async () => {
    try {
      // Validation
      if (!newHoliday.holidayDate) {
        toast.error("Please select a date");
        return;
      }
      
      if (!newHoliday.reason) {
        toast.error("Please provide a reason for the holiday");
        return;
      }
      
      const holidayToAdd = {
        ...newHoliday,
        branchId
      };
      
      const savedHoliday = await holidayService.saveHoliday(holidayToAdd);
      setHolidays([...holidays, savedHoliday]);
      setIsAddDialogOpen(false);
      toast.success('Holiday added successfully');
      
      // Reset the form
      setNewHoliday({
        branchId,
        holidayDate: new Date(),
        reason: ""
      });
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error('Failed to add holiday');
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
                          {format(new Date(holiday.holidayDate), "dd MMMM yyyy")}
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
                date={newHoliday.holidayDate ? new Date(newHoliday.holidayDate) : undefined} 
                onDateChange={(date) => setNewHoliday({...newHoliday, holidayDate: date})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason</label>
              <Input 
                placeholder="Reason for holiday" 
                value={newHoliday.reason || ""}
                onChange={(e) => setNewHoliday({...newHoliday, reason: e.target.value})}
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
