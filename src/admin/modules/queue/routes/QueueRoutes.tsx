
import { Routes, Route } from "react-router-dom";
import QueuePage from "../pages/QueuePage";

const QueueRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<QueuePage />} />
      <Route path="/list" element={<QueuePage />} />
    </Routes>
  );
};

export default QueueRoutes;
