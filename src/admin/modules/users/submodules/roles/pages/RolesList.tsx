
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const RolesList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Roles & Permissions" 
        showAddButton={true}
        addButtonLabel="Add Role"
        onAddButtonClick={() => console.log("Add role clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Roles list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default RolesList;
