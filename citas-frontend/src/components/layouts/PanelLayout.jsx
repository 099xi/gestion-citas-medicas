import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

// Menús según rol (RBAC del mapa de navegación)
const menusPorRol = {
  paciente: [
    { to: '/paciente', label: 'Inicio del panel', fin: true },
    { to: '/paciente/agendar', label: 'Agendar cita' },
    { to: '/paciente/mis-citas', label: 'Mis citas' },
  ],
  medico: [
    { to: '/medico', label: 'Agenda del médico', fin: true },
  ],
  administrador: [
    { to: '/admin/medicos', label: 'Gestión de médicos' },
    { to: '/admin/citas', label: 'Gestión de citas' },
  ],
};

export default function PanelLayout() {
  const { sesion, logout } = useAuth();
  const navegar = useNavigate();
  const menu = menusPorRol[sesion.rol] ?? [];

  const salir = () => {
    logout();
    navegar('/login');
  };

  return (
    <>
      <a className="saltar-contenido" href="#contenido-panel">
        Saltar al contenido principal
      </a>
      <div className="panel">
        <aside className="panel-lateral">
          <p className="panel-rol">Rol: {sesion.rol}</p>
          <nav aria-label={`Navegación del panel de ${sesion.rol}`}>
            <ul>
              {menu.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.fin}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <button type="button" className="enlace-lateral" onClick={salir}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="panel-contenido" id="contenido-panel">
          <header className="panel-encabezado">
            <p className="panel-saludo">Bienvenido(a), {sesion.nombre}</p>
          </header>
          <Outlet />
        </div>
      </div>
    </>
  );
}