// v1/appointment/prescription


import http from "@/lib/JwtInterceptor";
import { Doctor } from "../../doctor/types/Doctor";
import axios from "axios";
import { getEnvVariable } from "@/utils/envUtils";
import { getTenantId } from "@/utils/tenantUtils";
import { Prescription } from "../../patient/types/Prescription";

const BASE_URL = getEnvVariable('BASE_URL');
const X_APP_TOKEN = getEnvVariable('X_APP_TOKEN');


export const createPrescription = async (id: number,prescrioption:any) => {
    const token = localStorage.getItem('auth_token');
    const config = {
      headers: {
        'X-App-Token': X_APP_TOKEN,
        'tenant': getTenantId(),
        'Accept':"application/json",
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      responseType: 'arraybuffer' as 'json'
    };
  
    const response= await axios.post<any>(`${BASE_URL}/v1/appointment/prescription/saveOrUpdate/appointment/id/${id}`, prescrioption, config);
 
var blob = new Blob([response.data], { type: "application/pdf" });;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prescription.pdf'; // or extract from content-disposition if available
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

};