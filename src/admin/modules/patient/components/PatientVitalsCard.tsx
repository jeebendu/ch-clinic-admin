
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VitalSign } from '../types/PatientReport';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FilePlus, Thermometer, Heart, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock data - would be replaced by real API calls
const mockVitalsData: VitalSign[] = [
  {
    id: 1,
    patientId: 1,
    visitId: 1,
    temperature: 98.6,
    bloodPressure: '120/80',
    pulse: 72,
    respiratoryRate: 16,
    spo2: 98,
    weight: 70,
    height: 175,
    bmi: 22.9,
    notes: 'Patient is stable',
    recordedBy: 'Nurse Smith',
    recordedAt: new Date().toISOString()
  },
  {
    id: 2,
    patientId: 1,
    visitId: 2,
    temperature: 99.1,
    bloodPressure: '118/78',
    pulse: 75,
    respiratoryRate: 18,
    spo2: 97,
    weight: 71,
    height: 175,
    bmi: 23.2,
    recordedBy: 'Nurse Johnson',
    recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

interface PatientVitalsCardProps {
  patientId: number;
}

const PatientVitalsCard: React.FC<PatientVitalsCardProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [vitals, setVitals] = useState<VitalSign[]>(mockVitalsData);
  const [isAddVitalsOpen, setIsAddVitalsOpen] = useState(false);
  const [newVital, setNewVital] = useState<VitalSign>({
    patientId,
    recordedAt: new Date().toISOString()
  });

  const handleSaveVitals = () => {
    const updatedVitals = [
      {
        ...newVital,
        id: vitals.length > 0 ? Math.max(...vitals.map(v => v.id || 0)) + 1 : 1,
        recordedBy: 'Current User', // This would come from authentication context in a real app
        recordedAt: new Date().toISOString()
      },
      ...vitals
    ];
    
    setVitals(updatedVitals);
    setIsAddVitalsOpen(false);
    
    toast({
      title: "Vitals Recorded",
      description: "Patient vitals have been recorded successfully."
    });
    
    // Reset form
    setNewVital({
      patientId,
      recordedAt: new Date().toISOString()
    });
  };

  const calculateBMI = () => {
    if (newVital.height && newVital.weight) {
      // Convert height from cm to m and calculate BMI
      const heightInM = newVital.height / 100;
      const bmi = newVital.weight / (heightInM * heightInM);
      setNewVital({
        ...newVital,
        bmi: parseFloat(bmi.toFixed(1))
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVital({
      ...newVital,
      [name]: name === 'notes' ? value : value === '' ? undefined : parseFloat(value)
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Patient Vitals</CardTitle>
              <CardDescription>Recent vital sign measurements</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddVitalsOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {vitals.length > 0 ? (
            <div className="space-y-4">
              {vitals.map((vital) => (
                <div key={vital.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">{formatDate(vital.recordedAt)}</h3>
                    <span className="text-xs text-muted-foreground">
                      Recorded by: {vital.recordedBy}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <VitalDisplay
                      icon={<Thermometer className="h-4 w-4" />}
                      label="Temperature"
                      value={`${vital.temperature}°F`}
                    />
                    <VitalDisplay
                      icon={<Heart className="h-4 w-4" />}
                      label="Blood Pressure"
                      value={vital.bloodPressure || 'N/A'}
                    />
                    <VitalDisplay
                      icon={<Heart className="h-4 w-4" />}
                      label="Pulse"
                      value={`${vital.pulse} bpm`}
                    />
                    <VitalDisplay
                      icon={<ArrowUpDown className="h-4 w-4" />}
                      label="Resp. Rate"
                      value={`${vital.respiratoryRate} bpm`}
                    />
                    <VitalDisplay
                      icon={<Heart className="h-4 w-4" />}
                      label="SpO₂"
                      value={`${vital.spo2}%`}
                    />
                    <VitalDisplay
                      icon={<ArrowUpDown className="h-4 w-4" />}
                      label="Height"
                      value={`${vital.height} cm`}
                    />
                    <VitalDisplay
                      icon={<ArrowUpDown className="h-4 w-4" />}
                      label="Weight"
                      value={`${vital.weight} kg`}
                    />
                    <VitalDisplay
                      icon={<ArrowUpDown className="h-4 w-4" />}
                      label="BMI"
                      value={vital.bmi?.toString() || 'N/A'}
                    />
                  </div>
                  
                  {vital.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground">{vital.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No vitals recorded for this patient</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            Last updated: {vitals.length > 0 ? formatDate(vitals[0].recordedAt) : 'Never'}
          </div>
          <Button variant="outline" size="sm">View All History</Button>
        </CardFooter>
      </Card>

      {/* Add Vitals Dialog */}
      <Dialog open={isAddVitalsOpen} onOpenChange={setIsAddVitalsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Record Patient Vitals</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={newVital.temperature || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  name="bloodPressure"
                  placeholder="120/80"
                  value={newVital.bloodPressure || ''}
                  onChange={(e) => setNewVital({...newVital, bloodPressure: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  name="pulse"
                  type="number"
                  placeholder="72"
                  value={newVital.pulse || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (bpm)</Label>
                <Input
                  id="respiratoryRate"
                  name="respiratoryRate"
                  type="number"
                  placeholder="16"
                  value={newVital.respiratoryRate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO₂ (%)</Label>
                <Input
                  id="spo2"
                  name="spo2"
                  type="number"
                  placeholder="98"
                  value={newVital.spo2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={newVital.weight || ''}
                  onChange={handleInputChange}
                  onBlur={calculateBMI}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="175"
                  value={newVital.height || ''}
                  onChange={handleInputChange}
                  onBlur={calculateBMI}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.1"
                  placeholder="Auto-calculated"
                  value={newVital.bmi || ''}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes about the patient's condition"
                value={newVital.notes || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddVitalsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveVitals}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface VitalDisplayProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const VitalDisplay: React.FC<VitalDisplayProps> = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col bg-muted/30 p-3 rounded-md">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

export default PatientVitalsCard;
