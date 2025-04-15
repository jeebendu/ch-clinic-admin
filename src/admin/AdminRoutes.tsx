
import { Routes, Route } from "react-router-dom";
import "./styles/admin.css";

// Import modular routes
import AppointmentRoutes from "./modules/appointments/routes/AppointmentRoutes";
import PatientRoutes from "./modules/patients/routes/PatientRoutes";
import DashboardRoutes from "./modules/dashboard/routes/DashboardRoutes";
import BranchRoutes from "./modules/branch/routes/BranchRoutes";
import CatalogRoutes from "./modules/catalog/routes/CatalogRoutes";
import ConfigRoutes from "./modules/config/routes/ConfigRoutes";
import CoreRoutes from "./modules/core/routes/CoreRoutes";
import CustomerRoutes from "./modules/customer/routes/CustomerRoutes";
import DoctorRoutes from "./modules/doctor/routes/DoctorRoutes";
import ExpenseRoutes from "./modules/expense/routes/ExpenseRoutes";
import PaymentRoutes from "./modules/payment/routes/PaymentRoutes";
import PurchaseRoutes from "./modules/purchase/routes/PurchaseRoutes";
import SalesRoutes from "./modules/sales/routes/SalesRoutes";
import UserRoutes from "./modules/users/routes/UserRoutes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoutes />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/appointments/*" element={<AppointmentRoutes />} />
      <Route path="/patients/*" element={<PatientRoutes />} />
      <Route path="/branch/*" element={<BranchRoutes />} />
      <Route path="/catalog/*" element={<CatalogRoutes />} />
      <Route path="/config/*" element={<ConfigRoutes />} />
      <Route path="/core/*" element={<CoreRoutes />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/doctor/*" element={<DoctorRoutes />} />
      <Route path="/expense/*" element={<ExpenseRoutes />} />
      <Route path="/payment/*" element={<PaymentRoutes />} />
      <Route path="/purchase/*" element={<PurchaseRoutes />} />
      <Route path="/sales/*" element={<SalesRoutes />} />
      <Route path="/users/*" element={<UserRoutes />} />
      <Route path="/:section" element={<DashboardRoutes />} />
    </Routes>
  );
};

export default AdminRoutes;
