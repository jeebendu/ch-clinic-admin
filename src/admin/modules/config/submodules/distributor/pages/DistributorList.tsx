
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const DistributorList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Distributors" 
        showAddButton={true}
        addButtonLabel="Add Distributor"
        onAddButtonClick={() => console.log("Add distributor clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Distributor list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default DistributorList;
