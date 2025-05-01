
import React, { useState, useEffect, useCallback } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RovingFocusGroup } from "@radix-ui/react-roving-focus";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import PatientReportService from '../../services/patientReportService';

export interface AudiometryDataPoint {
  frequency: number;
  threshold: number;
}

export interface AudiometryEarData {
  airConduction: AudiometryDataPoint[];
  boneConduction: AudiometryDataPoint[];
}

export interface Audiogram {
  id: string;
  rightEar: AudiometryEarData;
  leftEar: AudiometryEarData;
  notes?: string;
  date?: Date;
}

export interface AudiometryFormProps {
  patientId?: number;
  onCancel: () => void;
  onSave: (audiogram: Audiogram) => void;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialEarData = {
  airConduction: [
    { frequency: 250, threshold: 0 },
    { frequency: 500, threshold: 0 },
    { frequency: 1000, threshold: 0 },
    { frequency: 2000, threshold: 0 },
    { frequency: 4000, threshold: 0 },
    { frequency: 8000, threshold: 0 },
  ],
  boneConduction: [
    { frequency: 250, threshold: 0 },
    { frequency: 500, threshold: 0 },
    { frequency: 1000, threshold: 0 },
    { frequency: 2000, threshold: 0 },
    { frequency: 4000, threshold: 0 },
  ],
};

const AudiometryForm: React.FC<AudiometryFormProps> = ({ patientId, onCancel, onSave, open, onOpenChange }) => {
  const [audiogram, setAudiogram] = useState<Audiogram>({
    id: uuidv4(),
    rightEar: { ...initialEarData },
    leftEar: { ...initialEarData },
  });
  const [reportId, setReportId] = useState<string | null>(null);
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    if (!open) {
      setAudiogram({
        id: uuidv4(),
        rightEar: { ...initialEarData },
        leftEar: { ...initialEarData },
      });
      setDate(new Date());
    }
  }, [open]);

  useEffect(() => {
    const fetchReportData = async () => {
      // Mock implementation for fetching report data
      // Replace with your actual API call
      // This is just an example, adapt it to your needs
      if (reportId) {
        try {
          const reportData = await PatientReportService.getReportById(reportId);
          console.log("Report Data:", reportData);
          if (reportData) {
            // Assuming the reportData structure matches the Audiogram structure
            setAudiogram({
              id: reportData.id,
              rightEar: reportData.rightEar,
              leftEar: reportData.leftEar,
              notes: reportData.notes,
            });
            setDate(reportData.date ? new Date(reportData.date) : undefined);
          }
        } catch (error) {
          console.error("Error fetching report:", error);
        }
      }
    };
    fetchReportData();
  }, [reportId]);

  const handleThresholdChange = (ear: 'rightEar' | 'leftEar', type: 'airConduction' | 'boneConduction', frequency: number, threshold: number) => {
    setAudiogram(prev => {
      const updatedEar = { ...prev[ear] };
      const dataPointIndex = updatedEar[type].findIndex(dp => dp.frequency === frequency);
      if (dataPointIndex !== -1) {
        updatedEar[type][dataPointIndex] = { frequency, threshold };
      }
      return { ...prev, [ear]: updatedEar };
    });
  };

  // Fix the notes change handler to use textarea
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAudiogram(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleSave = async () => {
    try {
      let savedReport;
      if (reportId) {
        savedReport = await PatientReportService.updateReport({
          id: audiogram.id,
          type: "audiometry",
          patientId: patientId,
          rightEar: audiogram.rightEar,
          leftEar: audiogram.leftEar,
          notes: audiogram.notes,
          date: date,
        });
      } else {
        savedReport = await PatientReportService.createReport({
          id: audiogram.id,
          type: "audiometry",
          patientId: patientId,
          rightEar: audiogram.rightEar,
          leftEar: audiogram.leftEar,
          notes: audiogram.notes,
          date: date,
        });
      }

      toast({
        title: "Audiometry report saved",
        description: `Report ${savedReport.id} has been saved successfully.`,
      });
      onSave(audiogram);
      onCancel();
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        variant: "destructive",
        title: "Error saving audiometry report",
        description: "There was an error saving the report. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Right Ear</CardTitle>
          <CardDescription>Air Conduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {audiogram.rightEar.airConduction.map((dataPoint) => (
              <div key={`right-air-${dataPoint.frequency}`} className="flex items-center space-x-2">
                <Label htmlFor={`right-air-${dataPoint.frequency}`}>{dataPoint.frequency} Hz</Label>
                <Input
                  type="number"
                  id={`right-air-${dataPoint.frequency}`}
                  value={dataPoint.threshold}
                  onChange={(e) => handleThresholdChange('rightEar', 'airConduction', dataPoint.frequency, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Right Ear</CardTitle>
          <CardDescription>Bone Conduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {audiogram.rightEar.boneConduction.map((dataPoint) => (
              <div key={`right-bone-${dataPoint.frequency}`} className="flex items-center space-x-2">
                <Label htmlFor={`right-bone-${dataPoint.frequency}`}>{dataPoint.frequency} Hz</Label>
                <Input
                  type="number"
                  id={`right-bone-${dataPoint.frequency}`}
                  value={dataPoint.threshold}
                  onChange={(e) => handleThresholdChange('rightEar', 'boneConduction', dataPoint.frequency, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Left Ear</CardTitle>
          <CardDescription>Air Conduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {audiogram.leftEar.airConduction.map((dataPoint) => (
              <div key={`left-air-${dataPoint.frequency}`} className="flex items-center space-x-2">
                <Label htmlFor={`left-air-${dataPoint.frequency}`}>{dataPoint.frequency} Hz</Label>
                <Input
                  type="number"
                  id={`left-air-${dataPoint.frequency}`}
                  value={dataPoint.threshold}
                  onChange={(e) => handleThresholdChange('leftEar', 'airConduction', dataPoint.frequency, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Left Ear</CardTitle>
          <CardDescription>Bone Conduction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {audiogram.leftEar.boneConduction.map((dataPoint) => (
              <div key={`left-bone-${dataPoint.frequency}`} className="flex items-center space-x-2">
                <Label htmlFor={`left-bone-${dataPoint.frequency}`}>{dataPoint.frequency} Hz</Label>
                <Input
                  type="number"
                  id={`left-bone-${dataPoint.frequency}`}
                  value={dataPoint.threshold}
                  onChange={(e) => handleThresholdChange('leftEar', 'boneConduction', dataPoint.frequency, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Additional notes about the audiometry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={audiogram.notes || ""}
                onChange={handleNotesChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date</CardTitle>
          <CardDescription>Date of the audiometry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
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
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default AudiometryForm;
