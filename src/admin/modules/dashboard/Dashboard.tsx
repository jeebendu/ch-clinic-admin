
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
    <>
      <div>
        Redirecting to {userRole.toLowerCase()} dashboard...
      </div>
    </>
  );
};

export default Dashboard;
