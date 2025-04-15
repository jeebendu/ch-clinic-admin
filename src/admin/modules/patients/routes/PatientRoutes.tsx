
import { Route, Routes } from "react-router-dom";
import PatientsAdmin from "../pages/Patients";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientsAdmin />} />
    </Routes>
  );
};

export default PatientRoutes;
