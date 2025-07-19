
import React from "react";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/admin/components/TimePicker";
import { Trash2 } from "lucide-react";
import { TimeRange } from "../types/DoctorAvailability";

interface TimeRangeRowProps {
  timeRange: TimeRange;
  onUpdate: (id: string, updates: Partial<TimeRange>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  isDisabled: boolean;
  releaseType: string;
}

const TimeRangeRow: React.FC<TimeRangeRowProps> = ({
  timeRange,
  onUpdate,
  onDelete,
  canDelete,
  isDisabled,
  releaseType
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Start Time</label>
          <TimePicker
            value={timeRange.startTime}
            onChange={(value) => onUpdate(timeRange.id, { startTime: value })}
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">End Time</label>
          <TimePicker
            value={timeRange.endTime}
            onChange={(value) => onUpdate(timeRange.id, { endTime: value })}
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Duration</label>
          <select
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={timeRange.slotDuration}
            onChange={(e) => onUpdate(timeRange.id, { slotDuration: parseInt(e.target.value) })}
            disabled={isDisabled}
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Quantity</label>
          <input
            type="number"
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={timeRange.slotQuantity}
            onChange={(e) => onUpdate(timeRange.id, { slotQuantity: parseInt(e.target.value) })}
            disabled={isDisabled || releaseType === "TIMEWISE"}
            placeholder="Enter slots"
            min={1}
            step={1}
          />
        </div>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(timeRange.id)}
          disabled={isDisabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TimeRangeRow;
