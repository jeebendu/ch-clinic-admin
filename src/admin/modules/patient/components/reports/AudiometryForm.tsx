
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Audiogram, FREQUENCY_LABELS } from '../../types/AudiometryTypes';
import { Patient } from '../../types/Patient';
import { useToast } from '@/hooks/use-toast';

interface AudiometryFormProps {
  patient: Patient;
  onCancel: () => void;
  onSave: (audiogram: Audiogram) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AudiometryForm: React.FC<AudiometryFormProps> = ({ 
  patient, 
  onCancel, 
  onSave, 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [audiogram, setAudiogram] = useState<Audiogram>(() => {
    const newAudiogram = new Audiogram();
    if (patient) {
      newAudiogram.patient = patient;
    }
    return newAudiogram;
  });
  const [activeTab, setActiveTab] = useState('testing-data');

  // Handle modality checkbox changes
  const handleModalityChange = (key: keyof typeof audiogram.modality) => {
    setAudiogram(prev => ({
      ...prev,
      modality: {
        ...prev.modality,
        [key]: !prev.modality[key as keyof typeof prev.modality]
      }
    }));
  };

  // Handle puretone data input
  const handlePuretoneChange = (
    ear: 'puretoneLeft' | 'puretoneRight', 
    type: 'acu' | 'acm' | 'bcu' | 'bcm' | 'nor', 
    index: number, 
    value: string
  ) => {
    const numValue = value === '' ? null : Number(value);
    setAudiogram(prev => {
      const newData = { ...prev };
      newData[ear][type][index].value = numValue;
      return newData;
    });
  };

  // Handle ear test data
  const handleEarDataChange = (
    ear: 'earLeft' | 'earRight',
    index: number,
    value: string
  ) => {
    const numValue = value === '' ? null : value;
    setAudiogram(prev => {
      const newData = { ...prev };
      newData[ear][index].value = numValue;
      return newData;
    });
  };

  // Handle test data
  const handleTestDataChange = (
    ear: 'testLeft' | 'testRight',
    index: number,
    value: string
  ) => {
    setAudiogram(prev => {
      const newData = { ...prev };
      newData[ear][index].value = value;
      return newData;
    });
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - check at least one modality is selected
    if (!(audiogram.modality.acuChecked || 
          audiogram.modality.acmChecked || 
          audiogram.modality.bcuChecked || 
          audiogram.modality.bcmChecked || 
          audiogram.modality.norChecked)) {
      toast({
        title: "Validation Error",
        description: "Please check at least one test modality.",
        variant: "destructive"
      });
      return;
    }
    
    // Send to parent component for saving
    onSave(audiogram);
    
    toast({
      title: "Audiometry Report Saved",
      description: "The audiometry report has been successfully saved."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audiometry Assessment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modality Checkboxes */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acu" 
                checked={audiogram.modality.acuChecked} 
                onCheckedChange={() => handleModalityChange('acuChecked')} 
              />
              <Label htmlFor="acu">AC unmasked</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acm" 
                checked={audiogram.modality.acmChecked} 
                onCheckedChange={() => handleModalityChange('acmChecked')} 
              />
              <Label htmlFor="acm">AC masked</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bcu" 
                checked={audiogram.modality.bcuChecked} 
                onCheckedChange={() => handleModalityChange('bcuChecked')} 
              />
              <Label htmlFor="bcu">BC unmasked</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bcm" 
                checked={audiogram.modality.bcmChecked} 
                onCheckedChange={() => handleModalityChange('bcmChecked')} 
              />
              <Label htmlFor="bcm">BC masked</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nor" 
                checked={audiogram.modality.norChecked} 
                onCheckedChange={() => handleModalityChange('norChecked')} 
              />
              <Label htmlFor="nor">No response</Label>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="testing-data">Testing Data</TabsTrigger>
              <TabsTrigger value="charts">Audiometry Charts</TabsTrigger>
              <TabsTrigger value="diagnosis">Diagnosis & Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="testing-data" className="space-y-4">
              {/* Pure Tone Testing Tables */}
              <div className="overflow-x-auto">
                <h3 className="font-medium mb-2">Puretones (dBHL)</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 border">Test Type</th>
                      {FREQUENCY_LABELS.map(label => (
                        <th key={label} className="p-2 border text-center">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {audiogram.modality.acuChecked && (
                      <>
                        <tr>
                          <td className="p-2 border font-medium">AC U (Right)</td>
                          {audiogram.puretoneRight.acu.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number" 
                                min={-10} 
                                max={120} 
                                className="w-20 text-center mx-auto" 
                                value={item.value === null ? '' : item.value} 
                                onChange={(e) => handlePuretoneChange('puretoneRight', 'acu', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-2 border font-medium">AC U (Left)</td>
                          {audiogram.puretoneLeft.acu.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number"
                                min={-10}
                                max={120}
                                className="w-20 text-center mx-auto"
                                value={item.value === null ? '' : item.value}
                                onChange={(e) => handlePuretoneChange('puretoneLeft', 'acu', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                    
                    {audiogram.modality.acmChecked && (
                      <>
                        <tr>
                          <td className="p-2 border font-medium">AC M (Right)</td>
                          {audiogram.puretoneRight.acm.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number" 
                                min={-10} 
                                max={120} 
                                className="w-20 text-center mx-auto" 
                                value={item.value === null ? '' : item.value} 
                                onChange={(e) => handlePuretoneChange('puretoneRight', 'acm', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-2 border font-medium">AC M (Left)</td>
                          {audiogram.puretoneLeft.acm.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number" 
                                min={-10} 
                                max={120} 
                                className="w-20 text-center mx-auto" 
                                value={item.value === null ? '' : item.value} 
                                onChange={(e) => handlePuretoneChange('puretoneLeft', 'acm', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                    
                    {/* Similar structure for BC unmasked, BC masked, and No response rows */}
                    {audiogram.modality.bcuChecked && (
                      <>
                        <tr>
                          <td className="p-2 border font-medium">BC U (Right)</td>
                          {audiogram.puretoneRight.bcu.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number" 
                                min={-10} 
                                max={120} 
                                className="w-20 text-center mx-auto" 
                                value={item.value === null ? '' : item.value} 
                                onChange={(e) => handlePuretoneChange('puretoneRight', 'bcu', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-2 border font-medium">BC U (Left)</td>
                          {audiogram.puretoneLeft.bcu.map((item, i) => (
                            <td key={i} className="p-2 border">
                              <Input 
                                type="number" 
                                min={-10} 
                                max={120} 
                                className="w-20 text-center mx-auto" 
                                value={item.value === null ? '' : item.value} 
                                onChange={(e) => handlePuretoneChange('puretoneLeft', 'bcu', i, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* EAR Tests Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="overflow-x-auto">
                  <h3 className="font-medium mb-2">EAR Tests</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 border">EAR</th>
                        <th className="p-2 border">PTA</th>
                        <th className="p-2 border">SAT</th>
                        <th className="p-2 border">SRT</th>
                        <th className="p-2 border">SDS</th>
                        <th className="p-2 border">MCL</th>
                        <th className="p-2 border">UCL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-medium">RIGHT</td>
                        {audiogram.earRight.map((item, i) => (
                          <td key={i} className="p-2 border">
                            <Input 
                              className="w-16 text-center mx-auto" 
                              value={item.value === null ? '' : item.value} 
                              onChange={(e) => handleEarDataChange('earRight', i, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 border font-medium">LEFT</td>
                        {audiogram.earLeft.map((item, i) => (
                          <td key={i} className="p-2 border">
                            <Input 
                              className="w-16 text-center mx-auto" 
                              value={item.value === null ? '' : item.value} 
                              onChange={(e) => handleEarDataChange('earLeft', i, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="overflow-x-auto">
                  <h3 className="font-medium mb-2">Additional Tests</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 border">TEST</th>
                        <th className="p-2 border">RINNE</th>
                        <th className="p-2 border">WEBER</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-medium">RIGHT</td>
                        {audiogram.testRight.map((item, i) => (
                          <td key={i} className="p-2 border">
                            <Input 
                              className="w-20 text-center mx-auto" 
                              value={item.value === null ? '' : item.value} 
                              onChange={(e) => handleTestDataChange('testRight', i, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 border font-medium">LEFT</td>
                        {audiogram.testLeft.map((item, i) => (
                          <td key={i} className="p-2 border">
                            <Input 
                              className="w-20 text-center mx-auto" 
                              value={item.value === null ? '' : item.value} 
                              onChange={(e) => handleTestDataChange('testLeft', i, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="charts">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="font-medium text-center">Right Ear</h3>
                  <div className="bg-muted/30 h-64 rounded-md flex items-center justify-center border">
                    <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-center">Left Ear</h3>
                  <div className="bg-muted/30 h-64 rounded-md flex items-center justify-center border">
                    <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="diagnosis" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="impedanceAudiometry">Impedance Audiometry</Label>
                  <Textarea 
                    id="impedanceAudiometry"
                    placeholder="Enter impedance audiometry notes"
                    value={audiogram.impedanceAudiometry || ''}
                    onChange={(e) => setAudiogram({...audiogram, impedanceAudiometry: e.target.value})}
                    className="h-24"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proDiagnosisRight">Provisional Diagnosis (Right Ear)</Label>
                    <Textarea 
                      id="proDiagnosisRight"
                      placeholder="Enter diagnosis for right ear"
                      value={audiogram.proDiagnosisRight || ''}
                      onChange={(e) => setAudiogram({...audiogram, proDiagnosisRight: e.target.value})}
                      className="h-24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="proDiagnosisLeft">Provisional Diagnosis (Left Ear)</Label>
                    <Textarea 
                      id="proDiagnosisLeft"
                      placeholder="Enter diagnosis for left ear"
                      value={audiogram.proDiagnosisLeft || ''}
                      onChange={(e) => setAudiogram({...audiogram, proDiagnosisLeft: e.target.value})}
                      className="h-24"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Textarea 
                    id="recommendation"
                    placeholder="Enter recommendations"
                    value={audiogram.recommendation || ''}
                    onChange={(e) => setAudiogram({...audiogram, recommendation: e.target.value})}
                    className="h-32"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AudiometryForm;
