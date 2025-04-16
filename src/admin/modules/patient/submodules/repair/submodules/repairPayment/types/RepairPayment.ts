import { RepairStatus } from "@/admin/modules/patient/types/PatientRepair";
import { PaymentType, Repair } from "../../../types/Repair";


export interface RepairPayment {
    id?: number;
    repairStatus: RepairStatus;
    repair: Repair;
    paymentType: PaymentType;
    date: Date;
    amount: number;
}