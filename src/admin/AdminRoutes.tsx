
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppointmentsAdmin from "./modules/appointments/pages/Appointments";
import PatientsAdmin from "./modules/patients/pages/Patients";
import Schedule from "./pages/Schedule";
import DoctorAvailability from "./pages/DoctorAvailability";
import { ProcessAppointment } from "./modules/appointments/pages/ProcessAppointment";
import "./styles/admin.css";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<AppointmentsAdmin />} />
      <Route path="/appointments/process/:appointmentId" element={<ProcessAppointment />} />
      <Route path="/patients" element={<PatientsAdmin />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/doctor-availability" element={<DoctorAvailability />} />
      <Route path="/:section" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
