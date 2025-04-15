
import { Route, Routes } from "react-router-dom";
import Dashboard from "@/admin/pages/Dashboard";
import Schedule from "@/admin/pages/Schedule";
import DoctorAvailability from "@/admin/pages/DoctorAvailability";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/doctor-availability" element={<DoctorAvailability />} />
    </Routes>
  );
};

export default DashboardRoutes;
