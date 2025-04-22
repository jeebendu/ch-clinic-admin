
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
import SequenceRoutes from "./modules/config/submodules/sequence/routes/SequenceRoutes";
import CourierRoutes from "./modules/config/submodules/courier/routes/CourierRoutes";
import DistributorRoutes from "./modules/config/submodules/distributor/routes/DistributorRoutes";
import ProductRoutes from "./modules/inventory/product/routes/ProductRoutes";
import CategoryRoutes from "./modules/inventory/category/routes/CategoryRoutes";
import BrandRoutes from "./modules/inventory/brand/routes/BrandRoutes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoutes />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/appointments/*" element={<AppointmentRoutes />} />
      <Route path="/patients/*" element={<PatientRoutes />} />
      <Route path="/branch/*" element={<BranchRoutes />} />
      <Route path="/sequence/*" element={<SequenceRoutes />} />
      <Route path="/repair-company/*" element={<RepairCompanyRoutes />} />
      <Route path="/courier/*" element={<CourierRoutes />} />
      <Route path="/distributor/*" element={<DistributorRoutes />} />
      <Route path="/product/*" element={<ProductRoutes/>} />
      <Route path="/category/*" element={<CategoryRoutes/>} />
      <Route path="/category/*" element={<CategoryRoutes/>} />
      <Route path="/brand/*" element={<BrandRoutes />} />
      <Route path="/doctor/*" element={<DoctorRoutes />} />
      <Route path="/users/*" element={<UserRoutes />} />
      <Route path="/expense/*" element={<ExpenseRoutes/>} />
      <Route path="/core/*" element={<CoreRoutes />} />
      <Route path="/:section" element={<DashboardRoutes />} />
    </Routes>
  );
};

export default AdminRoutes;
