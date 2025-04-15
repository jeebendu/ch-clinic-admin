
import React from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";

const SliderList = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Website Sliders" 
        showAddButton={true}
        addButtonLabel="Add Slider"
        onAddButtonClick={() => console.log("Add slider clicked")}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <p>Slider list page - coming soon</p>
      </div>
    </AdminLayout>
  );
};

export default SliderList;
