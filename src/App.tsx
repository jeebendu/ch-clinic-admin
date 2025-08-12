import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Admin pages
import AdminDashboard from './admin/pages/AdminDashboard';
import AppointmentList from './admin/modules/appointments/pages/AppointmentList';
import PatientList from './admin/modules/patient/pages/PatientList';
import DoctorList from './admin/modules/doctor/pages/DoctorList';
import QueuePage from './admin/modules/queue/pages/QueuePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/appointments" element={<AppointmentList />} />
            <Route path="/admin/patients" element={<PatientList />} />
            <Route path="/admin/doctors" element={<DoctorList />} />
            <Route path="/admin/queue" element={<QueuePage />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
