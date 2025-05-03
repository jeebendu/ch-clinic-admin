
import React from "react";
import { Routes, Route } from "react-router-dom";
import AudiometryTest from "../pages/AudiometryTest";

const AudiometryRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AudiometryTest />} />
      <Route path="/test" element={<AudiometryTest />} />
    </Routes>
  );
};

export default AudiometryRoutes;
