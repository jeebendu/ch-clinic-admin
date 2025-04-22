
import { Route, Routes } from "react-router-dom";
import Patients from "../pages/Patients";
import EnquiryList from "../submodules/enquiry/pages/EnquiryList";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Patients />} />
      <Route path="/list" element={<Patients />} />
      {/* Commented out routes for pages that don't exist yet */}
      {/* <Route path="/details/:id" element={<PatientDetails />} />
      <Route path="/create" element={<CreatePatient />} />
      <Route path="/edit/:id" element={<EditPatient />} />
      <Route path="/patient-service-types" element={<PatientServiceTypeList />} />
      <Route path="/patient-service-type/add" element={<PatientServiceTypeForm />} />
      <Route path="/patient-service-type/edit/:id" element={<PatientServiceTypeForm />} /> */}
      <Route path="/enquiries" element={<EnquiryList />} />
    </Routes>
  );
};

export default PatientRoutes;
