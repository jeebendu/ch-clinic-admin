
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
    </Routes>
  );
};

export default PatientRoutes;
