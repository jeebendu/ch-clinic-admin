
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import AudiometryService from '../../services/audiometryService';
import { Chart, registerables } from 'chart.js';
import { AUDIOMETRY_CHART_OPTIONS, FREQUENCY_LABELS } from '../../types/AudiometryTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Register Chart.js components
Chart.register(...registerables);

const AudiometryForm: React.FC = () => {
  const { patientId, id } = useParams();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get('visitId');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [audiogram, setAudiogram] = useState<any>({
    patient: { id: Number(patientId) },
    id: Number(id),
    modality: {
      acuChecked: false,
      acmChecked: false,
      bcuChecked: false,
      bcmChecked: false,
      norChecked: false
    },
    puretoneLeft: {
      acu: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      acm: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      bcu: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      bcm: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      nor: FREQUENCY_LABELS.map(label => ({ label, value: null })),
    },
    puretoneRight: {
      acu: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      acm: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      bcu: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      bcm: FREQUENCY_LABELS.map(label => ({ label, value: null })),
      nor: FREQUENCY_LABELS.map(label => ({ label, value: null })),
    },
    earLeft: [{}],
    earRight: [{}],
    visitId: visitId || undefined,
  });

  const [lineChartDataLeft, setLineChartDataLeft] = useState<any>({ 
    labels: FREQUENCY_LABELS,
    datasets: [] 
  });
  
  const [lineChartDataRight, setLineChartDataRight] = useState<any>({ 
    labels: FREQUENCY_LABELS,
    datasets: [] 
  });
  
  const [canvasChartLeftFile, setCanvasChartLeftFile] = useState<File | null>(null);
  const [canvasChartRightFile, setCanvasChartRightFile] = useState<File | null>(null);

  const chartLeftRef = useRef<HTMLCanvasElement>(null);
  const chartRightRef = useRef<HTMLCanvasElement>(null);
  
  const leftChartInstance = useRef<Chart | null>(null);
  const rightChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (audiogram.id) {
      getAudiogramById(audiogram.id);
    }
  }, [audiogram.id]);

  // Initialize charts when component mounts
  useEffect(() => {
    initializeCharts();
    return () => {
      // Clean up charts when component unmounts
      if (leftChartInstance.current) {
        leftChartInstance.current.destroy();
      }
      if (rightChartInstance.current) {
        rightChartInstance.current.destroy();
      }
    };
  }, []);

  // Update charts when data changes
  useEffect(() => {
    updateCharts();
  }, [lineChartDataLeft, lineChartDataRight]);

  const initializeCharts = () => {
    if (chartLeftRef.current && chartRightRef.current) {
      // Destroy existing charts if they exist
      if (leftChartInstance.current) {
        leftChartInstance.current.destroy();
      }
      if (rightChartInstance.current) {
        rightChartInstance.current.destroy();
      }

      // Create new charts
      leftChartInstance.current = new Chart(chartLeftRef.current, {
        type: 'line',
        data: {
          labels: FREQUENCY_LABELS,
          datasets: []
        },
        options: AUDIOMETRY_CHART_OPTIONS
      });

      rightChartInstance.current = new Chart(chartRightRef.current, {
        type: 'line',
        data: {
          labels: FREQUENCY_LABELS,
          datasets: []
        },
        options: AUDIOMETRY_CHART_OPTIONS
      });
    }
  };

  const updateCharts = () => {
    if (leftChartInstance.current) {
      leftChartInstance.current.data = lineChartDataLeft;
      leftChartInstance.current.update();
    }

    if (rightChartInstance.current) {
      rightChartInstance.current.data = lineChartDataRight;
      rightChartInstance.current.update();
    }
  };

  const getAudiogramById = async (id: number) => {
    try {
      const data = await AudiometryService.getById(id);
      setAudiogram({
        ...data,
        visitId: visitId || data.visitId
      });
      
      // Initialize modality checkboxes
      if (data.modality) {
        updateModality('acu', data.modality.acuChecked);
        updateModality('acm', data.modality.acmChecked);
        updateModality('bcu', data.modality.bcuChecked);
        updateModality('bcm', data.modality.bcmChecked);
        updateModality('nor', data.modality.norChecked);
      }
    } catch (error) {
      console.error('Error fetching audiogram:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch audiogram data',
        variant: 'destructive'
      });
    }
  };

  const handleChartImage = (side: string, event: { blob: Blob; filename: string }) => {
    const file = new File([event.blob], event.filename, { type: 'image/png' });
    if (side === 'left') {
      setCanvasChartLeftFile(file);
    } else {
      setCanvasChartRightFile(file);
    }
  };

  const handleInputChange = (
    side: 'left' | 'right', 
    type: 'acu' | 'acm' | 'bcu' | 'bcm' | 'nor', 
    frequency: string, 
    value: number | null
  ) => {
    const newAudiogram = { ...audiogram };
    const puretone = side === 'left' ? newAudiogram.puretoneLeft : newAudiogram.puretoneRight;
    
    const index = puretone[type].findIndex((item: any) => item.label === frequency);
    if (index !== -1) {
      puretone[type][index].value = value;
    }

    setAudiogram(newAudiogram);
    
    // Update charts
    updateChartData(type, side);
  };

  const updateChartData = (type: string, side: 'left' | 'right') => {
    const puretone = side === 'left' ? audiogram.puretoneLeft : audiogram.puretoneRight;
    const setChartData = side === 'left' ? setLineChartDataLeft : setLineChartDataRight;
    
    // Create datasets based on data
    setChartData((prev: any) => {
      const datasets = [...prev.datasets];
      
      // Find dataset if exists or create new one
      let datasetIndex = datasets.findIndex(ds => ds.label === getDatasetLabel(type));
      const values = puretone[type].map((item: any) => item.value);
      
      // If the dataset exists, update it
      if (datasetIndex !== -1) {
        datasets[datasetIndex] = {
          ...datasets[datasetIndex],
          data: values,
        };
      }
      
      return { 
        ...prev,
        datasets 
      };
    });
  };

  const getDatasetLabel = (type: string): string => {
    switch (type) {
      case 'acu': return 'AC U';
      case 'acm': return 'AC M';
      case 'bcu': return 'BC U';
      case 'bcm': return 'BC M';
      case 'nor': return 'No R';
      default: return '';
    }
  };

  const getDatasetStyle = (type: string) => {
    // Different colors and styles for different test types
    switch (type) {
      case 'acu':
        return {
          borderColor: 'rgba(255, 0, 0, 1)',
          pointStyle: 'circle',
          pointBorderColor: 'rgba(255, 0, 0, 1)',
        };
      case 'acm':
        return {
          borderColor: 'rgba(0, 0, 255, 1)',
          pointStyle: 'triangle',
          pointBorderColor: 'rgba(0, 0, 255, 1)',
        };
      case 'bcu':
        return {
          borderColor: 'rgba(0, 128, 0, 1)',
          pointStyle: 'rect',
          pointBorderColor: 'rgba(0, 128, 0, 1)',
        };
      case 'bcm':
        return {
          borderColor: 'rgba(128, 0, 128, 1)',
          pointStyle: 'rectRot',
          pointBorderColor: 'rgba(128, 0, 128, 1)',
        };
      case 'nor':
        return {
          borderColor: 'rgba(128, 128, 0, 1)',
          pointStyle: 'star',
          pointBorderColor: 'rgba(128, 128, 0, 1)',
        };
      default:
        return {
          borderColor: 'rgba(0, 0, 0, 1)',
          pointStyle: 'circle',
          pointBorderColor: 'rgba(0, 0, 0, 1)',
        };
    }
  };

  const updateModality = (type: string, isChecked?: boolean) => {
    // Update modality in the state
    const newAudiogram = { ...audiogram };
    const newModality = { ...newAudiogram.modality };

    switch (type) {
      case 'acu':
        newModality.acuChecked = isChecked !== undefined ? isChecked : !newModality.acuChecked;
        break;
      case 'acm':
        newModality.acmChecked = isChecked !== undefined ? isChecked : !newModality.acmChecked;
        break;
      case 'bcu':
        newModality.bcuChecked = isChecked !== undefined ? isChecked : !newModality.bcuChecked;
        break;
      case 'bcm':
        newModality.bcmChecked = isChecked !== undefined ? isChecked : !newModality.bcmChecked;
        break;
      case 'nor':
        newModality.norChecked = isChecked !== undefined ? isChecked : !newModality.norChecked;
        break;
      default:
        break;
    }

    newAudiogram.modality = newModality;
    setAudiogram(newAudiogram);

    // Update chart datasets based on modality changes
    const isTypeChecked = isChecked !== undefined ? isChecked : !audiogram.modality[`${type}Checked`];
    
    setLineChartDataLeft(prev => {
      const datasets = [...prev.datasets];
      const datasetIndex = datasets.findIndex(ds => ds.label === getDatasetLabel(type));
      
      if (isTypeChecked) {
        // Add dataset if checked
        if (datasetIndex === -1) {
          const style = getDatasetStyle(type);
          datasets.push({
            label: getDatasetLabel(type),
            data: audiogram.puretoneLeft[type].map((item: any) => item.value),
            borderWidth: 2,
            backgroundColor: 'transparent',
            pointRadius: 6,
            tension: 0.1,
            spanGaps: true,
            ...style
          });
        }
      } else {
        // Remove dataset if unchecked
        if (datasetIndex !== -1) {
          datasets.splice(datasetIndex, 1);
        }
      }
      
      return { ...prev, datasets };
    });

    setLineChartDataRight(prev => {
      const datasets = [...prev.datasets];
      const datasetIndex = datasets.findIndex(ds => ds.label === getDatasetLabel(type));
      
      if (isTypeChecked) {
        // Add dataset if checked
        if (datasetIndex === -1) {
          const style = getDatasetStyle(type);
          datasets.push({
            label: getDatasetLabel(type),
            data: audiogram.puretoneRight[type].map((item: any) => item.value),
            borderWidth: 2,
            backgroundColor: 'transparent',
            pointRadius: 6,
            tension: 0.1,
            spanGaps: true,
            ...style
          });
        }
      } else {
        // Remove dataset if unchecked
        if (datasetIndex !== -1) {
          datasets.splice(datasetIndex, 1);
        }
      }
      
      return { ...prev, datasets };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !(
        audiogram.modality.acuChecked ||
        audiogram.modality.acmChecked ||
        audiogram.modality.bcuChecked ||
        audiogram.modality.bcmChecked ||
        audiogram.modality.norChecked
      )
    ) {
      toast({ 
        title: 'Error', 
        description: 'Please check at least one test', 
        variant: "destructive" 
      });
      return;
    }

    try {
      // Ensure visitId is included if available
      const response = await AudiometryService.saveOrUpdate({
        ...audiogram,
        visitId: visitId || audiogram.visitId
      });
      
      if (response.status) {
        toast({ 
          title: 'Success', 
          description: response.message 
        });
        
        // If we came from a visit, go back to visit details
        if (visitId) {
          navigate(`/admin/patients/visit/${visitId}`);
        } else {
          navigate(`/admin/patients/diagnosis/audiogram/patientId/${audiogram.patient.id}`);
        }
      } else {
        toast({ 
          title: 'Error', 
          description: response.message, 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error saving audiogram:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save audiogram', 
        variant: "destructive" 
      });
    }
  };

  const print = async () => {
    try {
      // Create chart images if charts exist
      if (chartLeftRef.current && chartRightRef.current) {
        const leftChartUrl = chartLeftRef.current.toDataURL('image/png');
        const leftBlob = await (await fetch(leftChartUrl)).blob();
        const leftFile = new File([leftBlob], 'left-chart.png', { type: 'image/png' });
        
        const rightChartUrl = chartRightRef.current.toDataURL('image/png');
        const rightBlob = await (await fetch(rightChartUrl)).blob();
        const rightFile = new File([rightBlob], 'right-chart.png', { type: 'image/png' });
        
        setCanvasChartLeftFile(leftFile);
        setCanvasChartRightFile(rightFile);
        
        const formData = new FormData();
        formData.append('canvasChartLeftFile', leftFile);
        formData.append('canvasChartRightFile', rightFile);

        const data = await AudiometryService.saveAndPrintPdf(formData, audiogram.id);
        const blob = new Blob([data], { type: 'application/pdf' });
        const patientInfo = `${audiogram.uid || 'audiogram'}-${audiogram.patient?.firstname || ''}-${audiogram.patient?.lastname || ''}`;
        saveAs(blob, `${patientInfo}.pdf`);
        toast({ title: 'Success', description: 'Report Generated Successfully!' });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({ title: 'Error', description: 'Failed to generate report', variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Audiometry Assessment</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acu"
                  checked={audiogram.modality.acuChecked}
                  onCheckedChange={() => updateModality('acu')}
                />
                <Label htmlFor="acu" className="font-medium">AC Unmasked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="acm"
                  checked={audiogram.modality.acmChecked}
                  onCheckedChange={() => updateModality('acm')}
                />
                <Label htmlFor="acm" className="font-medium">AC Masked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bcu"
                  checked={audiogram.modality.bcuChecked}
                  onCheckedChange={() => updateModality('bcu')}
                />
                <Label htmlFor="bcu" className="font-medium">BC Unmasked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bcm"
                  checked={audiogram.modality.bcmChecked}
                  onCheckedChange={() => updateModality('bcm')}
                />
                <Label htmlFor="bcm" className="font-medium">BC Masked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="nor"
                  checked={audiogram.modality.norChecked}
                  onCheckedChange={() => updateModality('nor')}
                />
                <Label htmlFor="nor" className="font-medium">No Response</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Input Tables */}
        {audiogram.modality.acuChecked && (
          <Card>
            <CardHeader>
              <CardTitle>AC Unmasked (ACU) Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    {FREQUENCY_LABELS.map(freq => (
                      <TableHead key={freq}>{freq}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ACU Right</TableCell>
                    {audiogram.puretoneRight.acu.map((item: any, index: number) => (
                      <TableCell key={`acu-right-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('right', 'acu', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ACU Left</TableCell>
                    {audiogram.puretoneLeft.acu.map((item: any) => (
                      <TableCell key={`acu-left-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('left', 'acu', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {audiogram.modality.acmChecked && (
          <Card>
            <CardHeader>
              <CardTitle>AC Masked (ACM) Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    {FREQUENCY_LABELS.map(freq => (
                      <TableHead key={freq}>{freq}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ACM Right</TableCell>
                    {audiogram.puretoneRight.acm.map((item: any) => (
                      <TableCell key={`acm-right-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('right', 'acm', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ACM Left</TableCell>
                    {audiogram.puretoneLeft.acm.map((item: any) => (
                      <TableCell key={`acm-left-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('left', 'acm', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {audiogram.modality.bcuChecked && (
          <Card>
            <CardHeader>
              <CardTitle>BC Unmasked (BCU) Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    {FREQUENCY_LABELS.map(freq => (
                      <TableHead key={freq}>{freq}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">BCU Right</TableCell>
                    {audiogram.puretoneRight.bcu.map((item: any) => (
                      <TableCell key={`bcu-right-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('right', 'bcu', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">BCU Left</TableCell>
                    {audiogram.puretoneLeft.bcu.map((item: any) => (
                      <TableCell key={`bcu-left-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('left', 'bcu', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {audiogram.modality.bcmChecked && (
          <Card>
            <CardHeader>
              <CardTitle>BC Masked (BCM) Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    {FREQUENCY_LABELS.map(freq => (
                      <TableHead key={freq}>{freq}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">BCM Right</TableCell>
                    {audiogram.puretoneRight.bcm.map((item: any) => (
                      <TableCell key={`bcm-right-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('right', 'bcm', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">BCM Left</TableCell>
                    {audiogram.puretoneLeft.bcm.map((item: any) => (
                      <TableCell key={`bcm-left-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('left', 'bcm', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {audiogram.modality.norChecked && (
          <Card>
            <CardHeader>
              <CardTitle>No Response (NOR) Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    {FREQUENCY_LABELS.map(freq => (
                      <TableHead key={freq}>{freq}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">NOR Right</TableCell>
                    {audiogram.puretoneRight.nor.map((item: any) => (
                      <TableCell key={`nor-right-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('right', 'nor', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NOR Left</TableCell>
                    {audiogram.puretoneLeft.nor.map((item: any) => (
                      <TableCell key={`nor-left-${item.label}`}>
                        <Input
                          type="number"
                          min="-10"
                          max="120"
                          value={item.value !== null ? item.value : ''}
                          onChange={(e) => handleInputChange('left', 'nor', item.label, e.target.value ? Number(e.target.value) : null)}
                          className="w-16"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Left Ear Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] relative">
              <canvas ref={chartLeftRef} className="w-full h-full"></canvas>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Right Ear Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] relative">
              <canvas ref={chartRightRef} className="w-full h-full"></canvas>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            onClick={() => visitId ? navigate(`/admin/patients/visit/${visitId}`) : navigate(-1)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Save Report</Button>
          <Button 
            type="button" 
            onClick={print}
            variant="secondary"
          >
            Save & Print
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AudiometryForm;
