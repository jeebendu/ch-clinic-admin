
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import AdminDashboard from "../components/AdminDashboard";
import DoctorDashboard from "../components/DoctorDashboard";
import StaffDashboard from "../components/StaffDashboard";
import AuthService from "@/services/authService";
import { useRoleAccess } from "@/hooks/use-role-access";

// Role-based access component
const RoleProtectedRoute = ({ 
  element, 
  allowedRoles 
}: { 
  element: JSX.Element, 
  allowedRoles: string | string[] 
}) => {
  const hasAccess = AuthService.hasRole(allowedRoles);
  
  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
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
  
  return element;
};

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route 
        path="/admin" 
        element={<RoleProtectedRoute element={<AdminDashboard />} allowedRoles="Admin" />} 
      />
      <Route 
        path="/doctor" 
        element={<RoleProtectedRoute element={<DoctorDashboard />} allowedRoles={["Doctor", "Admin"]} />} 
      />
      <Route 
        path="/staff" 
        element={<RoleProtectedRoute element={<StaffDashboard />} allowedRoles={["Staff", "Admin"]} />} 
      />
    </Routes>
  );
};

export default DashboardRoutes;
