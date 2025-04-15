
import { Route, Routes } from "react-router-dom";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Doctor Dashboard</div>} />
    </Routes>
  );
};

export default DoctorRoutes;
