
import { Route, Routes, Navigate } from "react-router-dom";
import UsersList from "./pages/UsersList";
import LoginHistoryList from "./submodules/login-history/pages/LoginHistoryList";
import RolesList from "./submodules/roles/pages/RolesList";
import { useRoleAccess } from "@/hooks/use-role-access";
import AuthService from "@/services/authService";

const UserRoutes = () => {
  // Ensure only Admin can access user management
  const { hasAccess } = useRoleAccess(['Admin']);
  
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
      <Route path="/" element={<UsersList />} />
      <Route path="/users/*" element={<UsersList />} />
      <Route path="/login-history/*" element={<LoginHistoryList />} />
      <Route path="/roles/*" element={<RolesList />} />
    </Routes>
  );
};

export default UserRoutes;
