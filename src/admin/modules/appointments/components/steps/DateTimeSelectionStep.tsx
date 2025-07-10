
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slot } from "../../types/Slot";
import { Appointment } from "../../types/Appointment";

interface DateTimeSelectionStepProps {
  slotList: Slot[];
  appointmentObj: Appointment;
  handleSlotClick: (slot: Slot) => void;
  onDateSelectHandler: (date: Date) => void;
}

export function DateTimeSelectionStep({
  slotList,
  appointmentObj,
  handleSlotClick,
  onDateSelectHandler
}: DateTimeSelectionStepProps) {
  // const [date, setDate] = useState<Date | undefined>(
  //   selectedDate ? new Date(selectedDate) : undefined
  // );
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (appointmentObj && appointmentObj?.slot && appointmentObj?.slot?.date) {
      setDate(new Date(appointmentObj?.slot?.date));
    } else {
      setDate(new Date())
    }
  }, [appointmentObj]);

  const handleDateSelect = (selectedDate: Date) => {
    if (selectedDate && selectedDate != undefined) {
      onDateSelectHandler(selectedDate || new Date());
      setDate(selectedDate);
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24HourFormat = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 100 + minutes; // Return as HHMM for easier comparison
  };

  // Function to categorize slots
  const categorizeSlots = (slotList: Slot[]) => {
    const morningSlots = slotList.filter((slot) => {
      const time24 = convertTo24HourFormat(slot.startTime);
      return time24 >= 0 && time24 < 1200; // 00:00 to 11:59
    });

    const afternoonSlots = slotList.filter((slot) => {
      const time24 = convertTo24HourFormat(slot.startTime);
      return time24 >= 1200 && time24 < 1700; // 12:00 to 16:59
    });

    const eveningSlots = slotList.filter((slot) => {
      const time24 = convertTo24HourFormat(slot.startTime);
      return time24 >= 1700 && time24 <= 2359; // 17:00 to 23:59
    });

    return { morningSlots, afternoonSlots, eveningSlots };
  };

  // Example usage
  const { morningSlots, afternoonSlots, eveningSlots } = categorizeSlots(slotList);
  console.log(morningSlots, afternoonSlots, eveningSlots);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className={cn("p-3 pointer-events-auto mx-auto")}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>
        <div>
          <div className="bg-white rounded-lg border h-full p-4">
            {slotList.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Available Slots</h3>

                {morningSlots.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Morning</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (

                        <Button
                          key={slot.startTime}
                          variant="outline"
                          className={`text-sm h-12 flex flex-col justify-center items-center
                            ${slot.availableSlots <= 0
                              ? "bg-red-500 text-white cursor-not-allowed opacity-60"
                              : appointmentObj?.slot?.startTime === slot.startTime
                                ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                                : ""
                            }`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={slot.availableSlots <= 0}
                        >
                          <p className="text-sm font-medium">
                            {slot?.startTime
                              ? format(new Date(`1970-01-01T${slot.startTime}`), "hh:mm a")
                              : "Time not available"}
                          
                          </p>
                          {slot?.slotType === "COUNTWISE" && (
                            <p className="text-xs text-muted-foreground">{slot.availableSlots} slot(s)</p>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {afternoonSlots.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Afternoon</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (

                        <Button
                          key={slot.startTime}
                          variant="outline"
                          className={`text-sm h-12 flex flex-col justify-center items-center
                            ${slot.availableSlots <= 0
                              ? "bg-red-500 text-white cursor-not-allowed opacity-60"
                              : appointmentObj?.slot?.startTime === slot.startTime
                                ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                                : ""
                            }`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={slot.availableSlots <= 0}
                        >
                          <p className="text-sm font-medium">
                            {slot?.startTime
                              ? format(new Date(`1970-01-01T${slot.startTime}`), "hh:mm a")
                              : "Time not available"}
                          
                          </p>
                          {slot?.slotType === "COUNTWISE" && (
                            <p className="text-xs text-muted-foreground">{slot.availableSlots} slot(s)</p>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {eveningSlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Evening</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {eveningSlots.map((slot) => (

                        <Button
                          key={slot.startTime}
                          variant="outline"
                          className={`text-sm h-12 flex flex-col justify-center items-center
                            ${slot.availableSlots <= 0
                              ? "bg-red-500 text-white cursor-not-allowed opacity-60"
                              : appointmentObj?.slot?.startTime === slot.startTime
                                ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                                : ""
                            }`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={slot.availableSlots <= 0}
                        >
                          <p className="text-sm font-medium">
                            {slot?.startTime
                              ? format(new Date(`1970-01-01T${slot.startTime}`), "hh:mm a")
                              : "Time not available"}
                        
                          </p>
                          {slot?.slotType === "COUNTWISE" && (
                            <p className="text-xs text-muted-foreground">{slot.availableSlots} slot(s)</p>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Please select a date to view available slots</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
