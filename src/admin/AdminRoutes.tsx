
import { Routes, Route } from "react-router-dom";
import "./styles/admin.css";
import DashboardRoutes from "./modules/dashboard/routes/DashboardRoutes";
import AppointmentRoutes from "./modules/appointments/routes/AppointmentRoutes";
import PatientRoutes from "./modules/patient/routes/PatientRoutes";
import BranchRoutes from "./modules/branch/routes/BranchRoutes";
import CustomerRoutes from "./modules/customer/routes/CustomerRoutes";
import DoctorRoutes from "./modules/doctor/DoctorRoutes";
import UserRoutes from "./modules/user/UserRoutes";
import CoreRoutes from "./modules/core/routes/CoreRoutes";
import ExpenseRoutes from "./modules/expense/routes/ExpenseRoutes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoutes />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/appointments/*" element={<AppointmentRoutes />} />
      <Route path="/patients/*" element={<PatientRoutes />} />
      <Route path="/branch/*" element={<BranchRoutes />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/doctor/*" element={<DoctorRoutes />} />
      <Route path="/users/*" element={<UserRoutes />} />
      <Route path="/expense/*" element={<ExpenseRoutes/>} />
      <Route path="/core/*" element={<CoreRoutes />} />
      <Route path="/:section" element={<DashboardRoutes />} />
    </Routes>
  );
};

export default AdminRoutes;
