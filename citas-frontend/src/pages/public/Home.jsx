import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="contenedor">
      <section className="hero" aria-labelledby="titulo-hero">
        <h1 id="titulo-hero">Sistema de Gestión de Citas Médicas</h1>
        <p>
          Agenda, consulta y gestiona tus citas médicas en línea. Prototipo funcional
          construido en React (Evidencia 3); por ahora opera con datos de prueba
          coherentes con la base de datos del proyecto.
        </p>
        <div className="hero-acciones">
          <Link className="boton" to="/login">Iniciar sesión</Link>
          <Link className="boton boton--secundario" to="/registro">Crear cuenta de paciente</Link>
        </div>
      </section>

      <section aria-labelledby="titulo-modulos">
        <h2 id="titulo-modulos">Módulos del sistema</h2>
        <div className="tarjetas">
          <article className="tarjeta">
            <h2>Panel del paciente</h2>
            <p>Agenda citas, consulta tu historial y cancela o reprograma según la política del sistema.</p>
          </article>
          <article className="tarjeta">
            <h2>Panel del administrador</h2>
            <p>Gestión de médicos y estados, con acceso restringido por rol (RBAC del mapa de navegación).</p>
          </article>
          <article className="tarjeta">
            <h2>Usabilidad y accesibilidad</h2>
            <p>Contraste AA, navegación por teclado, etiquetas descriptivas y estados comunicados con texto y color.</p>
          </article>
        </div>
      </section>
    </div>
  );
}