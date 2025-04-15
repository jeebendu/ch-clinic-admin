import { Plan } from "./role";


export interface Clinic {
    
    id: number;
    uid: string;
    name: string;
    email: string;
    contact: string;
    address: string;
    plan:Plan;
}


export interface Element {
    selected?: any;
    id: number;
    uid: string;
    name: string;
    email: string;
    contact: string;
    address: string;
    plan:Plan;
  }