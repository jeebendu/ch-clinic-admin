
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../components/PatientList";
import Patients from "../pages/Patients";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/list" element={<PatientList />} />
    </Routes>
  );
};

export default PatientRoutes;
