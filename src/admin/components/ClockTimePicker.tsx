
import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ClockTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hours" | "minutes">("hours");
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const handleClockClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;

    if (mode === "hours") {
      const hour = Math.round(angle / 30) % 12;
      setHours(hour === 0 ? 12 : hour);
      setMode("minutes");
    } else {
      const minute = Math.round(angle / 6) % 60;
      setMinutes(minute);
    }
  };

  const handleConfirm = () => {
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    onChange(formattedTime);
    setOpen(false);
  };

  const renderClockNumbers = () => {
    const numbers = mode === "hours" ? Array.from({length: 12}, (_, i) => i + 1) : Array.from({length: 12}, (_, i) => i * 5);
    
    return numbers.map((num, index) => {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const radius = 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const isSelected = mode === "hours" ? num === hours : num === minutes;
      
      return (
        <div
          key={num}
          className={`absolute w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-colors ${
            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
          style={{
            left: `calc(50% + ${x}px - 16px)`,
            top: `calc(50% + ${y}px - 16px)`,
          }}
          onClick={() => {
            if (mode === "hours") {
              setHours(num);
              setMode("minutes");
            } else {
              setMinutes(num);
            }
          }}
        >
          {num.toString().padStart(2, "0")}
        </div>
      );
    });
  };

  const renderClockHand = () => {
    const currentValue = mode === "hours" ? hours : minutes;
    const maxValue = mode === "hours" ? 12 : 60;
    const angle = ((currentValue * (360 / maxValue)) - 90) * (Math.PI / 180);
    const radius = 60;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
      <>
        {/* Clock hand */}
        <div
          className="absolute w-0.5 bg-primary origin-bottom"
          style={{
            left: "50%",
            top: "50%",
            height: `${radius}px`,
            transform: `translate(-50%, -100%) rotate(${(currentValue * (360 / maxValue)) - 90}deg)`,
          }}
        />
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-primary rounded-full" style={{
          left: "calc(50% - 6px)",
          top: "calc(50% - 6px)",
        }} />
        {/* End dot */}
        <div
          className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background"
          style={{
            left: `calc(50% + ${x}px - 8px)`,
            top: `calc(50% + ${y}px - 8px)`,
          }}
        />
      </>
    );
  };

  const quickTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

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
          {/* Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <button
                className={`px-2 py-1 rounded ${mode === "hours" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setMode("hours")}
              >
                {hours.toString().padStart(2, "0")}
              </button>
              <span>:</span>
              <button
                className={`px-2 py-1 rounded ${mode === "minutes" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setMode("minutes")}
              >
                {minutes.toString().padStart(2, "0")}
              </button>
            </div>
          </div>

          {/* Clock Face */}
          <div className="relative mx-auto mb-4" style={{ width: "200px", height: "200px" }}>
            <div
              ref={clockRef}
              className="w-full h-full rounded-full border-2 border-muted relative cursor-pointer"
              onClick={handleClockClick}
            >
              {renderClockNumbers()}
              {renderClockHand()}
            </div>
          </div>

          {/* AM/PM Toggle */}
          <div className="flex justify-center mb-4">
            <div className="flex rounded-md border">
              <button
                className={`px-3 py-1 text-xs font-medium rounded-l-md ${
                  hours < 12 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => {
                  setHours(prev => prev > 12 ? prev - 12 : prev);
                }}
              >
                AM
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-r-md ${
                  hours >= 12 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => {
                  setHours(prev => prev < 12 ? prev + 12 : prev);
                }}
              >
                PM
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
            >
              OK
            </Button>
          </div>

          {/* Quick Select */}
          <div className="border-t pt-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Quick Select:</div>
            <div className="grid grid-cols-3 gap-1">
              {quickTimes.map((time) => (
                <Button
                  key={time}
                  variant="ghost"
                  size="sm"
                  className="text-xs p-1 h-7"
                  onClick={() => {
                    onChange(time);
                    setOpen(false);
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
