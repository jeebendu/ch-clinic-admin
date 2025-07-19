
import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState("09");
  const [minutes, setMinutes] = useState("00");

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h.padStart(2, "0"));
      setMinutes(m.padStart(2, "0"));
    }
  }, [value]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const formattedTime = `${newHours.padStart(2, "0")}:${newMinutes.padStart(2, "0")}`;
    onChange(formattedTime);
    setOpen(false); // Close the popover after time selection
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        times.push({
          hour: h.toString().padStart(2, "0"),
          minute: m.toString().padStart(2, "0"),
          display: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium">Hours</label>
              <Input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Minutes</label>
              <Input
                type="number"
                min="0"
                max="59"
                step="15"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleTimeChange(hours, minutes)}
            >
              Set Time
            </Button>
          </div>
          <div className="mt-4 max-h-48 overflow-y-auto">
            <div className="text-xs font-medium text-gray-500 mb-2">Quick Select:</div>
            <div className="grid grid-cols-4 gap-1">
              {timeOptions.filter((_, index) => index % 4 === 0).map((time) => (
                <Button
                  key={time.display}
                  variant="ghost"
                  size="sm"
                  className="text-xs p-1 h-8"
                  onClick={() => handleTimeChange(time.hour, time.minute)}
                >
                  {time.display}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
