import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RutaProtegida({ roles, children }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles && !roles.includes(sesion.rol)) {
    return <Navigate to={sesion.rol === 'administrador' ? '/admin/medicos' : '/paciente'} replace />;
  }
  return children;
}