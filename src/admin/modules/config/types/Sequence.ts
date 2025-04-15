
import { Module } from "../../users/types/User";

export interface Sequence {
  id: number;
  includeBranchCode: boolean;
  includeYear: boolean;
  incrementLastFinal: string;
  incrementLastId: number;
  incrementPadChar: number;
  incrementPadLength: number;
  incrementPrefix: string;
  module?: Module;
  name?: string;
  prefix?: string;
  suffix?: string;
  nextNumber?: number;
  digits?: number;
}
