import { useState } from 'react';
import { useDatos } from '../../hooks/useDatos.js';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Aviso from '../../components/ui/Aviso.jsx';
import AccionConfirmable from '../../components/ui/AccionConfirmable.jsx';
import { formatoFecha } from '../../utils/fechas.js';

const ESTADOS = ['Programada', 'Confirmada', 'Atendida', 'Cancelada'].map((e) => ({ valor: e, texto: e }));

export default function GestionCitas() {
  const {
    todasLasCitas, medicos, nombreMedico, nombrePaciente, especialidadDeMedico,
    cambiarEstadoCita, ESTADOS_ACTIVOS,
  } = useDatos();
  const [estado, setEstado] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [aviso, setAviso] = useState('');

  const visibles = todasLasCitas().filter(
    (c) => (!estado || c.estado === estado) && (!medicoId || String(c.id_medico) === medicoId)
  );

  const cancelar = (cita) => {
    cambiarEstadoCita(cita.id_cita, 'Cancelada'); // Mock: PATCH al backend
    setAviso(`La cita de ${nombrePaciente(cita.id_paciente)} del ${formatoFecha(cita.fecha)} fue cancelada.`);
  };

  const columnas = [
    { campo: 'fecha', titulo: 'Fecha', render: (c) => `${formatoFecha(c.fecha)} · ${c.hora_inicio.slice(0, 5)}` },
    { campo: 'paciente', titulo: 'Paciente', render: (c) => nombrePaciente(c.id_paciente) },
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
            ariaLabel={`Cancelar la cita de ${nombrePaciente(c.id_paciente)} del ${formatoFecha(c.fecha)}`}
            alConfirmar={() => cancelar(c)}
          />
        ) : (
          <span className="ayuda-campo">Sin acciones</span>
        ),
    },
  ];

  return (
    <>
      <h1>Gestión de citas</h1>
      <p className="ayuda-campo">Vista del administrador: todas las citas del sistema, en tiempo real.</p>
      {aviso && <Aviso>{aviso}</Aviso>}

      <div className="filtros">
        <FormField
          label="Estado" nombre="estado" valor={estado}
          onChange={(e) => { setEstado(e.target.value); setAviso(''); }}
          opciones={ESTADOS} placeholder="Todos los estados"
        />
        <FormField
          label="Médico" nombre="medico" valor={medicoId}
          onChange={(e) => { setMedicoId(e.target.value); setAviso(''); }}
          opciones={medicos.map((m) => ({ valor: String(m.id_medico), texto: `${m.nombre} ${m.apellido}` }))}
          placeholder="Todos los médicos"
        />
      </div>

      <DataTable
        caption={`Citas del sistema (${visibles.length})`}
        columnas={columnas}
        filas={visibles}
        clave={(c) => c.id_cita}
        vacio="No hay citas con los filtros elegidos."
      />
    </>
  );
}
