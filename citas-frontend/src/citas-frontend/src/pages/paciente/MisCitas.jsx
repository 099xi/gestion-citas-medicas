import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useDatos } from '../../hooks/useDatos.js';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import Button from '../../components/ui/Button.jsx';
import Aviso from '../../components/ui/Aviso.jsx';
import AccionConfirmable from '../../components/ui/AccionConfirmable.jsx';
import { formatoFecha } from '../../utils/fechas.js';

export default function MisCitas() {
  const { sesion } = useAuth();
  const {
    pacientePorCorreo, citasDePaciente, cambiarEstadoCita,
    nombreMedico, especialidadDeMedico, nombreConsultorio, ESTADOS_ACTIVOS,
  } = useDatos();
  const [abierta, setAbierta] = useState(null);
  const [aviso, setAviso] = useState('');

  const paciente = pacientePorCorreo(sesion.correo);
  const mias = paciente ? citasDePaciente(paciente.id_paciente) : [];

  const cancelar = (cita) => {
    cambiarEstadoCita(cita.id_cita, 'Cancelada'); // Mock: sería un PATCH al backend
    setAviso(`La cita del ${formatoFecha(cita.fecha)} fue cancelada correctamente.`);
  };

  const columnas = [
    { campo: 'fecha', titulo: 'Fecha', render: (c) => formatoFecha(c.fecha) },
    { campo: 'medico', titulo: 'Médico', render: (c) => nombreMedico(c.id_medico) },
    { campo: 'especialidad', titulo: 'Especialidad', render: (c) => especialidadDeMedico(c.id_medico) },
    { campo: 'estado', titulo: 'Estado', render: (c) => <BadgeEstado estado={c.estado} /> },
    {
      campo: 'accion', titulo: 'Acción',
      render: (c) =>
        ESTADOS_ACTIVOS.includes(c.estado) ? (
          <AccionConfirmable
            etiqueta="Cancelar"
            etiquetaConfirmar="Sí, cancelar"
            ariaLabel={`Cancelar cita del ${formatoFecha(c.fecha)}`}
            alConfirmar={() => cancelar(c)}
          />
        ) : (
          <Button
            variante="secundario"
            aria-label={`Ver detalle de la cita del ${formatoFecha(c.fecha)}`}
            onClick={() => setAbierta(abierta === c.id_cita ? null : c.id_cita)}
          >
            {abierta === c.id_cita ? 'Ocultar' : 'Ver'}
          </Button>
        ),
    },
  ];

  const detalle = abierta ? mias.find((c) => c.id_cita === abierta) : null;

  return (
    <>
      <h1>Mis citas</h1>
      {aviso && <Aviso>{aviso}</Aviso>}
      <DataTable
        caption="Historial y citas próximas del paciente autenticado"
        columnas={columnas}
        filas={mias}
        clave={(c) => c.id_cita}
        vacio="Aún no tienes citas registradas."
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
