
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DoctorBranch } from "@/admin/modules/appointments/types/DoctorClinic";
import { availabilityService } from "../services/availabilityService";
import { DoctorAvailability } from "../types/DoctorAvailability";

interface WeeklyScheduleTabProps {
  doctorBranch: DoctorBranch;
}

interface TimeRange {
  startTime: string;
  endTime: string;
  slotDuration: number;
  slotQuantity: number;
}

interface SlotPreview {
  date: string;
  dayName: string;
  morning: string[];
  evening: string[];
}

const WeeklyScheduleTab: React.FC<WeeklyScheduleTabProps> = ({ doctorBranch }) => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewWeekStart, setPreviewWeekStart] = useState(new Date());

  const daysOfWeek = [
    { key: 'MONDAY', label: 'Monday', shortLabel: 'Mon' },
    { key: 'TUESDAY', label: 'Tuesday', shortLabel: 'Tue' },
    { key: 'WEDNESDAY', label: 'Wednesday', shortLabel: 'Wed' },
    { key: 'THURSDAY', label: 'Thursday', shortLabel: 'Thu' },
    { key: 'FRIDAY', label: 'Friday', shortLabel: 'Fri' },
    { key: 'SATURDAY', label: 'Saturday', shortLabel: 'Sat' },
    { key: 'SUNDAY', label: 'Sunday', shortLabel: 'Sun' }
  ];

  useEffect(() => {
    fetchAvailabilities();
    // Set preview to start from next Monday
    const nextMonday = getNextMonday();
    setPreviewWeekStart(nextMonday);
  }, [doctorBranch]);

  const getNextMonday = () => {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday;
  };

  const fetchAvailabilities = async () => {
    if (!doctorBranch.id) return;
    
    setLoading(true);
    try {
      const response = await availabilityService.findAllByDoctorBranchId(doctorBranch.id);
      setAvailabilities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const initializeAvailability = (dayKey: string): DoctorAvailability => ({
    id: null,
    dayOfWeek: dayKey,
    isAvailable: false,
    releaseTime: '09:00',
    timeRanges: [],
    doctorBranch: doctorBranch
  });

  const getAvailabilityForDay = (dayKey: string): DoctorAvailability => {
    return availabilities.find(av => av.dayOfWeek === dayKey) || initializeAvailability(dayKey);
  };

  const updateAvailability = (dayKey: string, updates: Partial<DoctorAvailability>) => {
    setAvailabilities(prev => {
      const existing = prev.find(av => av.dayOfWeek === dayKey);
      if (existing) {
        return prev.map(av => av.dayOfWeek === dayKey ? { ...av, ...updates } : av);
      } else {
        return [...prev, { ...initializeAvailability(dayKey), ...updates }];
      }
    });
  };

  const addTimeRange = (dayKey: string) => {
    const availability = getAvailabilityForDay(dayKey);
    const newTimeRange: TimeRange = {
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 15,
      slotQuantity: 1
    };
    
    updateAvailability(dayKey, {
      timeRanges: [...(availability.timeRanges || []), newTimeRange]
    });
  };

  const updateTimeRange = (dayKey: string, index: number, updates: Partial<TimeRange>) => {
    const availability = getAvailabilityForDay(dayKey);
    const updatedRanges = [...(availability.timeRanges || [])];
    updatedRanges[index] = { ...updatedRanges[index], ...updates };
    updateAvailability(dayKey, { timeRanges: updatedRanges });
  };

  const removeTimeRange = (dayKey: string, index: number) => {
    const availability = getAvailabilityForDay(dayKey);
    const updatedRanges = availability.timeRanges?.filter((_, i) => i !== index) || [];
    updateAvailability(dayKey, { timeRanges: updatedRanges });
  };

  const generateSlots = (timeRanges: TimeRange[]): { morning: string[], evening: string[] } => {
    const morning: string[] = [];
    const evening: string[] = [];

    timeRanges.forEach(range => {
      const startHour = parseInt(range.startTime.split(':')[0]);
      const startMinute = parseInt(range.startTime.split(':')[1]);
      const endHour = parseInt(range.endTime.split(':')[0]);
      const endMinute = parseInt(range.endTime.split(':')[1]);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += range.slotDuration) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        if (hour < 12) {
          morning.push(timeStr);
        } else {
          evening.push(timeStr);
        }
      }
    });

    return { morning, evening };
  };

  const generatePreviewSlots = (): SlotPreview[] => {
    const preview: SlotPreview[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(previewWeekStart);
      currentDate.setDate(previewWeekStart.getDate() + i);
      
      const dayName = daysOfWeek[i].shortLabel;
      const dayKey = daysOfWeek[i].key;
      const availability = getAvailabilityForDay(dayKey);
      
      if (availability.isAvailable && availability.timeRanges?.length) {
        const slots = generateSlots(availability.timeRanges);
        preview.push({
          date: currentDate.getDate().toString().padStart(2, '0'),
          dayName,
          morning: slots.morning,
          evening: slots.evening
        });
      } else {
        preview.push({
          date: currentDate.getDate().toString().padStart(2, '0'),
          dayName,
          morning: [],
          evening: []
        });
      }
    }
    
    return preview;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(previewWeekStart);
    newDate.setDate(previewWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setPreviewWeekStart(newDate);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const validAvailabilities = availabilities.filter(av => av.isAvailable);
      await availabilityService.saveSchedule(validAvailabilities, doctorBranch.id);
      toast.success("Schedule saved successfully");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const previewSlots = generatePreviewSlots();

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Weekly Schedule</h3>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>

          <div className="space-y-4">
            {daysOfWeek.map((day) => {
              const availability = getAvailabilityForDay(day.key);
              
              return (
                <Card key={day.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{day.label}</CardTitle>
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`available-${day.key}`} className="text-sm">
                          Available
                        </Label>
                        <Switch
                          id={`available-${day.key}`}
                          checked={availability.isAvailable}
                          onCheckedChange={(checked) => 
                            updateAvailability(day.key, { isAvailable: checked })
                          }
                        />
                      </div>
                    </div>
                  </CardHeader>

                  {availability.isAvailable && (
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`release-${day.key}`} className="text-sm">
                            Release Time:
                          </Label>
                          <Input
                            id={`release-${day.key}`}
                            type="time"
                            value={availability.releaseTime}
                            onChange={(e) => 
                              updateAvailability(day.key, { releaseTime: e.target.value })
                            }
                            className="w-32"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Time Ranges</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeRange(day.key)}
                          >
                            Add Range
                          </Button>
                        </div>

                        {availability.timeRanges?.map((range, index) => (
                          <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
                            <div>
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={range.startTime}
                                onChange={(e) => 
                                  updateTimeRange(day.key, index, { startTime: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={range.endTime}
                                onChange={(e) => 
                                  updateTimeRange(day.key, index, { endTime: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Duration (min)</Label>
                              <Input
                                type="number"
                                value={range.slotDuration}
                                onChange={(e) => 
                                  updateTimeRange(day.key, index, { slotDuration: parseInt(e.target.value) })
                                }
                                min="5"
                                max="120"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                value={range.slotQuantity}
                                onChange={(e) => 
                                  updateTimeRange(day.key, index, { slotQuantity: parseInt(e.target.value) })
                                }
                                min="1"
                                max="10"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeRange(day.key, index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slot Preview Sidebar */}
      <div className="w-80 sticky top-4 h-fit">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Slot Preview
              </CardTitle>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                {previewWeekStart.toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {previewSlots.map((slot, index) => {
                const isToday = slot.dayName === daysOfWeek[new Date().getDay() - 1]?.shortLabel;
                return (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <div className="font-medium">{slot.dayName}</div>
                    <div className="text-lg font-bold">{slot.date}</div>
                    <div className="text-xs opacity-75">Aug</div>
                  </div>
                );
              })}
            </div>

            {/* Morning Slots */}
            {previewSlots.some(slot => slot.morning.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Morning
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {previewSlots.reduce((acc, slot) => acc + slot.morning.length, 0)} SLOTS
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {previewSlots
                    .flatMap(slot => slot.morning)
                    .slice(0, 9)
                    .map((time, index) => (
                      <div
                        key={index}
                        className={`p-2 text-xs text-center rounded border ${
                          index === 0 ? 'border-primary bg-primary/10' : 'border-border bg-background'
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                </div>

                {previewSlots.flatMap(slot => slot.morning).length > 9 && (
                  <button className="w-full text-xs text-primary hover:underline">
                    View More Slots
                  </button>
                )}
              </div>
            )}

            {/* Evening Slots */}
            {previewSlots.some(slot => slot.evening.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Evening
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {previewSlots.reduce((acc, slot) => acc + slot.evening.length, 0)} SLOTS
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {previewSlots
                    .flatMap(slot => slot.evening)
                    .slice(0, 9)
                    .map((time, index) => (
                      <div
                        key={index}
                        className="p-2 text-xs text-center rounded border border-border bg-background"
                      >
                        {time}
                      </div>
                    ))}
                </div>

                {previewSlots.flatMap(slot => slot.evening).length > 9 && (
                  <button className="w-full text-xs text-primary hover:underline">
                    View More Slots
                  </button>
                )}
              </div>
            )}

            {previewSlots.every(slot => slot.morning.length === 0 && slot.evening.length === 0) && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No slots available</p>
                <p className="text-xs">Configure availability to see slots</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyScheduleTab;
