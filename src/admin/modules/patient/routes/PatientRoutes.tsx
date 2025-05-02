
import { Route, Routes } from "react-router-dom";
import { Patient } from "../types/Patient";
import PatientList from "../components/PatientList";
import PatientForm from "../pages/PatientForm";
import PatientView from "../components/PatientView";
import PrescriptionView from "../pages/PrescriptionView";
import CreatePrescription from "../pages/CreatePrescription";
import AudiometryForm from "../components/reports/AudiometryForm";
import BeraForm from "../components/reports/BeraForm";
import ABRForm from "../components/reports/ABRForm";
import SpeechForm from "../components/reports/SpeechForm";

// Mock handlers for report forms
const mockReportHandlers = {
  onCancel: () => {},
  onSave: () => {},
  open: true,
  onOpenChange: () => {}
};

const PatientRoutes = () => {
  // Mocked patient for demo purposes
  const demoPatient: Patient = {
    id: 1,
    uid: "user-1",
    firstname: "Demo",
    lastname: "Patient",
    user: {
      id: 1,
      email: "demo@example.com",
      phone: "1234567890",
      image: "",
      uid: "user-1",
      name: "Demo User",
      username: "demouser",
      role: {
        id: 3,
        name: "Patient",
        permissions: []
      },
      branch: {
        id: 1,
        name: "Main Branch",
        code: "MB-001",
        location: "Main Street",
        active: true,
        city: "Demo City",
        pincode: 12345,
        image: "",
        latitude: 0,
        longitude: 0,
        state: null,
        district: null,
        country: null
      },
      password: "",
      effectiveFrom: new Date(),
      effectiveTo: new Date()
    },
    dob: new Date(),
    age: 30,
    address: "123 Demo Street",
    gender: "MALE",
    refDoctor: null,
    state: null,
    district: null
  };

  return (
    <Routes>
      <Route path="" element={<PatientList />} />
      <Route path="add" element={<PatientForm />} />
      <Route path="add/:familyId" element={<PatientForm />} />
      <Route path="update/:id" element={<PatientForm />} />
      <Route path=":id" element={<PatientView />} />
      <Route path="/prescriptions/:id" element={<PrescriptionView />} />
      <Route path="/prescription/:id" element={<CreatePrescription />} />
      <Route path="/reports/audiometry/:id" element={<AudiometryForm patient={demoPatient} {...mockReportHandlers} />} />
      <Route path="/reports/bera/:id" element={<BeraForm patient={demoPatient} {...mockReportHandlers} />} />
      <Route path="/reports/abr/:id" element={<ABRForm patient={demoPatient} {...mockReportHandlers} />} />
      <Route path="/reports/speech/:id" element={<SpeechForm patient={demoPatient} {...mockReportHandlers} />} />
    </Routes>
  );
};

export default PatientRoutes;
