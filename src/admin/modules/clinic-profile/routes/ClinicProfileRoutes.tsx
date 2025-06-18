
import { Routes, Route } from "react-router-dom";
import ClinicProfile from "../pages/ClinicProfile";

const ClinicProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClinicProfile />} />
    </Routes>
  );
};

export default ClinicProfileRoutes;
