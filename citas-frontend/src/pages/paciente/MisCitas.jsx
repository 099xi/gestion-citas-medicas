import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import Button from '../../components/ui/Button.jsx';
import { citas, pacientes, medicos, nombreMedico, nombreEspecialidad, nombreConsultorio } from '../../data/mockData.js';
import { formatoFecha } from '../../utils/fechas.js';

export default function MisCitas() {
  const { sesion } = useAuth();
  const idPaciente = pacientes.find((p) => p.correo === sesion.correo)?.id_paciente ?? 1;
  const [cancelando, setCancelando] = useState(null);
  const [abierta, setAbierta] = useState(null);
  const [aviso, setAviso] = useState('');

  const mias = citas
    .filter((c) => c.id_paciente === idPaciente)
    .sort((a, b) => (a.fecha + a.hora_inicio).localeCompare(b.fecha + b.hora_inicio));

  const cancelar = (id) => {
    const cita = citas.find((c) => c.id_cita === id);
    if (cita) cita.estado = 'Cancelada'; // Mock: sería un PATCH al backend
    setCancelando(null);
    setAviso(`La cita del ${formatoFecha(cita.fecha)} fue cancelada correctamente.`);
  };

  const columnas = [
    { campo: 'fecha', titulo: 'Fecha', render: (c) => formatoFecha(c.fecha) },
    { campo: 'medico', titulo: 'Médico', render: (c) => nombreMedico(c.id_medico) },
    {
      campo: 'especialidad', titulo: 'Especialidad',
      render: (c) => {
        const m = medicos.find((x) => x.id_medico === c.id_medico);
        return m ? nombreEspecialidad(m.id_especialidad) : '—';
      },
    },
    { campo: 'estado', titulo: 'Estado', render: (c) => <BadgeEstado estado={c.estado} /> },
    {
      campo: 'accion', titulo: 'Acción',
      render: (c) => {
        if (c.estado === 'Programada' || c.estado === 'Confirmada') {
          return cancelando === c.id_cita ? (
            <span className="hero-acciones">
              <Button variante="peligro" onClick={() => cancelar(c.id_cita)}>Sí, cancelar</Button>
              <Button variante="secundario" onClick={() => setCancelando(null)}>No</Button>
            </span>
          ) : (
            <Button
              variante="secundario"
              aria-label={`Cancelar cita del ${formatoFecha(c.fecha)}`}
              onClick={() => { setCancelando(c.id_cita); setAviso(''); }}
            >
              Cancelar
            </Button>
          );
        }
        return (
          <Button
            variante="secundario"
            aria-label={`Ver detalle de la cita del ${formatoFecha(c.fecha)}`}
            onClick={() => setAbierta(abierta === c.id_cita ? null : c.id_cita)}
          >
            {abierta === c.id_cita ? 'Ocultar' : 'Ver'}
          </Button>
        );
      },
    },
  ];

  const detalle = abierta ? citas.find((c) => c.id_cita === abierta) : null;

  return (
    <>
      <h1>Mis citas</h1>
      {aviso && <div className="aviso aviso--exito" role="status">{aviso}</div>}
      <DataTable
        caption="Historial y citas próximas del paciente autenticado"
        columnas={columnas}
        filas={mias}
        clave={(c) => c.id_cita}
      />
      {detalle && (
        <section className="tarjeta" style={{ marginTop: '1rem' }} aria-label="Detalle de la cita">
          <h2>Detalle de la cita del {formatoFecha(detalle.fecha)}</h2>
          <p>Horario: {detalle.hora_inicio.slice(0, 5)} a {detalle.hora_fin.slice(0, 5)} · {nombreConsultorio(detalle.id_consultorio)}</p>
          <p>Motivo: {detalle.motivo}</p>
          <p>Estado actual: <BadgeEstado estado={detalle.estado} /></p>
        </section>
      )}
      <p className="ayuda-campo" style={{ marginTop: '1rem' }}>
        Política de cancelación (RF-10): solo se pueden cancelar citas Programadas o Confirmadas.
      </p>
    </>
  );
}