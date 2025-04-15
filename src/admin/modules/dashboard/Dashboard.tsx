
import React from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to admin dashboard by default
    navigate("/admin/dashboard/admin");
  }, [navigate]);
  
  return (
    <AdminLayout>
      {/* This is the default dashboard, it will redirect */}
    </AdminLayout>
  );
};

export default Dashboard;
