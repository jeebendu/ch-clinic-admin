
import { Route, Routes } from "react-router-dom";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>User Dashboard</div>} />
    </Routes>
  );
};

export default UserRoutes;
