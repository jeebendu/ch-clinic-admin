import { Module } from "@/admin/modules/core/types/Module";



export interface Sequence {
  id: number;
  includeBranchCode: boolean;
  includeYear: boolean;
  incrementLastFinal: string;
  incrementLastId: number;
  incrementPadChar: string;
  incrementPadLength: string;
  incrementPrefix: string;
  module?: Module;
}