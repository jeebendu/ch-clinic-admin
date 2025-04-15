
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClockIcon } from "lucide-react";

export interface TimeValue {
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value = "09:00 AM", onChange, className }: TimePickerProps) {
  // Parse the initial value
  const initialTime = parseTimeString(value);
  
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(initialTime.period);

  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? "12" : String(i).padStart(2, "0")));
  const minutes = ["00", "15", "30", "45"];

  const handleSelect = () => {
    const formattedTime = `${hour}:${minute} ${period}`;
    onChange(formattedTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[180px] justify-start text-left font-normal", className)}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Hour</span>
              <div className="grid grid-cols-3 gap-1">
                {hours.map((h) => (
                  <Button
                    key={h}
                    variant={h === hour ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHour(h)}
                    className="h-8 text-xs"
                  >
                    {h}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Minute</span>
              <div className="grid grid-cols-2 gap-1">
                {minutes.map((m) => (
                  <Button
                    key={m}
                    variant={m === minute ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinute(m)}
                    className="h-8 text-xs"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">AM/PM</span>
              <div className="grid grid-cols-1 gap-1">
                <Button
                  variant={period === "AM" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("AM")}
                  className="h-8"
                >
                  AM
                </Button>
                <Button
                  variant={period === "PM" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("PM")}
                  className="h-8"
                >
                  PM
                </Button>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={handleSelect}>
            Select Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Helper function to parse a time string like "09:00 AM"
function parseTimeString(timeString: string): TimeValue {
  const [timePart, periodPart] = timeString.split(" ");
  const [hourPart, minutePart] = timePart.split(":");
  
  return {
    hour: hourPart,
    minute: minutePart,
    period: periodPart as "AM" | "PM"
  };
}
