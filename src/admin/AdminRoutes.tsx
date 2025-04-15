
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import DoctorAvailability from "./pages/DoctorAvailability";
import "./styles/admin.css";

// Import modular routes
import AppointmentRoutes from "./modules/appointments/routes/AppointmentRoutes";
import PatientRoutes from "./modules/patients/routes/PatientRoutes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments/*" element={<AppointmentRoutes />} />
      <Route path="/patients/*" element={<PatientRoutes />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/doctor-availability" element={<DoctorAvailability />} />
      <Route path="/:section" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
