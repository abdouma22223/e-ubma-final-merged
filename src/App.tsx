import { Navigate, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import StudentSpace from "./pages/StudentSpace";
import AdminDashboard from "./pages/AdminDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<StudentSpace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/professor" element={<ProfessorDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
