
import { getEnvVariable } from "@/utils/envUtils";
import axios from "axios";

const API_URL = getEnvVariable('API_URL');

interface Audiogram {
  id: number;
  patient: {
    id: number;
    firstname?: string;
    lastname?: string;
  };
  uid?: string;
  modality: {
    acuChecked?: boolean;
    acmChecked?: boolean;
    bcuChecked?: boolean;
    bcmChecked?: boolean;
    norChecked?: boolean;
  };
  puretoneLeft: any;
  puretoneRight: any;
  earLeft: any[];
  earRight: any[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

const AudiometryService = {
  /**
   * Save and print PDF for the audiogram.
   * @param {FormData} formData - The form data containing chart files.
   * @param {number} id - The ID of the audiogram.
   * @returns {Promise<Blob>} - The generated PDF as a Blob.
   */
  saveAndPrintPdf: async (formData: FormData, id: number): Promise<ArrayBuffer> => {
    try {
      const response = await axios.post(`${API_URL}/v1/patient/audiometry/print/id/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (error) {
      console.error("Error saving and printing PDF:", error);
      throw error;
    }
  },

  /**
   * Get the list of all audiograms.
   * @returns {Promise<Array>} - List of audiograms.
   */
  list: async (): Promise<Audiogram[]> => {
    try {
      const response = await axios.get(`${API_URL}/v1/patient/audiometry/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audiogram list:", error);
      throw error;
    }
  },

  /**
   * Get the list of audiograms by patient ID.
   * @param {number} patientId - The ID of the patient.
   * @returns {Promise<Array>} - List of audiograms for the patient.
   */
  listByPatientId: async (patientId: number): Promise<Audiogram[]> => {
    try {
      const response = await axios.get(`${API_URL}/v1/patient/audiometry/patientId/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audiograms by patient ID:", error);
      throw error;
    }
  },

  /**
   * Delete an audiogram by ID.
   * @param {number} id - The ID of the audiogram to delete.
   * @returns {Promise<Object>} - The response from the server.
   */
  deleteById: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/v1/patient/audiometry/delete/id/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting audiogram by ID:", error);
      throw error;
    }
  },

  /**
   * Get an audiogram by ID.
   * @param {number} id - The ID of the audiogram.
   * @returns {Promise<Object>} - The audiogram data.
   */
  getById: async (id: number): Promise<Audiogram> => {
    try {
      const response = await axios.get(`${API_URL}/v1/patient/audiometry/id/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audiogram by ID:", error);
      throw error;
    }
  },

  /**
   * Save or update an audiogram.
   * @param {Object} audiogram - The audiogram data to save or update.
   * @returns {Promise<Object>} - The response from the server.
   */
  saveOrUpdate: async (audiogram: Audiogram): Promise<ApiResponse> => {
    try {
      const response = await axios.post(`${API_URL}/v1/patient/audiometry/saveOrUpdate`, audiogram);
      return response.data;
    } catch (error) {
      console.error("Error saving or updating audiogram:", error);
      throw error;
    }
  },

  /**
   * Get a paginated list of audiograms.
   * @param {number} pageNo - The page number.
   * @param {number} size - The number of items per page.
   * @returns {Promise<Object>} - The paginated list of audiograms.
   */
  paginatedList: async (pageNo: number, size: number): Promise<{
    content: Audiogram[];
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      const response = await axios.get(`${API_URL}/v1/patient/audiometry/list/${pageNo}/${size}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated audiogram list:", error);
      throw error;
    }
  },
};

export default AudiometryService;
