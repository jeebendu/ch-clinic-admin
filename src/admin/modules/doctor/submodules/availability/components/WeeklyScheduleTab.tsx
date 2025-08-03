import React, { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Calendar } from "lucide-react";
import { add, format, sub } from "date-fns";
import { enUS } from "date-fns/locale";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDateRangePicker } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TimePicker } from "@/admin/components/TimePicker";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const weeklyScheduleSchema = z.object({
  schedule: z.array(
    z.object({
      day: z.string(),
      timeRanges: z.array(
        z.object({
          startTime: z.string(),
          endTime: z.string(),
        })
      ),
    })
  ),
});

type WeeklyScheduleValues = z.infer<typeof weeklyScheduleSchema>;

interface WeeklyScheduleTabProps {
  onSubmit: (values: WeeklyScheduleValues) => void;
  initialValues?: WeeklyScheduleValues;
}

export function WeeklyScheduleTab({ onSubmit, initialValues }: WeeklyScheduleTabProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [isSpecificDate, setIsSpecificDate] = useState(false);
  const [isRange, setIsRange] = useState(false);
  const [isTime, setIsTime] = useState(false);
  const [isException, setIsException] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isWeekly, setIsWeekly] = useState(true);
  const [isMonthly, setIsMonthly] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [isEvery, setIsEvery] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeRanges, setTimeRanges] = useState([
    { startTime: "09:00", endTime: "17:00" },
  ]);
  const [range, setRange] = useState<Date | undefined>({
    from: new Date(),
    to: add(new Date(), { days: 20 }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<WeeklyScheduleValues>({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const handleDayToggle = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: "09:00", endTime: "17:00" }]);
  };

  const handleRemoveTimeRange = (index: number) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  const handleTimeRangeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setTimeRanges((prevTimeRanges) =>
      prevTimeRanges.map((timeRange, i) =>
        i === index ? { ...timeRange, [field]: value } : timeRange
      )
    );
  };

  const onSubmitHandler = (data: WeeklyScheduleValues) => {
    console.log(data);
    onSubmit(data);
  };

  useEffect(() => {
    // When selectedDays or timeRanges change, update the form values
    if (selectedDays.length > 0) {
      const newSchedule = selectedDays.map((day) => ({
        day: day,
        timeRanges: timeRanges,
      }));
      setValue("schedule", newSchedule);
    }
  }, [selectedDays, timeRanges, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarDateRangePicker
                date={date}
                onSelect={setDate}
                mode="single"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Recurrence</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecurrent ? "default" : "outline"}
              onClick={() => setIsRecurrent(!isRecurrent)}
            >
              {isRecurrent ? "Recurrent" : "One Time"}
            </Button>
          </div>
        </div>
      </div>

      {isRecurrent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={isSpecificDate ? "default" : "outline"}
                onClick={() => {
                  setIsSpecificDate(true);
                  setIsRange(false);
                }}
              >
                Specific Date
              </Button>
              <Button
                variant={isRange ? "default" : "outline"}
                onClick={() => {
                  setIsRange(true);
                  setIsSpecificDate(false);
                }}
              >
                Range
              </Button>
            </div>
          </div>

          <div>
            <Label>Time</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={isTime ? "default" : "outline"}
                onClick={() => setIsTime(!isTime)}
              >
                Time
              </Button>
              <Button
                variant={isException ? "default" : "outline"}
                onClick={() => setIsException(!isException)}
              >
                Exception
              </Button>
              <Button
                variant={isAllDay ? "default" : "outline"}
                onClick={() => setIsAllDay(!isAllDay)}
              >
                All Day
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSpecificDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDateRangePicker
                  date={date}
                  onSelect={setDate}
                  mode="single"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {isRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !range?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {range?.from ? format(range.from, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDateRangePicker
                  date={range}
                  onSelect={(date) =>
                    setRange({
                      from: date,
                      to: range?.to,
                    })
                  }
                  mode="single"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="to">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !range?.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {range?.to ? format(range.to, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDateRangePicker
                  date={range}
                  onSelect={(date) =>
                    setRange({
                      from: range?.from,
                      to: date,
                    })
                  }
                  mode="single"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {isTime && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Time</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={isCustom ? "default" : "outline"}
                onClick={() => setIsCustom(!isCustom)}
              >
                Custom
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCustom && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Recurrence Pattern</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={isWeekly ? "default" : "outline"}
                onClick={() => {
                  setIsWeekly(true);
                  setIsMonthly(false);
                  setIsYearly(false);
                }}
              >
                Weekly
              </Button>
              <Button
                variant={isMonthly ? "default" : "outline"}
                onClick={() => {
                  setIsMonthly(true);
                  setIsWeekly(false);
                  setIsYearly(false);
                }}
              >
                Monthly
              </Button>
              <Button
                variant={isYearly ? "default" : "outline"}
                onClick={() => {
                  setIsYearly(true);
                  setIsWeekly(false);
                  setIsMonthly(false);
                }}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>
      )}

      {isWeekly && isCustom && (
        <div>
          <Label>Select Days</Label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? "default" : "outline"}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isWeekly && isCustom && (
        <div>
          <Label>Time Ranges</Label>
          {timeRanges.map((timeRange, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              
              <TimePicker
                value={timeRange.startTime}
                onChange={(time) => handleTimeRangeChange(index, 'startTime', time)}
                placeholder="Start time"
              />

              
              <TimePicker
                value={timeRange.endTime}
                onChange={(time) => handleTimeRangeChange(index, 'endTime', time)}
                placeholder="End time"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveTimeRange(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={handleAddTimeRange}>
            Add Time Range
          </Button>
        </div>
      )}

      <Button type="submit">Submit</Button>
    </form>
  );
}
