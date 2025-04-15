
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import NotFound from "./pages/NotFound";
import Dashboard from "./admin/pages/Dashboard";
import AppointmentsAdmin from "./admin/modules/appointments/pages/Appointments";
import PatientsAdmin from "./admin/modules/patients/pages/Patients";
import Schedule from "./admin/pages/Schedule";
import DoctorAvailability from "./admin/pages/DoctorAvailability";
import ProcessAppointment from "./admin/modules/appointments/pages/ProcessAppointment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect from root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/appointments" element={<AppointmentsAdmin />} />
          <Route path="/admin/appointments/process/:appointmentId" element={<ProcessAppointment />} />
          <Route path="/admin/patients" element={<PatientsAdmin />} />
          <Route path="/admin/schedule" element={<Schedule />} />
          <Route path="/admin/doctor-availability" element={<DoctorAvailability />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
