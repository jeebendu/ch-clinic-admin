import { Patient } from "@/admin/types/patient";


export interface ReportSpeech {
    id: number;
    informant: string;
    briefHistory: string;
    presentingComplaint: string;
    medicalHistory: string;
    familyHistory: string;
    recommendations: string;
    developmentHistory: string;
    sensoryDevelopment: string;
    speechDevelopment: string;
    languageUse: string;
    dailyLeaving: string;
    educationHistory: string;
    prelinguisticSkills: string;
    speechLanguage: string;
    oralPeripheral: string;
    oralStructure: string;
    oralFunction: string;
    provisionalDiagnosis: string;
    languageTestAdministered: string;
    reportno: number;
    patient: Patient;
    createdTime: string;
    modifiedTime: string;
}