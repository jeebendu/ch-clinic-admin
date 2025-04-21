import exp from "constants";
import { Route, Routes } from "react-router-dom";
import SpecialityList from "../pages/SpecialityList";



const SpecialityRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SpecialityList />} />
      <Route path="/list" element={<SpecialityList />} />
    </Routes>
  );
};
export default SpecialityRoutes;