
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { TimeRange } from "../types/DoctorAvailability";
import { ClockTimePicker } from "@/admin/components/ClockTimePicker";

interface TimeRangeRowProps {
  timeRange: TimeRange;
  onUpdate: (id: string, updates: Partial<TimeRange>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  isDisabled?: boolean;
  releaseType: string;
}

const TimeRangeRow: React.FC<TimeRangeRowProps> = ({
  timeRange,
  onUpdate,
  onDelete,
  canDelete,
  isDisabled = false,
  releaseType
}) => {
  return (
    <div className="grid grid-cols-6 gap-3 items-end p-3 border rounded-lg bg-gray-50">
      {/* Start Time */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Start Time</Label>
        <ClockTimePicker
          value={timeRange.startTime}
          onChange={(value) => onUpdate(timeRange.id, { startTime: value })}
          disabled={isDisabled}
        />
      </div>

      {/* End Time */}
      <div>
        <Label className="text-sm font-medium mb-1 block">End Time</Label>
        <ClockTimePicker
          value={timeRange.endTime}
          onChange={(value) => onUpdate(timeRange.id, { endTime: value })}
          disabled={isDisabled}
        />
      </div>

      {/* Slot Duration */}
      <div>
        <Label className="text-sm font-medium mb-1 block">Duration (min)</Label>
        <Input
          type="number"
          min={5}
          step={5}
          value={timeRange.slotDuration}
          onChange={(e) => onUpdate(timeRange.id, { slotDuration: Number(e.target.value) })}
          disabled={isDisabled}
          className="h-10"
        />
      </div>

      {/* Slot Quantity */}
      <div>
        <Label className="text-sm font-medium mb-1 block">
          {releaseType === "COUNTWISE" ? "Max Patients" : "Slots"}
        </Label>
        <Input
          type="number"
          min={1}
          value={timeRange.slotQuantity}
          onChange={(e) => onUpdate(timeRange.id, { slotQuantity: Number(e.target.value) })}
          disabled={isDisabled}
          className="h-10"
        />
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
