
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProcessAppointment from "./admin/modules/appointments/pages/ProcessAppointment";
import PatientsAdmin from "./admin/modules/patient/pages/Patients";
import Dashboard from "./admin/modules/dashboard/Dashboard";
import AdminRoutes from "./admin/AdminRoutes";
import { useTenant } from "./hooks/use-tenant";

const queryClient = new QueryClient();

// Component to initialize tenant info
const TenantInitializer = ({ children }: { children: React.ReactNode }) => {
  useTenant(); // This will fetch tenant info on app startup
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantInitializer>
          <Routes>
            {/* Redirect from root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TenantInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
