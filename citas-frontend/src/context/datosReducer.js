// =====================================================================
// Lógica de estado de los datos del sistema (citas, médicos, pacientes y
// usuarios). Es una función pura: recibe el estado y una acción y devuelve
// un estado nuevo, sin modificar nunca el anterior. Está separada de los
// componentes para poder probarla y reutilizarla.
// =====================================================================
import { citas, medicos, pacientes, usuarios } from '../data/mockData.js';

const siguienteId = (lista, campo) => Math.max(0, ...lista.map((x) => x[campo])) + 1;

// Copia profunda de los datos de prueba: el estado nunca comparte referencias con mockData
export const estadoInicial = () => ({
  citas: citas.map((c) => ({ ...c })),
  medicos: medicos.map((m) => ({ ...m })),
  pacientes: pacientes.map((p) => ({ ...p })),
  usuarios: usuarios.map((u) => ({ ...u })),
});

export function datosReducer(estado, accion) {
  switch (accion.tipo) {
    case 'cita/agendada':
      return {
        ...estado,
        citas: [...estado.citas, { id_cita: siguienteId(estado.citas, 'id_cita'), estado: 'Programada', ...accion.cita }],
      };
    case 'cita/estado':
      return {
        ...estado,
        citas: estado.citas.map((c) => (c.id_cita === accion.id ? { ...c, estado: accion.estado } : c)),
      };
    case 'medico/creado':
      return {
        ...estado,
        medicos: [...estado.medicos, { id_medico: siguienteId(estado.medicos, 'id_medico'), estado: 'Activo', ...accion.medico }],
      };
    case 'medico/alternado':
      return {
        ...estado,
        medicos: estado.medicos.map((m) =>
          m.id_medico === accion.id ? { ...m, estado: m.estado === 'Activo' ? 'Inactivo' : 'Activo' } : m
        ),
      };
    case 'paciente/registrado':
      return {
        ...estado,
        pacientes: [...estado.pacientes, { id_paciente: siguienteId(estado.pacientes, 'id_paciente'), ...accion.paciente }],
        usuarios: [...estado.usuarios, accion.usuario],
      };
    default:
      return estado;
  }
}
