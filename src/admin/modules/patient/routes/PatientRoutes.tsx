
import React, { useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import PatientList from "../pages/PatientList";
import PatientSidebar from "../components/PatientSidebar";
import PatientService from "../services/patientService";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "../types/Patient";

const PatientSidebarWrapper = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  
  const { data: patient } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) return null;
      return await PatientService.getById(parseInt(id));
    },
    enabled: !!id
  });
  
  if (!patient) return null;
  
  return (
    <PatientSidebar 
      patient={patient} 
      onClose={() => setIsOpen(false)} 
    />
  );
};

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientList />} />
      <Route path="/:id" element={<PatientSidebarWrapper />} />
    </Routes>
  );
};

export default PatientRoutes;
