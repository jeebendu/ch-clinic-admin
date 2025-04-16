import { Staff } from "@/admin/modules/user/types/User";
import { Repair } from "../../../types/Repair";


export interface RepairTestDelivery {
    repair: Repair;
    hearingAddCheckedBy: Staff;
    checkDate: Date;
    informedToPatientBy: Staff;
    informedDate: Date;
    recievedBy: string;
    recievedDate: Date;
    givenBy: Staff;
    givenDate: Date;
}