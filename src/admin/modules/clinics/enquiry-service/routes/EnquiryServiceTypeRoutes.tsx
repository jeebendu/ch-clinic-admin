import exp from "constants";
import { Route, Routes } from "react-router-dom";
import SpecialityList from "../pages/EnquiryServiceTypeList";
import EnquiryServiceTypeList from "../pages/EnquiryServiceTypeList";



const EnquiryServiceTypeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnquiryServiceTypeList />} />
    </Routes>
  );
};
export default EnquiryServiceTypeRoutes;