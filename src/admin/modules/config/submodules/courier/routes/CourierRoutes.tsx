import { Route, Routes } from "react-router-dom";
import CourierList from "../pages/CourierList";

const CourierRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CourierList />} />
      <Route path="/list" element={<CourierList />} />
    </Routes>
  );
};

export default CourierRoutes;
