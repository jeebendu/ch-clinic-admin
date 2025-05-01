
import { Route, Routes, Navigate } from "react-router-dom";
import DoctorList from "./pages/DoctorList";
import SpecializationList from "./submodules/specialization/pages/SpecializationList";
import ServiceList from "./submodules/services/pages/ServiceList";
import PercentageList from "./submodules/percentage/pages/PercentageList";
import AvailabilityList from "./submodules/availability/pages/AvailabilityList";
import ReportList from "./submodules/reports/pages/ReportList";
import { useRoleAccess } from "@/hooks/use-role-access";
import AuthService from "@/services/authService";
import SpecialityList from "./doctor-speciality/pages/SpecialityList";
import DoctorDetailView from "./pages/DoctorDetailView";

const DoctorRoutes = () => {
  // Role-based access control for doctor module
  const { hasAccess } = useRoleAccess(['Admin', 'Doctor']);
  
  if (!hasAccess) {
    const userRole = AuthService.getUserRole();
    let redirectPath = '/admin/dashboard';
    
    switch (userRole) {
      case 'Admin':
        redirectPath = '/admin/dashboard/admin';
        break;
      case 'Doctor':
        redirectPath = '/admin/dashboard/doctor';
        break;
      case 'Staff':
        redirectPath = '/admin/dashboard/staff';
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<DoctorList />} />
      <Route path="/doctors/*" element={<DoctorList />} />
      <Route path="/view/:id" element={<DoctorDetailView />} />
      <Route path="/specializations/*" element={<SpecializationList />} />
      <Route path="/services/*" element={<ServiceList />} />
      <Route path="/percentages/*" element={<PercentageList />} />
      <Route path="/availability/*" element={<AvailabilityList />} />
      <Route path="/reports/*" element={<ReportList />} />
      <Route path="/speciality/*" element={<SpecialityList />} />
    </Routes>
  );
};

export default DoctorRoutes;
