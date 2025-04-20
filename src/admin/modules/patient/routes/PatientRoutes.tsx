
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../pages/PatientList";
import { PatientDetails } from "../components/PatientSidebar";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientList />} />
      <Route path="/:id" element={<PatientDetails />} />
    </Routes>
  );
};

export default PatientRoutes;
