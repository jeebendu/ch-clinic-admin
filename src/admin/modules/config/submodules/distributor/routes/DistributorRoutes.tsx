import { Route, Routes } from "react-router-dom";
import DistributorList from "../pages/DistributorList";

const DistributorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DistributorList />} />
      <Route path="/list" element={<DistributorList />} />
    </Routes>
  );
};

export default DistributorRoutes;
