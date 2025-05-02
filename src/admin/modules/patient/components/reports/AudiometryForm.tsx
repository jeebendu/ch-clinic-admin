import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import saveAs from 'file-saver';
import AudiometryService from '../../services/audiometryService';

const AudiometryForm: React.FC = () => {
  const { patientId, id } = useParams();
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
      setAudiogram(data);
      updateModality('acu');
      updateModality('acm');
      updateModality('bcu');
      updateModality('bcm');
      updateModality('nor');
    } catch (error) {
      console.error('Error fetching audiogram:', error);
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

  const onSubmit = async () => {
    if (
      !(
        audiogram.modality.acuChecked ||
        audiogram.modality.acmChecked ||
        audiogram.modality.bcuChecked ||
        audiogram.modality.bcmChecked ||
        audiogram.modality.norChecked
      )
    ) {
      //toast({ title: 'Error', description: 'Please check at least one test', status: 'error' });
      return;
    }

    try {
      const response = await AudiometryService.saveOrUpdate(audiogram);
      if (response.status) {
        //toast({ title: 'Success', description: response.message, status: 'success' });
        navigate(`/admin/patients/diagnosis/audiogram/patientId/${audiogram.patient.id}`);
      } else {
        //toast({ title: 'Error', description: response.message, status: 'error' });
      }
    } catch (error) {
      console.error('Error saving audiogram:', error);
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
      //toast({ title: 'Success', description: 'Report Generated Successfully!', status: 'success' });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <h1>Audiometry Assessment</h1>
      <form onSubmit={onSubmit}>
        <div>
          <Checkbox
            checked={audiogram.modality.acuChecked}
            onChange={() => updateModality('acu')}
          >
            AC U
          </Checkbox>
          {/* Add other checkboxes similarly */}
        </div>

        <canvas ref={chartLeftRef}></canvas>
        <canvas ref={chartRightRef}></canvas>

        <div>
          <Button type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Save Report</Button>
          <Button type="button" onClick={print}>
            Save & Print
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AudiometryForm;