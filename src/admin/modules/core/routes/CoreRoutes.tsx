
import { Route, Routes } from "react-router-dom";

const CoreRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Core Dashboard</div>} />
    </Routes>
  );
};

export default CoreRoutes;
