
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./admin/AdminRoutes";
import { useTenant } from "./hooks/use-tenant";
import ResetPassword from "./pages/ResetPassword";
import PublicPatientRegistration from "./pages/PublicPatientRegistration";
import ClinicProfile from "./pages/ClinicProfile";

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

            {/* Login route */}
            <Route path="/" element={<Login />} />

            {/* Reset password route */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Public patient registration route */}
            <Route path="/register-patient" element={<PublicPatientRegistration />} />

            {/* Clinic profile route */}
            <Route path="/clinic-profile" element={<ClinicProfile />} />

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
