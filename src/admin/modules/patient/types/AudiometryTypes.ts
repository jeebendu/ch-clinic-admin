
import { Patient } from "./Patient";
import { Branch } from "../../branch/types/Branch";

// Chart types
export type PointStyle = 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | HTMLImageElement;

export interface ChartDataset {
  data: (number | null)[];
  label: string;
  borderWidth?: number;
  backgroundColor?: string;
  pointRadius?: number;
  pointBackgroundColor?: string;
  tension?: number;
  spanGaps?: boolean;
  borderColor?: string;
  pointBorderColor?: string;
  pointStyle?: string | HTMLImageElement;
  borderDash?: number[];
}

export interface ChartConfiguration {
  data: {
    datasets: ChartDataset[];
    labels: string[];
  };
  options?: any;
}

export interface ChartOptions {
  responsive?: boolean;
  scales?: any;
  plugins?: any;
}

// Audiometry data models
export class Dataset {
  label: string;
  value: number | null;

  constructor(label: string, value: number | null) {
    this.label = label;
    this.value = value;
  }
}

export class DataMap {
  key: string | number;
  value: string | number | boolean | null;

  constructor(key: string, value: string | number | boolean | null) {
    this.key = key;
    this.value = value;
  }
}

export class Modality {
  acuChecked: boolean = false;
  acmChecked: boolean = false;
  bcuChecked: boolean = false;
  bcmChecked: boolean = false;
  norChecked: boolean = false;
}

export class Puretone {
  acu: Dataset[];
  acm: Dataset[];
  bcu: Dataset[];
  bcm: Dataset[];
  nor: Dataset[];

  constructor(labels: string[] = FREQUENCY_LABELS) {
    this.acu = labels.map(item => new Dataset(item, null));
    this.acm = labels.map(item => new Dataset(item, null));
    this.bcu = labels.map(item => new Dataset(item, null));
    this.bcm = labels.map(item => new Dataset(item, null));
    this.nor = labels.map(item => new Dataset(item, null));
  }
}

export class Audiogram {
  id?: number;
  uid?: string;
  branch?: Branch;
  puretoneLeft: Puretone;
  puretoneRight: Puretone;
  earLeft: DataMap[];
  earRight: DataMap[];
  testLeft: DataMap[];
  testRight: DataMap[];
  impedanceAudiometry?: string;
  proDiagnosisLeft?: string;
  proDiagnosisRight?: string;
  recommendation?: string;
  patient?: Patient;
  modality: Modality;
  createdTime?: string;
  modifiedTime?: string;
  visitId?: string;

  constructor() {
    const freqLabelList = EAR_TEST_LABELS;
    const earLabelList = EAR_LABEL_LIST;
    
    this.puretoneLeft = new Puretone(FREQUENCY_LABELS);
    this.puretoneRight = new Puretone(FREQUENCY_LABELS);
    this.earLeft = freqLabelList.map(item => new DataMap(item, null));
    this.earRight = freqLabelList.map(item => new DataMap(item, null));
    this.testLeft = earLabelList.map(item => new DataMap(item, null));
    this.testRight = earLabelList.map(item => new DataMap(item, null));
    this.modality = new Modality();
  }
}

// Constants for audiometry
export const FREQUENCY_LABELS = ['250', '500', '1000', '2000', '3000', '4000', '6000', '8000'];
export const EAR_TEST_LABELS = ["PTA", "SAT", "SRT", "SDS", "MCL", "UCL"];
export const EAR_LABEL_LIST = ["RINNE", "WEBER"];

// Chart configuration constants
export const AUDIOMETRY_CHART_OPTIONS: ChartOptions = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 10
      },
      min: -10,
      max: 120,
      reverse: true
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

// Helper functions for creating chart datasets
export const createBaseChartData = (
  label: string,
  pointStyle: string | HTMLImageElement,
  color: string,
  borderDash?: number[]
): ChartDataset => {
  const dataset: ChartDataset = {
    data: [],
    label: label,
    borderWidth: 1,
    backgroundColor: 'transparent',
    pointRadius: 8,
    pointBackgroundColor: 'transparent',
    tension: 0,
    spanGaps: true,
    borderColor: color,
    pointBorderColor: color,
    pointStyle: pointStyle,
  };

  if (borderDash) {
    dataset.borderDash = borderDash;
  }

  return dataset;
};
