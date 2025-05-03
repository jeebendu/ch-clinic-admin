
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Define the frequency levels for audiometry testing
const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];

// Define the hearing threshold range
const MIN_THRESHOLD = -10;
const MAX_THRESHOLD = 120;

interface AudiogramProps {
  onSave?: (data: AudiogramData) => void;
  initialData?: AudiogramData;
}

export interface AudiogramData {
  rightEar: Record<number, number | null>;
  leftEar: Record<number, number | null>;
  testDate: string;
  testType: string;
  notes: string;
}

export const Audiogram: React.FC<AudiogramProps> = ({ onSave, initialData }) => {
  const { toast } = useToast();
  
  // Initialize with empty data or provided initial data
  const [audiogramData, setAudiogramData] = useState<AudiogramData>(() => {
    if (initialData) return initialData;
    
    // Create empty data structure
    const emptyEarData = FREQUENCIES.reduce((acc, freq) => {
      acc[freq] = null;
      return acc;
    }, {} as Record<number, number | null>);
    
    return {
      rightEar: { ...emptyEarData },
      leftEar: { ...emptyEarData },
      testDate: new Date().toISOString().split('T')[0],
      testType: "Pure Tone Audiometry",
      notes: ""
    };
  });
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Handle input change for threshold values
  const handleThresholdChange = (
    ear: 'rightEar' | 'leftEar', 
    frequency: number, 
    value: string
  ) => {
    // Remove any non-numeric characters except minus sign
    const cleanedValue = value.replace(/[^0-9-]/g, '');
    
    // Parse as integer
    let numValue = parseInt(cleanedValue, 10);
    
    // Handle special cases
    if (cleanedValue === '' || cleanedValue === '-') {
      // Allow empty input or lone minus sign during typing
      setAudiogramData(prev => ({
        ...prev,
        [ear]: {
          ...prev[ear],
          [frequency]: cleanedValue === '' ? null : cleanedValue
        }
      }));
      return;
    }
    
    // Validate the numeric input
    if (isNaN(numValue)) {
      return; // Ignore invalid input
    }
    
    // Clamp value within valid range
    if (numValue < MIN_THRESHOLD) numValue = MIN_THRESHOLD;
    if (numValue > MAX_THRESHOLD) numValue = MAX_THRESHOLD;
    
    // Update the value
    setAudiogramData(prev => ({
      ...prev,
      [ear]: {
        ...prev[ear],
        [frequency]: numValue
      }
    }));
  };
  
  // Handle input blur to clean up any partial inputs
  const handleBlur = (ear: 'rightEar' | 'leftEar', frequency: number) => {
    const currentValue = audiogramData[ear][frequency];
    
    // If the value is a string (like lone minus sign), convert to null
    if (typeof currentValue === 'string') {
      setAudiogramData(prev => ({
        ...prev,
        [ear]: {
          ...prev[ear],
          [frequency]: null
        }
      }));
    }
  };
  
  const handleSave = () => {
    // Validate that all required fields are filled
    let isValid = true;
    const errors = [];
    
    if (!audiogramData.testDate) {
      errors.push("Test date is required");
      isValid = false;
    }
    
    if (!audiogramData.testType) {
      errors.push("Test type is required");
      isValid = false;
    }
    
    // Check if at least one threshold value is filled
    const hasThresholdValues = [
      ...Object.values(audiogramData.rightEar), 
      ...Object.values(audiogramData.leftEar)
    ].some(value => value !== null);
    
    if (!hasThresholdValues) {
      errors.push("At least one threshold value must be provided");
      isValid = false;
    }
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errors.join(". "),
        variant: "destructive"
      });
      return;
    }
    
    // Save data if all validations pass
    if (onSave) {
      onSave(audiogramData);
    }
    
    toast({
      title: "Audiogram Saved",
      description: "Audiogram data has been saved successfully."
    });
  };
  
  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audiogram Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="testDate">Test Date</Label>
              <Input
                type="date"
                id="testDate"
                value={audiogramData.testDate}
                onChange={(e) => setAudiogramData(prev => ({ ...prev, testDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select 
                value={audiogramData.testType} 
                onValueChange={(value) => setAudiogramData(prev => ({ ...prev, testType: value }))}
              >
                <SelectTrigger id="testType">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pure Tone Audiometry">Pure Tone Audiometry</SelectItem>
                  <SelectItem value="Speech Audiometry">Speech Audiometry</SelectItem>
                  <SelectItem value="Impedance Audiometry">Impedance Audiometry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Frequency (Hz)</TableHead>
                  <TableHead className="text-center">Right Ear (dB)</TableHead>
                  <TableHead className="text-center">Left Ear (dB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FREQUENCIES.map((freq) => (
                  <TableRow key={freq}>
                    <TableCell className="font-medium">{freq}</TableCell>
                    <TableCell>
                      <Input
                        value={audiogramData.rightEar[freq] === null ? '' : audiogramData.rightEar[freq]}
                        onChange={(e) => handleThresholdChange('rightEar', freq, e.target.value)}
                        onBlur={() => handleBlur('rightEar', freq)}
                        className="w-full text-center"
                        placeholder="dB"
                        type="text" // Use text, but we'll validate to only allow numbers
                        inputMode="numeric"
                        min={MIN_THRESHOLD}
                        max={MAX_THRESHOLD}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={audiogramData.leftEar[freq] === null ? '' : audiogramData.leftEar[freq]}
                        onChange={(e) => handleThresholdChange('leftEar', freq, e.target.value)}
                        onBlur={() => handleBlur('leftEar', freq)}
                        className="w-full text-center"
                        placeholder="dB"
                        type="text" // Use text, but we'll validate to only allow numbers
                        inputMode="numeric"
                        min={MIN_THRESHOLD}
                        max={MAX_THRESHOLD}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              className="w-full border rounded-md p-2"
              value={audiogramData.notes}
              onChange={(e) => setAudiogramData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" className="mr-2">Cancel</Button>
            <Button onClick={handleSave}>Save Audiogram</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Audiogram Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button 
              variant={selectedImage === "acmr" ? "default" : "outline"} 
              onClick={() => handleImageSelect("acmr")}
              className="text-xs h-auto py-2"
            >
              Air Conduction Masked (Right)
            </Button>
            <Button 
              variant={selectedImage === "acml" ? "default" : "outline"} 
              onClick={() => handleImageSelect("acml")}
              className="text-xs h-auto py-2"
            >
              Air Conduction Masked (Left)
            </Button>
            <Button 
              variant={selectedImage === "acur" ? "default" : "outline"} 
              onClick={() => handleImageSelect("acur")}
              className="text-xs h-auto py-2"
            >
              Air Conduction Unmasked (Right)
            </Button>
            <Button 
              variant={selectedImage === "acul" ? "default" : "outline"} 
              onClick={() => handleImageSelect("acul")}
              className="text-xs h-auto py-2"
            >
              Air Conduction Unmasked (Left)
            </Button>
            <Button 
              variant={selectedImage === "bcmr" ? "default" : "outline"} 
              onClick={() => handleImageSelect("bcmr")}
              className="text-xs h-auto py-2"
            >
              Bone Conduction Masked (Right)
            </Button>
            <Button 
              variant={selectedImage === "bcml" ? "default" : "outline"} 
              onClick={() => handleImageSelect("bcml")}
              className="text-xs h-auto py-2"
            >
              Bone Conduction Masked (Left)
            </Button>
            <Button 
              variant={selectedImage === "bcur" ? "default" : "outline"} 
              onClick={() => handleImageSelect("bcur")}
              className="text-xs h-auto py-2"
            >
              Bone Conduction Unmasked (Right)
            </Button>
            <Button 
              variant={selectedImage === "bcul" ? "default" : "outline"} 
              onClick={() => handleImageSelect("bcul")}
              className="text-xs h-auto py-2"
            >
              Bone Conduction Unmasked (Left)
            </Button>
            <Button 
              variant={selectedImage === "nrr" ? "default" : "outline"} 
              onClick={() => handleImageSelect("nrr")}
              className="text-xs h-auto py-2"
            >
              No Response (Right)
            </Button>
            <Button 
              variant={selectedImage === "nrl" ? "default" : "outline"} 
              onClick={() => handleImageSelect("nrl")}
              className="text-xs h-auto py-2"
            >
              No Response (Left)
            </Button>
          </div>
          
          {selectedImage && (
            <div className="flex justify-center mt-4">
              <img 
                src={`/images/audiogram/${selectedImage}.png`} 
                alt="Audiogram Chart" 
                className="max-w-full h-auto max-h-80" 
              />
            </div>
          )}
          
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Right Ear</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Left Ear</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 border border-black rounded-full mr-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-sm">Masked</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border border-black rounded-full mr-2"></div>
                <span className="text-sm">Unmasked</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Audiogram;
