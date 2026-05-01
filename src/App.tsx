import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import StudentSpace from "./pages/StudentSpace";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/*" element={<StudentSpace />} />
        <Route path="/professor/*" element={<ProfessorDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
