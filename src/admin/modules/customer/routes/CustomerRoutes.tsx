
import { Route, Routes } from "react-router-dom";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Customer Dashboard</div>} />
    </Routes>
  );
};

export default CustomerRoutes;
