
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../components/PatientList";
import Patients from "../pages/Patients";
import PatientView from "../components/PatientView";
import PatientPrescription from "../components/PatientPrescription";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/list" element={<PatientList />} />
      <Route path="/view/:id" element={<PatientView />} />
      <Route path="/prescription/:id" element={<PatientPrescription />} />
    </Routes>
  );
};

export default PatientRoutes;
