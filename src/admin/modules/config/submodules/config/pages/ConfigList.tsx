
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ConfigList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="System Configuration" 
        showAddButton={false}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>System configuration page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ConfigList;
