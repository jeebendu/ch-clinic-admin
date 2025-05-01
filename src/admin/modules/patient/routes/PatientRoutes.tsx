
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../components/PatientList";
import Patients from "../pages/Patients";
import PatientView from "../components/PatientView";
import PatientPrescription from "../components/PatientPrescription";
import VisitDetails from "../components/VisitDetails";

// Import report view components
import AudiometryReportView from "../components/reports/views/AudiometryReportView";
import BeraReportView from "../components/reports/views/BeraReportView";
import ABRReportView from "../components/reports/views/ABRReportView";
import SpeechReportView from "../components/reports/views/SpeechReportView";

// Import report form components
import AudiometryForm from "../components/reports/AudiometryForm";
import BeraForm from "../components/reports/BeraForm";
import ABRForm from "../components/reports/ABRForm";
import SpeechForm from "../components/reports/SpeechForm";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/list" element={<PatientList />} />
      <Route path="/view/:id" element={<PatientView />} />
      <Route path="/prescription/:id" element={<PatientPrescription />} />
      <Route path="/visit/:id" element={<VisitDetails />} />
      
      {/* Report view routes */}
      <Route path="/report/audiometry/:id" element={<AudiometryReportView />} />
      <Route path="/report/bera/:id" element={<BeraReportView />} />
      <Route path="/report/abr/:id" element={<ABRReportView />} />
      <Route path="/report/speech/:id" element={<SpeechReportView />} />
      
      {/* Report form routes - for creating new reports */}
      <Route path="/report/new/audiometry/:patientId" element={<AudiometryForm standalone={true} />} />
      <Route path="/report/new/bera/:patientId" element={<BeraForm standalone={true} />} />
      <Route path="/report/new/abr/:patientId" element={<ABRForm standalone={true} />} />
      <Route path="/report/new/speech/:patientId" element={<SpeechForm standalone={true} />} />
    </Routes>
  );
};

export default PatientRoutes;
