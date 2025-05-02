
import React, { useState } from 'react';
import { Search, Plus, X, Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PrescriptionPadProps {
  visitId: string;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  tablet?: boolean;
}

interface Symptom {
  id: number;
  name: string;
}

interface Diagnosis {
  id: number;
  name: string;
}

interface TestItem {
  id: number;
  name: string;
  instructions?: string;
}

const PrescriptionPad: React.FC<PrescriptionPadProps> = ({ visitId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'symptoms' | 'medications'>('symptoms');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [medicationSearch, setMedicationSearch] = useState('');
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Bactrim Ds Tablet",
      dosage: "Sulfamethoxazole (800mg) + Trimethoprim (160mg)",
      frequency: "0-0-1",
      duration: "12 Days",
      timing: "After Meal",
      tablet: true
    },
    {
      id: 2,
      name: "Metron 200Mg Tablet",
      dosage: "Metronidazole (200mg)",
      frequency: "1-0-0",
      duration: "12 Days",
      timing: "After Meal",
      tablet: true
    }
  ]);
  
  const [selectedTests, setSelectedTests] = useState<TestItem[]>([]);
  
  // Mock data for symptoms
  const commonSymptoms = [
    { id: 1, name: "Cough" },
    { id: 2, name: "Headache" },
    { id: 3, name: "Bronchiolitis" },
    { id: 4, name: "Covid-19" },
    { id: 5, name: "Food Poisoning" },
    { id: 6, name: "Gland Infect" },
    { id: 7, name: "Croup" },
    { id: 8, name: "Sore Throat" },
    { id: 9, name: "Loss Of Appetite" },
    { id: 10, name: "Nasal Discharge" },
    { id: 11, name: "Rash" },
    { id: 12, name: "Chills" },
    { id: 13, name: "Dyspnea, Class Iv" },
    { id: 14, name: "Chest Pain" }
  ];
  
  // Mock data for diagnoses
  const commonDiagnoses = [
    { id: 1, name: "Viral Disease" },
    { id: 2, name: "Lung Consolidation" },
    { id: 3, name: "Malaria" },
    { id: 4, name: "Dengue" },
    { id: 5, name: "Bronchopneumonia" },
    { id: 6, name: "Acute Otitis Media" }
  ];
  
  // Mock data for medications
  const commonMedications = [
    { id: 1, name: "Electral Powder Orange" },
    { id: 2, name: "Dolo 500" },
    { id: 3, name: "Crocin 650Mg" },
    { id: 4, name: "Drotin" },
    { id: 5, name: "Enzoflam" },
    { id: 6, name: "Hifenac-Mr" },
    { id: 7, name: "Zifc 200Mg" },
    { id: 8, name: "Razo 20" },
    { id: 9, name: "Montair-Lc" },
    { id: 10, name: "Benadryl Dr" },
    { id: 11, name: "Doxt SL" },
    { id: 12, name: "Dexona" },
    { id: 13, name: "Combiflam" },
    { id: 14, name: "Allegra 180Mg" },
    { id: 15, name: "Corex Dx" }
  ];
  
  const handleAddSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.some(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleRemoveSymptom = (id: number) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== id));
  };
  
  const handleAddDiagnosis = (diagnosis: Diagnosis) => {
    if (!selectedDiagnoses.some(d => d.id === diagnosis.id)) {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
    }
  };
  
  const handleRemoveDiagnosis = (id: number) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(d => d.id !== id));
  };
  
  const handleAddMedication = (medication: any) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now(),
      dosage: "To be specified",
      frequency: "1-0-1",
      duration: "7 Days",
      timing: "After Meal"
    };
    
    setSelectedMedications([...selectedMedications, newMedication]);
  };
  
  const handleRemoveMedication = (id: number) => {
    setSelectedMedications(selectedMedications.filter(m => m.id !== id));
  };
  
  const handleContinue = () => {
    toast({
      title: "Prescription created",
      description: "Prescription has been successfully created",
    });
  };
  
  const handleClear = () => {
    setSelectedSymptoms([]);
    setSelectedDiagnoses([]);
    setSelectedMedications([]);
    setSelectedTests([]);
  };
  
  // Filter symptoms based on search
  const filteredSymptoms = commonSymptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(symptomSearch.toLowerCase())
  );
  
  // Filter medications based on search
  const filteredMedications = commonMedications.filter(med => 
    med.name.toLowerCase().includes(medicationSearch.toLowerCase())
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left Column - Symptoms & Diagnosis */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Symptoms & Diagnosis</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chief complaints / symptom / diagnosis"
              className="pl-9 pr-4"
              value={symptomSearch}
              onChange={(e) => setSymptomSearch(e.target.value)}
            />
          </div>
          
          {/* Selected Symptoms */}
          <div className="mt-4 space-y-2">
            {selectedSymptoms.map(symptom => (
              <div key={symptom.id} className="flex items-center bg-muted/30 p-2 rounded-md">
                <div className="flex items-center gap-2 flex-1">
                  <span className="flex items-center justify-center bg-muted w-6 h-6 text-xs rounded">5x</span>
                  {symptom.name}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemoveSymptom(symptom.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {filteredSymptoms.slice(0, 3).map(symptom => (
              <div 
                key={symptom.id} 
                className="flex items-center bg-muted/20 p-2 rounded-md cursor-pointer hover:bg-muted/30"
                onClick={() => handleAddSymptom(symptom)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="flex items-center justify-center bg-muted w-6 h-6 text-xs rounded">5x</span>
                  {symptom.name}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Frequently Seen By You</h4>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.slice(0, 7).map(symptom => (
              <Badge
                key={symptom.id}
                variant="outline"
                className="bg-muted/20 hover:bg-muted/30 cursor-pointer"
                onClick={() => handleAddSymptom(symptom)}
              >
                {symptom.name}
              </Badge>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Associated Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.slice(7, 14).map(symptom => (
              <Badge
                key={symptom.id}
                variant="outline"
                className="bg-muted/20 hover:bg-muted/30 cursor-pointer"
                onClick={() => handleAddSymptom(symptom)}
              >
                {symptom.name}
              </Badge>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Associated Diagnosis</h4>
          <div className="flex flex-wrap gap-2">
            {commonDiagnoses.map(diagnosis => (
              <Badge
                key={diagnosis.id}
                variant="outline"
                className={`
                  cursor-pointer
                  ${selectedDiagnoses.some(d => d.id === diagnosis.id) 
                    ? 'bg-primary/20 text-primary border-primary/30' 
                    : 'bg-muted/20 hover:bg-muted/30'}
                `}
                onClick={() => 
                  selectedDiagnoses.some(d => d.id === diagnosis.id)
                    ? handleRemoveDiagnosis(diagnosis.id)
                    : handleAddDiagnosis(diagnosis)
                }
              >
                {diagnosis.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Column - Drug Prescription & Lab Investigation */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Drug Prescription & Lab Investigation</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Write medicines / lab test / radiology"
              className="pl-9 pr-4"
              value={medicationSearch}
              onChange={(e) => setMedicationSearch(e.target.value)}
            />
          </div>
          
          {/* Drug Interaction Warning */}
          {selectedMedications.length > 1 && (
            <Alert className="mt-4 bg-orange-50 border-orange-200">
              <AlertTitle className="text-orange-700 flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                1 Exception Needs Your Attention
              </AlertTitle>
              <AlertDescription className="text-sm mt-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Bactrim Ds Tablet</div>
                    <div className="text-xs">Sulfamethoxazole (800mg) + Trimethoprim (160mg)</div>
                  </div>
                  <div>
                    <div className="font-medium">Metron 200Mg Tablet</div>
                    <div className="text-xs">Metronidazole (200mg)</div>
                  </div>
                  <Badge variant="destructive" className="self-center">
                    Contraindicated
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Selected Medications */}
          <div className="mt-4 space-y-3">
            {selectedMedications.map(medication => (
              <Card key={medication.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200">TABLET</Badge>
                        <h4 className="font-medium">{medication.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveMedication(medication.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{medication.dosage}</p>
                      <div className="text-xs mt-1">
                        {medication.tablet && (
                          <span>{medication.frequency} • {medication.timing} • {medication.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Frequently Prescribed Drugs</h4>
          <div className="flex flex-wrap gap-2">
            {commonMedications.slice(0, 8).map(med => (
              <Badge
                key={med.id}
                variant="outline"
                className="bg-muted/20 hover:bg-muted/30 cursor-pointer"
                onClick={() => handleAddMedication(med)}
              >
                {med.name}
              </Badge>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Suggested Drugs</h4>
          <div className="flex flex-wrap gap-2">
            {commonMedications.slice(8, 15).map(med => (
              <Badge
                key={med.id}
                variant="outline"
                className="bg-muted/20 hover:bg-muted/30 cursor-pointer"
                onClick={() => handleAddMedication(med)}
              >
                {med.name}
              </Badge>
            ))}
          </div>
          
          <h4 className="text-sm font-medium mt-6 mb-2">Frequently Prescribed Investigations</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-muted/20 hover:bg-muted/30 cursor-pointer">
              Complete Blood Count
            </Badge>
            <Badge variant="outline" className="bg-muted/20 hover:bg-muted/30 cursor-pointer">
              Urinalysis
            </Badge>
            <Badge variant="outline" className="bg-muted/20 hover:bg-muted/30 cursor-pointer">
              Chest X-Ray
            </Badge>
            <Badge variant="outline" className="bg-muted/20 hover:bg-muted/30 cursor-pointer">
              Liver Function Test
            </Badge>
            <Badge variant="outline" className="bg-muted/20 hover:bg-muted/30 cursor-pointer">
              Blood Glucose
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="col-span-1 lg:col-span-2 flex justify-between border-t pt-6">
        <div className="space-x-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline">
            Use Templates
          </Button>
        </div>
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionPad;
