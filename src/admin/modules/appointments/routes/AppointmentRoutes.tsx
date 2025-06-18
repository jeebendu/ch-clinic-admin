
import { Route, Routes } from "react-router-dom";
import AppointmentsAdmin from "../pages/Appointments";
import ProcessAppointment from "../pages/ProcessAppointment";

const AppointmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppointmentsAdmin />} />
      <Route path="/id/:appointmentId" element={<ProcessAppointment />} />
    </Routes>
  );
};

export default AppointmentRoutes;
