
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const ReportList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Doctor Reports" 
        showAddButton={false}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Doctor reports page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default ReportList;
