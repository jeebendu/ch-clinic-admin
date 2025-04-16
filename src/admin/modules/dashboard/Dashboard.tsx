
import React from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthService from "@/services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = AuthService.getUserRole();
  
  useEffect(() => {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'Admin':
        navigate("/admin/dashboard/admin");
        break;
      case 'Doctor':
        navigate("/admin/dashboard/doctor");
        break;
      case 'Staff':
        navigate("/admin/dashboard/staff");
        break;
      default:
        navigate("/admin/dashboard/admin");
    }
  }, [navigate, userRole]);
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Redirecting to {userRole.toLowerCase()} dashboard...</div>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
