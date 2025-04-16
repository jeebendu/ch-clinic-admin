import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { jwtInterceptor } from "./lib/JwtInterceptor";
import { BranchProvider } from "./contexts/BranchContext";
import AdminRoutes from "./admin/AdminRoutes";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Initialize the JWT interceptor
jwtInterceptor();

// Initialize the Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BranchProvider>
        <Router>
          <div className="app min-h-screen">
            <Routes />
          </div>
          <Toaster position="top-right" />
        </Router>
      </BranchProvider>
    </QueryClientProvider>
  );
}

// Routes Component
const Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
