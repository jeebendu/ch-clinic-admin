import { Repair, RepairStatus } from "./Repair";

export interface RepairCourier {
    id?: number;
    repair:Repair;
    repairStatus:RepairStatus;
    courier:Courier;
    
    date:Date;
    shipmentType:ShipmentType;
    amount:number;
    sendDate:Date;
    sendBy:string;
    recievedDate:Date;
    recievedBy:string;
    trackNo:string;
    cost:string;
}

export interface Courier {
    id:number
    name:string
  
    websiteUrl:string;
    apiUrl:string;
   
}
export interface ShipmentType {
    id:number;
    name:string;
  }
