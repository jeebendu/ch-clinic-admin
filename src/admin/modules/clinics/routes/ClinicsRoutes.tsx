
import { Route, Routes } from "react-router-dom";
import ClinicsList from "../pages/ClinicsList";
import ClinicRequestsList from "../pages/ClinicRequestsList";
import ClinicDetail from "../pages/ClinicDetail";

const ClinicsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClinicsList />} />
      <Route path="/requests" element={<ClinicRequestsList />} />
      <Route path="/:id" element={<ClinicDetail />} />
    </Routes>
  );
};

export default ClinicsRoutes;
