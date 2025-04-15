
import { Route, Routes } from "react-router-dom";
import SliderList from "../submodules/slider/pages/SliderList";

const CoreRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SliderList />} />
      <Route path="/sliders/*" element={<SliderList />} />
    </Routes>
  );
};

export default CoreRoutes;
