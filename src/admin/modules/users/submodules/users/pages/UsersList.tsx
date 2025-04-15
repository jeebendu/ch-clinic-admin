
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const UsersList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Users" 
        showAddButton={true}
        addButtonLabel="Add User"
        onAddButtonClick={() => console.log("Add user clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Users list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default UsersList;
