
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard";
import AdminDashboard from "../components/AdminDashboard";
import DoctorDashboard from "../components/DoctorDashboard";
import StaffDashboard from "../components/StaffDashboard";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/staff" element={<StaffDashboard />} />
    </Routes>
  );
};

export default DashboardRoutes;
