
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const EnquiryList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Patient Enquiries" 
        showAddButton={true}
        addButtonLabel="Add Enquiry"
        onAddButtonClick={() => console.log("Add enquiry clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Enquiry list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default EnquiryList;
