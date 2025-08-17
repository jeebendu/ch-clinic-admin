
import { Routes, Route, Outlet } from "react-router-dom";
import "./styles/admin.css";
import DashboardRoutes from "./modules/dashboard/routes/DashboardRoutes";
import AppointmentRoutes from "./modules/appointments/routes/AppointmentRoutes";
import PatientRoutes from "./modules/patient/routes/PatientRoutes";
import BranchRoutes from "./modules/branch/routes/BranchRoutes";
import DoctorRoutes from "./modules/doctor/DoctorRoutes";
import UserRoutes from "./modules/user/UserRoutes";
import CoreRoutes from "./modules/core/routes/CoreRoutes";
import ExpenseRoutes from "./modules/expense/routes/ExpenseRoutes";
import SequenceRoutes from "./modules/config/submodules/sequence/routes/SequenceRoutes";
import CourierRoutes from "./modules/config/submodules/courier/routes/CourierRoutes";
import DistributorRoutes from "./modules/config/submodules/distributor/routes/DistributorRoutes";
import ProductRoutes from "./modules/inventory/product/routes/ProductRoutes";
import CategoryRoutes from "./modules/inventory/category/routes/CategoryRoutes";
import RepairCompanyRoutes from "./modules/config/submodules/repairCompany/routes/RepairCompanyRoutes";
import BrandRoutes from "./modules/inventory/brand/routes/BrandRoutes";
import ProductTypeRoutes from "./modules/inventory/product-type/routes/ProductTypeRoutes";
import SalesOrderList from "./modules/sales/pages/SalesOrderList";
import PurchaseOrderList from "./modules/purchase/pages/PurchaseOrderList";
import EnquiryRoutes from "./modules/patient/submodules/enquiry/routes/EnquiryRoutes";
import MedicalCouncilList from "./modules/doctor/submodules/medical-council/pages/MedicalCouncilList";
import MedicalDegreeList from "./modules/doctor/submodules/medical-degree/pages/MedicalDegreeList";
import ReportsRoutes from "./modules/reports/routes/ReportsRoutes";
import AudiometryRoutes from "./modules/audiometry/routes/AudiometryRoutes";
import EnquiryServiceTypeRoutes from "./modules/clinics/enquiry-service/routes/EnquiryServiceTypeRoutes";
import LabRoutes from "./modules/lab/routes/LabRoutes";
import AdminLayout from "./components/AdminLayout";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Layout route wraps all admin routes */}

       <Route path="appointments/*" element={<AppointmentRoutes />} />
       <Route path="patients/*" element={<PatientRoutes />} />

      <Route element={<AdminLayout><Outlet /></AdminLayout>}>
        <Route path="/" element={<DashboardRoutes />} />
        <Route path="dashboard/*" element={<DashboardRoutes />} />
        <Route path="branch/*" element={<BranchRoutes />} />
        <Route path="sequence/*" element={<SequenceRoutes />} />
        <Route path="repair-company/*" element={<RepairCompanyRoutes />} />
        <Route path="courier/*" element={<CourierRoutes />} />
        <Route path="distributor/*" element={<DistributorRoutes />} />
        <Route path="product/*" element={<ProductRoutes />} />
        <Route path="category/*" element={<CategoryRoutes />} />
        <Route path="brand/*" element={<BrandRoutes />} />
        <Route path="product-type/*" element={<ProductTypeRoutes />} />
        <Route path="doctor/*" element={<DoctorRoutes />} />
        <Route path="users/*" element={<UserRoutes />} />
        <Route path="expense/*" element={<ExpenseRoutes />} />
        <Route path="core/*" element={<CoreRoutes />} />
        <Route path="reports/*" element={<ReportsRoutes />} />
        <Route path=":section" element={<DashboardRoutes />} />
        <Route path="enquiry/*" element={<EnquiryRoutes />} />
        <Route path="salesOrder/*" element={<SalesOrderList />} />
        <Route path="purchaseOrder/*" element={<PurchaseOrderList />} />
        <Route path="medical-council/*" element={<MedicalCouncilList />} />
        <Route path="medical-degree/*" element={<MedicalDegreeList />} />
        <Route path="service/*" element={<EnquiryServiceTypeRoutes />} />
        <Route path="audiometry/*" element={<AudiometryRoutes />} />
        <Route path="lab/*" element={<LabRoutes />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
