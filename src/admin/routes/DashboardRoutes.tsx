
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Schedule from "../pages/Schedule";
import DoctorAvailability from "../pages/DoctorAvailability";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/doctor-availability" element={<DoctorAvailability />} />
    </Routes>
  );
};

export default DashboardRoutes;
