import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Registro";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Horarios from "./pages/Horarios";
import Citas from "./pages/Citas";
import Estadisticas from "./pages/Estadisticas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cambiar-password" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/horarios" element={<Horarios />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
    </Router>
  );
}

export default App;