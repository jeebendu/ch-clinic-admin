
import { Route, Routes } from "react-router-dom";
import PatientList from "../pages/PatientList";
import PatientForm from "../components/PatientForm";
import PatientView from "../components/PatientView";
import PrescriptionView from "../components/PrescriptionView";
import CreatePrescription from "../components/CreatePrescription";
import AudiometryForm from "../components/reports/AudiometryForm";
import BeraForm from "../components/reports/BeraForm";
import ABRForm from "../components/reports/ABRForm";
import SpeechForm from "../components/reports/SpeechForm";
import { Patient } from "../types/Patient";

const PatientRoutes = () => {
  // Mocked patient for demo purposes
  const demoPatient: Patient = {
    id: 1,
    firstname: "Demo",
    lastname: "Patient",
    user: {
      id: 1,
      email: "demo@example.com",
      phone: "1234567890",
      image: "",
    },
    birthday: new Date(),
    gender: "MALE"
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
      <Route path="/reports/audiometry/:id" element={<AudiometryForm patient={demoPatient} />} />
      <Route path="/reports/bera/:id" element={<BeraForm patient={demoPatient} />} />
      <Route path="/reports/abr/:id" element={<ABRForm patient={demoPatient} />} />
      <Route path="/reports/speech/:id" element={<SpeechForm patient={demoPatient} />} />
    </Routes>
  );
};

export default PatientRoutes;
