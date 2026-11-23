import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout.jsx';
import PanelLayout from './components/layouts/PanelLayout.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Registro from './pages/public/Registro.jsx';
import Recuperar from './pages/public/Recuperar.jsx';
import DashboardPaciente from './pages/paciente/DashboardPaciente.jsx';
import AgendarCita from './pages/paciente/AgendarCita.jsx';
import MisCitas from './pages/paciente/MisCitas.jsx';
import AgendaMedico from './pages/medico/AgendaMedico.jsx';
import GestionMedicos from './pages/admin/GestionMedicos.jsx';
import GestionCitas from './pages/admin/GestionCitas.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />
      </Route>

      <Route
        path="/paciente"
        element={
          <RutaProtegida roles={['paciente']}>
            <PanelLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<DashboardPaciente />} />
        <Route path="agendar" element={<AgendarCita />} />
        <Route path="mis-citas" element={<MisCitas />} />
      </Route>

      <Route
        path="/medico"
        element={
          <RutaProtegida roles={['medico']}>
            <PanelLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<AgendaMedico />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RutaProtegida roles={['administrador']}>
            <PanelLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<Navigate to="medicos" replace />} />
        <Route path="medicos" element={<GestionMedicos />} />
        <Route path="citas" element={<GestionCitas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}