import { Module } from "./Module"


export interface Sequence {
    id:number
    includeBranchCode:boolean
    includeYear: boolean
  incrementLastFinal: string
  incrementLastId: number
  incrementPadChar: number
  incrementPadLength: number
  incrementPrefix:string
  module?:Module;
}
