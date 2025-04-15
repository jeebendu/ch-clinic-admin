import { Country } from "../Address";
import { District } from "../Address";
import { Doctor } from "../Doctor";
import { State } from "../Address";

export interface AppoinmentRequest {

    id:number;
    firstName:String;
    lastName:String;
    email:String;
    phone:number;
    dob:Date;
    gender:number;
    district:District;
    state:State;
    country:Country;
    city:String;
    appointmentDate:String;
    isAccept:boolean;
    isReject:boolean;
    doctor:Doctor;
    appointmentType:appointmentType;
    visitType:visitType;
    // status
    
}

export interface SearchRequest {
    date:Date;
}

export interface StatusUpdate {
    status:Boolean;
}


export interface visitType {
    id:number;
    name:String;
}


export interface appointmentType {
    id:number;
    name:String;
}
