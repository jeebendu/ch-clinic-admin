
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../components/PatientList";
import Patients from "../pages/Patients";
import PatientView from "../components/PatientView";
import PatientPrescription from "../components/PatientPrescription";
import VisitDetails from "../components/VisitDetails";
import VisitRoutes from "../submodules/visit/routes/VisitRoutes";

// Import report view components
import AudiometryReportView from "../components/reports/views/AudiometryReportView";
import BeraReportView from "../components/reports/views/BeraReportView";
import ABRReportView from "../components/reports/views/ABRReportView";
import SpeechReportView from "../components/reports/views/SpeechReportView";
import LaboratoryReportView from "../components/views/LaboratoryReportView";

// Import report form components
import AudiometryForm from "../components/reports/AudiometryForm";
import BeraForm from "../components/reports/BeraForm";
import ABRForm from "../components/reports/ABRForm";
import SpeechForm from "../components/reports/SpeechForm";
import LaboratoryReportForm from "../components/forms/LaboratoryReportForm";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/list" element={<PatientList />} />
      <Route path="/visits/*" element={<VisitRoutes />} />
      <Route path="/view/:id" element={<PatientView />} />
      <Route path="/prescription/:id" element={<PatientPrescription />} />
      <Route path="/visit/:id" element={<VisitDetails />} />
      
      <Route path="/report/audiometry/:id" element={<AudiometryReportView />} />
      <Route path="/report/bera/:id" element={<BeraReportView />} />
      <Route path="/report/abr/:id" element={<ABRReportView />} />
      <Route path="/report/speech/:id" element={<SpeechReportView />} />
      <Route path="/report/laboratory/:id" element={<LaboratoryReportView />} />

      <Route path="/report/new/audiometry/:patientId" element={<AudiometryForm />} />
      <Route path="/report/new/bera/:patientId" element={<BeraForm standalone={true} />} />
      <Route path="/report/new/abr/:patientId" element={<ABRForm standalone={true} />} />
      <Route path="/report/new/speech/:patientId" element={<SpeechForm standalone={true} />} />
      <Route path="/report/new/laboratory/:patientId" element={<LaboratoryReportForm />} />
    </Routes>
  );
};

export default PatientRoutes;
