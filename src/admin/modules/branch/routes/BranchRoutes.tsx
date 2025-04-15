
import { Route, Routes } from "react-router-dom";

const BranchRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Branch Dashboard</div>} />
    </Routes>
  );
};

export default BranchRoutes;
