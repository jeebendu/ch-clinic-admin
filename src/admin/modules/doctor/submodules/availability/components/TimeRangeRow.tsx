import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertCircle } from "lucide-react";
import { TimeRange } from "../types/DoctorAvailability";
import { TimePicker } from "@/admin/components/TimePicker";

interface TimeRangeRowProps {
  timeRange: TimeRange;
  onUpdate: (id: number, updates: Partial<TimeRange>) => void;
  onDelete: (id: number) => void;
  canDelete: boolean;
  isDisabled?: boolean;
  releaseType: string;
  duration?: string;
  totalSlots?: number;
  allTimeRanges: TimeRange[];
  hasValidationError?: boolean;
}

const TimeRangeRow: React.FC<TimeRangeRowProps> = ({
  timeRange,
  onUpdate,
  onDelete,
  canDelete,
  isDisabled = false,
  releaseType,
  duration,
  totalSlots,
  allTimeRanges,
  hasValidationError
}) => {
  const handleSlotDurationChange = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 5) {
      onUpdate(timeRange.id, { slotDuration: numValue });
    }
  };

  const handleSlotQuantityChange = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 1) {
      onUpdate(timeRange.id, { slotQuantity: numValue });
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updates = { [field]: value };
    
    // Check for overlaps with other time ranges
    const wouldOverlap = allTimeRanges.some(range => {
      if (range.id === timeRange.id) return false;
      
      const newRange = { ...timeRange, ...updates };
      const newStart = new Date(`2000-01-01T${newRange.startTime}:00`);
      const newEnd = new Date(`2000-01-01T${newRange.endTime}:00`);
      const existingStart = new Date(`2000-01-01T${range.startTime}:00`);
      const existingEnd = new Date(`2000-01-01T${range.endTime}:00`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });
    
    if (wouldOverlap) {
      // Don't update if it would create an overlap
      return;
    }
    
    onUpdate(timeRange.id, updates);
  };

  // Calculate grid columns based on release type
  const gridCols = releaseType === "TIMEWISE" ? "grid-cols-7" : "grid-cols-6";

  return (
    <div className={`grid ${gridCols} gap-3 items-end p-3 border rounded-lg ${hasValidationError ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
      {/* Start Time */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Start Time</Label>
        <TimePicker
          value={timeRange.startTime}
          onChange={(value) => handleTimeChange('startTime', value)}
          disabled={isDisabled}
        />
      </div>

      {/* End Time */}
      <div>
        <Label className="text-sm font-medium mb-1 block">End Time</Label>
        <TimePicker
          value={timeRange.endTime}
          onChange={(value) => handleTimeChange('endTime', value)}
          disabled={isDisabled}
        />
      </div>

      {/* Duration Display */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Duration</Label>
        <div className={`h-10 px-3 py-2 rounded-md border flex items-center text-sm font-medium ${
          hasValidationError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {duration || "0min"}
        </div>
      </div>

      {/* Slot Duration or Max Patients */}
      <div>
        <Label className="text-sm font-medium mb-1 block">
          {releaseType === "COUNTWISE" ? "Max Patients/Hr" : "Slot Duration (min)"}
        </Label>
        <Input
          type="number"
          min={releaseType === "COUNTWISE" ? 1 : 5}
          step={releaseType === "COUNTWISE" ? 1 : 5}
          value={releaseType === "COUNTWISE" ? timeRange.slotQuantity : timeRange.slotDuration}
          onChange={(e) => 
            releaseType === "COUNTWISE" 
              ? handleSlotQuantityChange(e.target.value)
              : handleSlotDurationChange(e.target.value)
          }
          disabled={isDisabled}
          className="h-10"
        />
      </div>

      {/* Total Slots Display */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Total Slots</Label>
        <div className={`h-10 px-3 py-2 rounded-md border flex items-center text-sm font-medium ${
          hasValidationError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {totalSlots || 0}
        </div>
      </div>

      

      {/* Actions */}
      <div className="flex justify-end">
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(timeRange.id)}
            disabled={isDisabled}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeRangeRow;
