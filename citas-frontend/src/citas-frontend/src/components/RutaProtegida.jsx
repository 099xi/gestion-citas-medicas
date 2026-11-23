import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { rutaInicialPorRol } from '../utils/roles.js';

export default function RutaProtegida({ roles, children }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles && !roles.includes(sesion.rol)) {
    return <Navigate to={rutaInicialPorRol[sesion.rol] ?? '/'} replace />;
  }
  return children;
}