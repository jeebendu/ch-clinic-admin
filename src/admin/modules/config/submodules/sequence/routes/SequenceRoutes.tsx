
import { Route, Routes } from "react-router-dom";
import SequenceList from "../pages/SequenceList";

const SequenceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SequenceList />} />
      <Route path="/list" element={<SequenceList />} />
    </Routes>
  );
};

export default SequenceRoutes;
