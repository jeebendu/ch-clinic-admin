
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const DoctorList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Doctors" 
        showAddButton={true}
        addButtonLabel="Add Doctor"
        onAddButtonClick={() => console.log("Add doctor clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Doctor list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default DoctorList;
