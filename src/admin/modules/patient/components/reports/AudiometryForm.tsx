import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import AudiometryService from '../../services/audiometryService';

const AudiometryForm: React.FC = () => {
  const { patientId, id } = useParams();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get('visitId');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [audiogram, setAudiogram] = useState<any>({
    patient: { id: Number(patientId) },
    id: Number(id),
    modality: {},
    puretoneLeft: {},
    puretoneRight: {},
    earLeft: [{}],
    earRight: [{}],
    visitId: visitId || undefined, // Add visitId if present
  });

  const [lineChartDataLeft, setLineChartDataLeft] = useState<any>({ datasets: [] });
  const [lineChartDataRight, setLineChartDataRight] = useState<any>({ datasets: [] });
  const [canvasChartLeftFile, setCanvasChartLeftFile] = useState<File | null>(null);
  const [canvasChartRightFile, setCanvasChartRightFile] = useState<File | null>(null);

  const chartLeftRef = useRef<HTMLCanvasElement>(null);
  const chartRightRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audiogram.id) {
      getAudiogramById(audiogram.id);
    }
  }, [audiogram.id]);

  const getAudiogramById = async (id: number) => {
    try {
      const data = await AudiometryService.getById(id);
      setAudiogram({
        ...data,
        visitId: visitId || data.visitId // Preserve the visitId from URL or data
      });
      updateModality('acu');
      updateModality('acm');
      updateModality('bcu');
      updateModality('bcm');
      updateModality('nor');
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

  const updateChart = (type: string, side: 'left' | 'right') => {
    const updateDatasetByType = (label: string, data: any[], chartData: any, setChartData: any) => {
      setChartData((prev: any) => {
        const datasets = [...prev.datasets];
        const datasetIndex = datasets.findIndex((dataset) => dataset.label === label);
        if (datasetIndex !== -1) {
          datasets[datasetIndex].data = data.map((item) => item.value);
        }
        return { ...prev, datasets };
      });
    };

    const puretone = side === 'left' ? audiogram.puretoneLeft : audiogram.puretoneRight;
    const chartData = side === 'left' ? lineChartDataLeft : lineChartDataRight;
    const setChartData = side === 'left' ? setLineChartDataLeft : setLineChartDataRight;

    updateDatasetByType('AC U', puretone.acu, chartData, setChartData);
    updateDatasetByType('AC M', puretone.acm, chartData, setChartData);
    updateDatasetByType('BC U', puretone.bcu, chartData, setChartData);
    updateDatasetByType('BC M', puretone.bcm, chartData, setChartData);
    updateDatasetByType('No R', puretone.nor, chartData, setChartData);
  };

  const updateModality = (type: string) => {
    const addToDatasets = (dataRight: any, dataLeft: any) => {
      setLineChartDataRight((prev) => ({
        ...prev,
        datasets: [...prev.datasets, dataRight],
      }));
      setLineChartDataLeft((prev) => ({
        ...prev,
        datasets: [...prev.datasets, dataLeft],
      }));
    };

    const removeDataset = (label: string) => {
      setLineChartDataRight((prev) => ({
        ...prev,
        datasets: prev.datasets.filter((dataset) => dataset.label !== label),
      }));
      setLineChartDataLeft((prev) => ({
        ...prev,
        datasets: prev.datasets.filter((dataset) => dataset.label !== label),
      }));
    };

    if (type === 'acu') {
      if (audiogram.modality.acuChecked) {
        const data_acur = { label: 'AC U', data: audiogram.puretoneRight.acu.map((item) => item.value) };
        const data_acul = { label: 'AC U', data: audiogram.puretoneLeft.acu.map((item) => item.value) };
        addToDatasets(data_acur, data_acul);
      } else {
        removeDataset('AC U');
      }
    }
    if (type === 'acm') {
      if (audiogram.modality.acmChecked) {
        const data_acmr = { label: 'AC M', data: audiogram.puretoneRight.acm.map((item) => item.value) };
        const data_acml = { label: 'AC M', data: audiogram.puretoneLeft.acm.map((item) => item.value) };
        addToDatasets(data_acmr, data_acml);
      } else {
        removeDataset('AC M');
      }
    }
    if (type === 'bcu') {
      if (audiogram.modality.bcuChecked) {
        const data_bcur = { label: 'BC U', data: audiogram.puretoneRight.bcu.map((item) => item.value) };
        const data_bcul = { label: 'BC U', data: audiogram.puretoneLeft.bcu.map((item) => item.value) };
        addToDatasets(data_bcur, data_bcul);
      } else {
        removeDataset('BC U');
      }
    }
    if (type === 'bcm') {
      if (audiogram.modality.bcmChecked) {
        const data_bcmr = { label: 'BC M', data: audiogram.puretoneRight.bcm.map((item) => item.value) };
        const data_bcml = { label: 'BC M', data: audiogram.puretoneLeft.bcm.map((item) => item.value) };
        addToDatasets(data_bcmr, data_bcml);
      } else {
        removeDataset('BC M');
      }
    }
    if (type === 'nor') {
      if (audiogram.modality.norChecked) {
        const data_norr = { label: 'No R', data: audiogram.puretoneRight.nor.map((item) => item.value) };
        const data_norl = { label: 'No R', data: audiogram.puretoneLeft.nor.map((item) => item.value) };
        addToDatasets(data_norr, data_norl);
      } else {
        removeDataset('No R');
      }
    }
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
      const formData = new FormData();
      if (canvasChartLeftFile) formData.append('canvasChartLeftFile', canvasChartLeftFile);
      if (canvasChartRightFile) formData.append('canvasChartRightFile', canvasChartRightFile);

      const data = await AudiometryService.saveAndPrintPdf(formData, audiogram.id);
      const blob = new Blob([data], { type: 'application/pdf' });
      const patientInfo = `${audiogram.uid}-${audiogram.patient.firstname}-${audiogram.patient.lastname}`;
      saveAs(blob, `${patientInfo}.pdf`);
      toast({ title: 'Success', description: 'Report Generated Successfully!' });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({ title: 'Error', description: 'Failed to generate report', variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Audiometry Assessment</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Checkbox
            checked={audiogram.modality.acuChecked}
            onCheckedChange={() => updateModality('acu')}
          >
            AC U
          </Checkbox>
          <Checkbox
            checked={audiogram.modality.acmChecked}
            onCheckedChange={() => updateModality('acm')}
          >
            AC M
          </Checkbox>
          <Checkbox
            checked={audiogram.modality.bcuChecked}
            onCheckedChange={() => updateModality('bcu')}
          >
            BC U
          </Checkbox>
          <Checkbox
            checked={audiogram.modality.bcmChecked}
            onCheckedChange={() => updateModality('bcm')}
          >
            BC M
          </Checkbox>
          <Checkbox
            checked={audiogram.modality.norChecked}
            onCheckedChange={() => updateModality('nor')}
          >
            No R
          </Checkbox>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-2">
            <h3 className="text-center font-medium mb-2">Left Ear</h3>
            <canvas ref={chartLeftRef} className="w-full h-[300px]"></canvas>
          </div>
          <div className="border rounded p-2">
            <h3 className="text-center font-medium mb-2">Right Ear</h3>
            <canvas ref={chartRightRef} className="w-full h-[300px]"></canvas>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
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
