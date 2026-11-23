import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useDatos } from '../../hooks/useDatos.js';
import Card from '../../components/ui/Card.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Aviso from '../../components/ui/Aviso.jsx';
import { hoyISO, formatoFecha } from '../../utils/fechas.js';

// Filtros de la agenda ('' = todas las citas)
const FILTROS = [
  { valor: 'hoy', texto: 'Solo las de hoy' },
  { valor: 'proximas', texto: 'Hoy y próximas' },
];

export default function AgendaMedico() {
  const { sesion } = useAuth();
  const { medicoPorCorreo, citasDeMedico, nombrePaciente, nombreConsultorio, cambiarEstadoCita, ESTADOS_ACTIVOS } = useDatos();
  const [filtro, setFiltro] = useState('proximas');
  const [aviso, setAviso] = useState('');

  const medico = medicoPorCorreo(sesion.correo);
  const hoy = hoyISO();
  const mias = medico ? citasDeMedico(medico.id_medico) : [];

  const visibles = mias.filter((c) => {
    if (filtro === 'hoy') return c.fecha === hoy;
    if (filtro === 'proximas') return c.fecha >= hoy;
    return true;
  });

  const deHoy = mias.filter((c) => c.fecha === hoy && ESTADOS_ACTIVOS.includes(c.estado));
  const pendientes = mias.filter((c) => c.fecha >= hoy && ESTADOS_ACTIVOS.includes(c.estado));
  const atendidas = mias.filter((c) => c.estado === 'Atendida');

  const cambiar = (cita, nuevoEstado, mensaje) => {
    cambiarEstadoCita(cita.id_cita, nuevoEstado); // Mock: PATCH al backend
    setAviso(`La cita de ${nombrePaciente(cita.id_paciente)} ${mensaje}.`);
  };

  const columnas = [
    { campo: 'fecha', titulo: 'Fecha', render: (c) => formatoFecha(c.fecha) },
    { campo: 'hora', titulo: 'Hora', render: (c) => c.hora_inicio.slice(0, 5) },
    { campo: 'paciente', titulo: 'Paciente', render: (c) => nombrePaciente(c.id_paciente) },
    { campo: 'consultorio', titulo: 'Consultorio', render: (c) => nombreConsultorio(c.id_consultorio) },
    { campo: 'motivo', titulo: 'Motivo' },
    { campo: 'estado', titulo: 'Estado', render: (c) => <BadgeEstado estado={c.estado} /> },
    {
      campo: 'accion', titulo: 'Acción',
      render: (c) => {
        if (c.estado === 'Programada') {
          return (
            <Button variante="secundario" onClick={() => cambiar(c, 'Confirmada', 'fue confirmada')}>
              Confirmar
            </Button>
          );
        }
        if (c.estado === 'Confirmada') {
          // Solo se puede atender una cita que ya llegó su día
          const futura = c.fecha > hoy;
          return (
            <Button
              disabled={futura}
              title={futura ? 'Solo se puede atender desde el día de la cita' : undefined}
              aria-label={`Marcar atendida la cita de ${nombrePaciente(c.id_paciente)}`}
              onClick={() => cambiar(c, 'Atendida', 'fue marcada como atendida')}
            >
              Marcar atendida
            </Button>
          );
        }
        return <span className="ayuda-campo">Sin acciones</span>;
      },
    },
  ];

  if (!medico) {
    return <Aviso tipo="error">No se encontró el perfil de médico asociado a tu cuenta.</Aviso>;
  }

  return (
    <>
      <h1>Agenda del médico</h1>
      <p className="ayuda-campo">
        Dr(a). {medico.nombre} {medico.apellido} · estas son solo tus citas.
      </p>
      <div className="tarjetas">
        <Card titulo="Citas de hoy" numero={deHoy.length} detalle="Programadas y confirmadas para hoy." />
        <Card titulo="Pendientes" numero={pendientes.length} detalle="Desde hoy en adelante." />
        <Card titulo="Atendidas" numero={atendidas.length} detalle="Historial de consultas realizadas." />
      </div>

      {aviso && <div style={{ marginTop: '1rem' }}><Aviso>{aviso}</Aviso></div>}

      <div className="filtros" style={{ marginTop: '1.5rem' }}>
        <FormField
          label="Mostrar" nombre="filtro" valor={filtro}
          onChange={(e) => { setFiltro(e.target.value); setAviso(''); }}
          opciones={FILTROS} placeholder="Todas las citas"
        />
      </div>

      <DataTable
        caption="Citas asignadas al médico autenticado"
        columnas={columnas}
        filas={visibles}
        clave={(c) => c.id_cita}
        vacio="No tienes citas para este filtro."
      />
    </>
  );
}
