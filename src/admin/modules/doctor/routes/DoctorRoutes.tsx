
import { Route, Routes } from "react-router-dom";
import DoctorList from "../submodules/doctor/pages/DoctorList";
import SpecializationList from "../submodules/specialization/pages/SpecializationList";
import ServiceList from "../submodules/services/pages/ServiceList";
import PercentageList from "../submodules/percentage/pages/PercentageList";
import AvailabilityList from "../submodules/availability/pages/AvailabilityList";
import ReportList from "../submodules/reports/pages/ReportList";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorList />} />
      <Route path="/doctors/*" element={<DoctorList />} />
      <Route path="/specializations/*" element={<SpecializationList />} />
      <Route path="/services/*" element={<ServiceList />} />
      <Route path="/percentages/*" element={<PercentageList />} />
      <Route path="/availability/*" element={<AvailabilityList />} />
      <Route path="/reports/*" element={<ReportList />} />
    </Routes>
  );
};

export default DoctorRoutes;
