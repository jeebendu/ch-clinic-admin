
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const LoginHistoryList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Login History" 
        showAddButton={false}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Login history list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default LoginHistoryList;
