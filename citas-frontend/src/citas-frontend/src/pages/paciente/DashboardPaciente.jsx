import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useDatos } from '../../hooks/useDatos.js';
import Card from '../../components/ui/Card.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import { hoyISO, formatoFecha } from '../../utils/fechas.js';

export default function DashboardPaciente() {
  const { sesion } = useAuth();
  const { pacientePorCorreo, citasDePaciente, medicos, nombreConsultorio, nombreEspecialidad, ESTADOS_ACTIVOS } = useDatos();
  const paciente = pacientePorCorreo(sesion.correo);
  const hoy = hoyISO();

  const mias = paciente ? citasDePaciente(paciente.id_paciente) : [];
  const proximas = mias.filter((c) => c.fecha >= hoy && ESTADOS_ACTIVOS.includes(c.estado));
  const atendidas = mias.filter((c) => c.estado === 'Atendida');
  const recordatorios = mias.filter((c) => c.estado === 'Confirmada' && c.fecha >= hoy);
  const proxima = proximas[0];
  const medicoProxima = proxima ? medicos.find((m) => m.id_medico === proxima.id_medico) : null;

  return (
    <>
      <h1>Panel del paciente</h1>
      <div className="tarjetas">
        <Card titulo="Citas próximas" numero={proximas.length} detalle="Programadas y confirmadas desde hoy." />
        <Card titulo="Citas atendidas" numero={atendidas.length} detalle="Historial completo en Mis citas." />
        <Card titulo="Notificaciones" numero={recordatorios.length} detalle="Recordatorios de citas confirmadas." />
      </div>

      <section className="tarjeta" style={{ marginTop: '1.5rem' }} aria-labelledby="titulo-proxima">
        <h2 id="titulo-proxima">Próxima cita</h2>
        {proxima && medicoProxima ? (
          <>
            <p>
              <strong>{medicoProxima.nombre} {medicoProxima.apellido}</strong>
              {' · '}{nombreEspecialidad(medicoProxima.id_especialidad)}
            </p>
            <p>
              {formatoFecha(proxima.fecha)} · {proxima.hora_inicio.slice(0, 5)}
              {' · '}{nombreConsultorio(proxima.id_consultorio)}
            </p>
            <p><BadgeEstado estado={proxima.estado} /></p>
          </>
        ) : (
          <p>No tienes citas próximas. ¡Agenda una hoy mismo!</p>
        )}
        <Link className="boton" to="/paciente/agendar">Agendar nueva cita</Link>
      </section>
    </>
  );
}
