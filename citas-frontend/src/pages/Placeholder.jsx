import { Link } from 'react-router-dom';

const rutas = [
  ['/', 'Inicio'],
  ['/login', 'Iniciar sesión'],
  ['/registro', 'Registro de usuario'],
  ['/recuperar', 'Recuperar contraseña'],
  ['/paciente', 'Panel del paciente'],
  ['/paciente/agendar', 'Agendar cita'],
  ['/paciente/mis-citas', 'Mis citas'],
  ['/admin/medicos', 'Gestión de médicos'],
];

export default function Placeholder({ titulo }) {
  return (
    <main className="contenedor">
      <h1>{titulo}</h1>
      <p>Vista en construcción: el router ya funciona; el contenido llega en las siguientes partes.</p>
      <nav aria-label="Navegación temporal de prueba">
        <ul>
          {rutas.map(([ruta, nombre]) => (
            <li key={ruta}>
              <Link to={ruta}>{nombre}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}