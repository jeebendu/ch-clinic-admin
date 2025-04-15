
import { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Plus, Save, Trash2, Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { fetchDoctorDetailsById } from "@/admin/modules/appointments/services/DoctorService";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorLeaves } from "@/admin/components/doctor/DoctorLeaves";
import { DayAvailability, TimeSlot } from "../types/Availability";
import { TimePicker } from "../components/TimePicker";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorAvailability() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("availability");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [appointmentFees, setAppointmentFees] = useState("");
  const [slotDuration, setSlotDuration] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch doctor data
  const { data: doctorData, isLoading } = useQuery({
    queryKey: ['doctor', 1], // Replace with actual doctor ID from context or params
    queryFn: () => fetchDoctorDetailsById(1).then(res => res.data)
  });

  const [availabilityData, setAvailabilityData] = useState<Record<string, DayAvailability[]>>({
    general: DAYS_OF_WEEK.map(day => ({
      day,
      isAvailable: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day),
      slots: []
    })),
  });

  const findDayAvailability = (day: string) => {
    return availabilityData.general?.find(d => d.day === day) || {
      day,
      isAvailable: false,
      slots: []
    };
  };

  const currentDayData = findDayAvailability(selectedDay);

  const handleDayToggle = (day: string) => {
    setSelectedDay(day);
    
    // If this day wasn't available before, make it available
    const dayData = findDayAvailability(day);
    if (!dayData.isAvailable) {
      updateAvailability(day, { isAvailable: true });
    }
  };

  const updateAvailability = (day: string, update: Partial<DayAvailability>) => {
    setAvailabilityData(prev => {
      const newData = { ...prev };
      const currentTabData = [...(prev.general || [])];
      
      const dayIndex = currentTabData.findIndex(d => d.day === day);
      if (dayIndex >= 0) {
        currentTabData[dayIndex] = { ...currentTabData[dayIndex], ...update };
      } else {
        currentTabData.push({
          day,
          isAvailable: false,
          slots: [],
          ...update
        });
      }
      
      newData.general = currentTabData;
      return newData;
    });
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: selectedDay,
      startTime: "09:00 AM",
      capacity: 2
    };
    
    updateAvailability(selectedDay, {
      slots: [...currentDayData.slots, newSlot]
    });
  };

  const updateSlot = (slotId: string, updates: Partial<TimeSlot>) => {
    updateAvailability(selectedDay, {
      slots: currentDayData.slots.map(slot => 
        slot.id === slotId ? { ...slot, ...updates } : slot
      )
    });
  };

  const deleteSlot = (slotId: string) => {
    updateAvailability(selectedDay, {
      slots: currentDayData.slots.filter(slot => slot.id !== slotId)
    });
  };

  const deleteAllSlots = () => {
    updateAvailability(selectedDay, { slots: [] });
  };

  const handleSave = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Availability saved",
        description: "Your availability settings have been successfully updated.",
      });
    }, 1000);
  };

  const generateTimeSlots = () => {
    // Parse slot duration to number
    const duration = parseInt(slotDuration, 10);
    if (isNaN(duration) || duration <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a valid slot duration.",
        variant: "destructive"
      });
      return;
    }

    // Generate slots from 9 AM to 5 PM with the given duration
    const slots: TimeSlot[] = [];
    let currentHour = 9;
    let currentMinute = 0;
    let period = "AM";
    
    while ((currentHour < 17) || (currentHour === 17 && currentMinute === 0)) {
      // Format time
      const hour = currentHour > 12 ? currentHour - 12 : currentHour;
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = currentMinute.toString().padStart(2, "0");
      const timeStr = `${hourStr}:${minuteStr} ${period}`;
      
      // Add slot
      slots.push({
        id: Date.now().toString() + slots.length,
        day: selectedDay,
        startTime: timeStr,
        capacity: 2
      });
      
      // Increment time
      currentMinute += duration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute %= 60;
        
        if (currentHour === 12 && period === "AM") {
          period = "PM";
        }
        if (currentHour > 12) {
          currentHour %= 12;
          period = "PM";
        }
      }
    }
    
    updateAvailability(selectedDay, { slots });
    
    toast({
      title: "Slots generated",
      description: `${slots.length} slots generated for ${selectedDay}.`
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader 
          title="Doctor Availability & Leaves" 
          showAddButton={false}
          additionalActions={
            <Button 
              onClick={handleSave} 
              className="rounded-full flex items-center" 
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
              {isSubmitting && (
                <Progress className="ml-2 w-10 h-2" value={100} />
              )}
            </Button>
          }
        />

        <Tabs defaultValue="availability" value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="availability" className="px-6">Weekly Availability</TabsTrigger>
            <TabsTrigger value="leaves" className="px-6">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Leaves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availability">
            <Card className="border rounded-lg">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Progress className="w-1/2" value={40} />
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-6">Select Available Days & Time Slots</h2>
                        
                        <div className="mb-6">
                          <h3 className="text-base font-medium mb-3">Available days</h3>
                          <ToggleGroup type="single" value={selectedDay} onValueChange={handleDayToggle} className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map(day => {
                              const dayData = findDayAvailability(day);
                              return (
                                <ToggleGroupItem 
                                  key={day} 
                                  value={day}
                                  className={cn(
                                    "rounded-lg px-6 py-3", 
                                    dayData.isAvailable && dayData !== currentDayData && "border-primary text-primary"
                                  )}
                                >
                                  {day}
                                </ToggleGroupItem>
                              );
                            })}
                          </ToggleGroup>
                        </div>

                        {currentDayData?.isAvailable && (
                          <div className="border rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">{selectedDay}</h3>
                              <div className="flex gap-2">
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    className="w-20" 
                                    placeholder="30" 
                                    value={slotDuration} 
                                    onChange={(e) => setSlotDuration(e.target.value)}
                                  />
                                  <span className="text-sm text-gray-500">min</span>
                                  <Button 
                                    variant="outline" 
                                    onClick={generateTimeSlots} 
                                    className="whitespace-nowrap"
                                  >
                                    Generate Slots
                                  </Button>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="text-primary" 
                                  onClick={addTimeSlot}
                                >
                                  <Plus className="mr-1 h-4 w-4" />
                                  Add Slot
                                </Button>
                                {currentDayData.slots.length > 0 && (
                                  <Button 
                                    variant="outline" 
                                    className="text-red-500" 
                                    onClick={deleteAllSlots}
                                  >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Delete All
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {currentDayData.slots.map((slot) => (
                                <div key={slot.id} className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <TimePicker
                                    value={slot.startTime} 
                                    onChange={(value) => updateSlot(slot.id, { startTime: value })}
                                  />
                                  <Select 
                                    value={slot.capacity?.toString()} 
                                    onValueChange={(value) => updateSlot(slot.id, { capacity: parseInt(value) })}
                                  >
                                    <SelectTrigger className="w-20">
                                      <SelectValue placeholder="Capacity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                                    onClick={() => deleteSlot(slot.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}

                              {currentDayData.slots.length === 0 && (
                                <p className="text-gray-500">No time slots added for {selectedDay}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold mb-6">Settings</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="appointmentFees" className="text-base font-medium mb-2 block">
                              Appointment Fees ($)
                            </Label>
                            <Input 
                              id="appointmentFees" 
                              type="number" 
                              className="max-w-xs" 
                              value={appointmentFees}
                              onChange={e => setAppointmentFees(e.target.value)}
                              placeholder="e.g. 100"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="slotDuration" className="text-base font-medium mb-2 block">
                              Default Slot Duration (minutes)
                            </Label>
                            <Input 
                              id="slotDuration" 
                              type="number" 
                              className="max-w-xs" 
                              value={slotDuration}
                              onChange={e => setSlotDuration(e.target.value)}
                              placeholder="e.g. 30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves">
            <DoctorLeaves />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
