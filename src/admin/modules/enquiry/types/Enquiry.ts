import { Branch } from "../../branch/types/Branch";
import { Country } from "../../core/types/Country";
import { District } from "../../core/types/District";
import { State } from "../../core/types/State";
import { Source } from "../../user/types/Source";
import { Staff } from "../../user/types/User";

export interface EnquiryServiceType {
    id: number;
    name: string;
    price: number;
}

export interface Enquiry {
    id: number;
    followUpList: FollowedUpDateList[];
    enquiryServiceType?: EnquiryServiceType;
    country?: Country;
    state?: State;
    relationship?: Relationship;
    branch: Branch;
    district?: District;
    firstName: string;
    lastName: string;
    mobile: string;
    leadDate: Date;
    followUpBy: string;
    source: Source;
    status: Status;
    city: string;
    countryCode: string;
    remark: string;
    needs: string;
    notes: string;
    staff: Staff;
  }
  
  export class Relationship {
    id: number;
    name: string;
}
export class Status {
    id!: number;
    name!: string;
    module: Module = new Module;
    
}
export class Module{
    id: number
    name: string
}

export class FollowedUpDateList {
    id: number;
    followUpDate:Date=new Date();
    followUpBy: Staff;
    remark: string;
    enquiry:Enquiry;
    nextFollowUpDate!: Date;
    nextFollowUpTime:any;
    followUpTime:any;
}