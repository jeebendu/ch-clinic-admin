
import { Route, Routes } from "react-router-dom";
import BranchList from "../pages/BranchList";

const BranchRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchList />} />
      <Route path="/list" element={<BranchList />} />
    </Routes>
  );
};

export default BranchRoutes;
