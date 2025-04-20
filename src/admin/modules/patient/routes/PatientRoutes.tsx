
import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientList from "../pages/PatientList";
import PatientSidebar from "../components/PatientSidebar";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientList />} />
      <Route path="/:id" element={<PatientSidebar />} />
    </Routes>
  );
};

export default PatientRoutes;
