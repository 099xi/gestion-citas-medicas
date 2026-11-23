import { useMemo, useReducer } from 'react';
import { DatosContext } from './contextos.js';
import { datosReducer, estadoInicial } from './datosReducer.js';
import { especialidades, consultorios, horariosDisponibles } from '../data/mockData.js';
import { sumarMinutos } from '../utils/fechas.js';

const ESTADOS_ACTIVOS = ['Programada', 'Confirmada'];

// Proveedor del estado compartido: todas las vistas leen y escriben los datos
// a través de este contexto (en producción, estas funciones llamarían a la API).
export function DatosProvider({ children }) {
  const [estado, despachar] = useReducer(datosReducer, undefined, estadoInicial);

  const valor = useMemo(() => {
    const { citas, medicos, pacientes, usuarios } = estado;

    // ----- Consultas (selectores) -----
    const nombreMedico = (id) => {
      const m = medicos.find((x) => x.id_medico === id);
      return m ? `${m.nombre} ${m.apellido}` : '—';
    };
    const nombrePaciente = (id) => {
      const p = pacientes.find((x) => x.id_paciente === id);
      return p ? `${p.nombre} ${p.apellido}` : '—';
    };
    const nombreEspecialidad = (id) => especialidades.find((x) => x.id_especialidad === id)?.nombre ?? '—';
    const nombreConsultorio = (id) => consultorios.find((x) => x.id_consultorio === id)?.nombre ?? '—';
    const especialidadDeMedico = (idMedico) =>
      nombreEspecialidad(medicos.find((m) => m.id_medico === idMedico)?.id_especialidad);

    const porFechaHora = (a, b) => (a.fecha + a.hora_inicio).localeCompare(b.fecha + b.hora_inicio);
    const citasDePaciente = (id) => citas.filter((c) => c.id_paciente === id).sort(porFechaHora);
    const citasDeMedico = (id) => citas.filter((c) => c.id_medico === id).sort(porFechaHora);
    const todasLasCitas = () => [...citas].sort(porFechaHora);

    const pacientePorCorreo = (correo) => pacientes.find((p) => p.correo === correo);
    const medicoPorCorreo = (correo) => medicos.find((m) => m.correo === correo);
    const medicosActivosDe = (idEspecialidad) =>
      medicos.filter((m) => m.estado === 'Activo' && m.id_especialidad === idEspecialidad);

    // RF-07: bloques ya ocupados por el médico en esa fecha (las canceladas no cuentan)
    const horariosOcupados = (idMedico, fecha) =>
      citas
        .filter((c) => c.id_medico === idMedico && c.fecha === fecha && c.estado !== 'Cancelada')
        .map((c) => c.hora_inicio.slice(0, 5));

    // RF-03: unicidad de documento y correo
    const documentoRegistrado = (doc) => pacientes.some((p) => p.documento === doc);
    const correoRegistrado = (correo) =>
      pacientes.some((p) => p.correo === correo) || usuarios.some((u) => u.correo === correo);
    const documentoMedicoRegistrado = (doc) => medicos.some((m) => m.documento === doc);
    const correoMedicoRegistrado = (correo) => medicos.some((m) => m.correo === correo);

    // ----- Acciones (escrituras) -----
    // RF-08: se vuelve a verificar el doble agendamiento al momento de guardar
    const agendarCita = ({ idPaciente, idMedico, fecha, hora, motivo }) => {
      if (horariosOcupados(idMedico, fecha).includes(hora)) {
        return { ok: false, error: 'Ese bloque ya fue ocupado por otro paciente (RF-08).' };
      }
      despachar({
        tipo: 'cita/agendada',
        cita: {
          id_paciente: idPaciente,
          id_medico: idMedico,
          id_consultorio: (idMedico % consultorios.length) + 1,
          fecha,
          hora_inicio: `${hora}:00`,
          hora_fin: sumarMinutos(hora, 30),
          motivo: motivo.trim() || 'Consulta general',
        },
      });
      return { ok: true };
    };
    const cambiarEstadoCita = (id, nuevoEstado) => despachar({ tipo: 'cita/estado', id, estado: nuevoEstado });
    const crearMedico = (medico) => despachar({ tipo: 'medico/creado', medico });
    const alternarEstadoMedico = (id) => despachar({ tipo: 'medico/alternado', id });
    const registrarPaciente = ({ nombres, apellidos, documento, correo, telefono, password }) =>
      despachar({
        tipo: 'paciente/registrado',
        paciente: { nombre: nombres, apellido: apellidos, documento, telefono, correo, direccion: '', fecha_nacimiento: '' },
        // Mock: en producción la contraseña se cifraría antes de guardarse (RF-04)
        usuario: { correo, password, rol: 'paciente', nombre: `${nombres} ${apellidos}` },
      });

    return {
      // datos
      citas, medicos, pacientes, usuarios, especialidades, consultorios, horariosDisponibles, ESTADOS_ACTIVOS,
      // consultas
      nombreMedico, nombrePaciente, nombreEspecialidad, nombreConsultorio, especialidadDeMedico,
      citasDePaciente, citasDeMedico, todasLasCitas, pacientePorCorreo, medicoPorCorreo,
      medicosActivosDe, horariosOcupados,
      documentoRegistrado, correoRegistrado, documentoMedicoRegistrado, correoMedicoRegistrado,
      // acciones
      agendarCita, cambiarEstadoCita, crearMedico, alternarEstadoMedico, registrarPaciente,
    };
  }, [estado]);

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}
