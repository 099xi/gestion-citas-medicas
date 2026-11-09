import { Link, NavLink, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <>
      <a className="saltar-contenido" href="#contenido-publico">
        Saltar al contenido principal
      </a>
      <header className="encabezado-publico">
        <Link to="/" aria-label="Inicio del Sistema de Gestión de Citas Médicas">
          🩺 Citas Médicas
        </Link>
        <nav aria-label="Navegación principal pública">
          <NavLink to="/login">Iniciar sesión</NavLink>
          <NavLink to="/registro">Crear cuenta</NavLink>
        </nav>
      </header>
      <main id="contenido-publico">
        <Outlet />
      </main>
      <footer className="pie-publico">
        <p>SENA · ADSO · Ficha 3336056 — Sistema de Gestión de Citas Médicas · Prototipo Evidencia 3</p>
      </footer>
    </>
  );
}