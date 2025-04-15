
import { Route, Routes } from "react-router-dom";
import PatientsList from "../pages/Patients";
import DiagnosisList from "../submodules/diagnosis/pages/DiagnosisList";
import EnquiryList from "../submodules/enquiry/pages/EnquiryList";
import RepairList from "../submodules/repair/pages/RepairList";
import ScheduleList from "../submodules/schedule/pages/ScheduleList";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientsList />} />
      <Route path="/diagnosis/*" element={<DiagnosisList />} />
      <Route path="/enquiries/*" element={<EnquiryList />} />
      <Route path="/repairs/*" element={<RepairList />} />
      <Route path="/schedules/*" element={<ScheduleList />} />
    </Routes>
  );
};

export default PatientRoutes;
