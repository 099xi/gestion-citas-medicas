// =====================================================================
// Datos de prueba (mock) coherentes con la base gestion_citas_medicas
// de la Evidencia 2. La Evidencia 3 aún no consume servicios: estos
// datos simulan el backend para que la interfaz sea navegable.
// =====================================================================

export const especialidades = [
  { id_especialidad: 1, nombre: 'Medicina General', descripcion: 'Atención primaria y valoración inicial del paciente' },
  { id_especialidad: 2, nombre: 'Pediatría', descripcion: 'Atención médica para niños y adolescentes' },
  { id_especialidad: 3, nombre: 'Cardiología', descripcion: 'Diagnóstico y tratamiento de enfermedades del corazón' },
  { id_especialidad: 4, nombre: 'Dermatología', descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel' },
  { id_especialidad: 5, nombre: 'Ginecología', descripcion: 'Salud del sistema reproductor femenino' },
];

export const medicos = [
  { id_medico: 1, nombre: 'Carlos',  apellido: 'Ramírez',  documento: '10001001', telefono: '3001110001', correo: 'carlos.ramirez@clinica.com',   id_especialidad: 1, estado: 'Activo' },
  { id_medico: 2, nombre: 'Laura',   apellido: 'Gómez',    documento: '10001002', telefono: '3001110002', correo: 'laura.gomez@clinica.com',      id_especialidad: 2, estado: 'Activo' },
  { id_medico: 3, nombre: 'Andrés',  apellido: 'Pérez',    documento: '10001003', telefono: '3001110003', correo: 'andres.perez@clinica.com',     id_especialidad: 3, estado: 'Activo' },
  { id_medico: 4, nombre: 'Marcela', apellido: 'Torres',   documento: '10001004', telefono: '3001110004', correo: 'marcela.torres@clinica.com',   id_especialidad: 4, estado: 'Activo' },
  { id_medico: 5, nombre: 'Diana',   apellido: 'Suárez',   documento: '10001005', telefono: '3001110005', correo: 'diana.suarez@clinica.com',     id_especialidad: 5, estado: 'Activo' },
  { id_medico: 6, nombre: 'Ernesto', apellido: 'Castillo', documento: '10001006', telefono: '3001110006', correo: 'ernesto.castillo@clinica.com', id_especialidad: 1, estado: 'Inactivo' },
];

export const consultorios = [
  { id_consultorio: 1, nombre: 'Consultorio 101', ubicacion: 'Piso 1 - Torre A' },
  { id_consultorio: 2, nombre: 'Consultorio 102', ubicacion: 'Piso 1 - Torre A' },
  { id_consultorio: 3, nombre: 'Consultorio 201', ubicacion: 'Piso 2 - Torre B' },
];

export const pacientes = [
  { id_paciente: 1, nombre: 'Juan',      apellido: 'Martínez',  documento: '20001001', telefono: '3102220001', correo: 'juan.martinez@correo.com',     direccion: 'Cra 10 #20-30', fecha_nacimiento: '1990-05-14' },
  { id_paciente: 2, nombre: 'María',     apellido: 'López',     documento: '20001002', telefono: '3102220002', correo: 'maria.lopez@correo.com',       direccion: 'Cll 15 #8-22',  fecha_nacimiento: '1985-11-02' },
  { id_paciente: 3, nombre: 'Pedro',     apellido: 'Rodríguez', documento: '20001003', telefono: '3102220003', correo: 'pedro.rodriguez@colegio.edu.co', direccion: 'Cra 5 #12-10',  fecha_nacimiento: '2015-03-21' },
  { id_paciente: 4, nombre: 'Sofía',     apellido: 'Hernández', documento: '20001004', telefono: '3102220004', correo: 'sofia.hernandez@correo.com',   direccion: 'Cll 30 #4-55',  fecha_nacimiento: '1998-07-09' },
  { id_paciente: 5, nombre: 'Camilo',    apellido: 'Vargas',    documento: '20001005', telefono: '3102220005', correo: 'camilo.vargas@correo.com',     direccion: 'Cra 18 #9-40',  fecha_nacimiento: '1975-01-30' },
  { id_paciente: 6, nombre: 'Valentina', apellido: 'Ríos',      documento: '20001006', telefono: '3102220006', correo: 'valentina.rios@correo.com',    direccion: 'Cll 22 #6-15',  fecha_nacimiento: '2002-09-17' },
  { id_paciente: 7, nombre: 'Andrés',    apellido: 'Moreno',    documento: '20001007', telefono: '3102220007', correo: 'andres.moreno@correo.com',     direccion: 'Cra 7 #14-60',  fecha_nacimiento: '1992-12-25' },
  { id_paciente: 8, nombre: 'Isabel',    apellido: 'Castro',    documento: '20001008', telefono: '3102220008', correo: 'isabel.castro@correo.com',     direccion: 'Cll 40 #2-18',  fecha_nacimiento: '1988-04-05' },
];

// Usuarios de demostración para el login sin backend (RBAC del mapa)
export const usuarios = [
  { correo: 'juan.martinez@correo.com',   password: 'Paciente123*', rol: 'paciente',      nombre: 'Juan Martínez' },
  { correo: 'carlos.ramirez@clinica.com', password: 'Medico123*',   rol: 'medico',        nombre: 'Carlos Ramírez' },
  { correo: 'admin@clinica.com',          password: 'Admin123*',    rol: 'administrador', nombre: 'Administrador del sistema' },
];

// Fechas relativas a hoy: la demo siempre se ve "viva"
const desplazarDia = (offset) => {
  const f = new Date();
  f.setDate(f.getDate() + offset);
  return f.toISOString().slice(0, 10);
};

// Coherencia con la Evidencia 2: la cita 2 no existe porque fue
// eliminada en el Script 04 (DELETE con ON DELETE CASCADE).
export const citas = [
  { id_cita: 1,  id_paciente: 1, id_medico: 1, id_consultorio: 1, fecha: desplazarDia(-10), hora_inicio: '08:30:00', hora_fin: '09:00:00', motivo: 'Dolor lumbar',               estado: 'Atendida' },
  { id_cita: 3,  id_paciente: 3, id_medico: 6, id_consultorio: 2, fecha: desplazarDia(-20), hora_inicio: '10:00:00', hora_fin: '10:30:00', motivo: 'Consulta general de rutina', estado: 'Atendida' },
  { id_cita: 4,  id_paciente: 1, id_medico: 1, id_consultorio: 1, fecha: desplazarDia(0),   hora_inicio: '08:00:00', hora_fin: '08:30:00', motivo: 'Consulta general de rutina', estado: 'Confirmada' },
  { id_cita: 5,  id_paciente: 3, id_medico: 2, id_consultorio: 2, fecha: desplazarDia(1),   hora_inicio: '10:00:00', hora_fin: '10:30:00', motivo: 'Control de crecimiento',     estado: 'Confirmada' },
  { id_cita: 6,  id_paciente: 8, id_medico: 1, id_consultorio: 1, fecha: desplazarDia(2),   hora_inicio: '16:00:00', hora_fin: '16:30:00', motivo: 'Consulta general',           estado: 'Confirmada' },
  { id_cita: 7,  id_paciente: 2, id_medico: 3, id_consultorio: 3, fecha: desplazarDia(3),   hora_inicio: '09:00:00', hora_fin: '09:30:00', motivo: 'Chequeo cardiológico',       estado: 'Programada' },
  { id_cita: 8,  id_paciente: 4, id_medico: 5, id_consultorio: 1, fecha: desplazarDia(4),   hora_inicio: '11:00:00', hora_fin: '11:30:00', motivo: 'Valoración ginecológica',    estado: 'Programada' },
  { id_cita: 10, id_paciente: 1, id_medico: 4, id_consultorio: 2, fecha: desplazarDia(7),   hora_inicio: '08:00:00', hora_fin: '08:30:00', motivo: 'Consulta dermatológica',     estado: 'Programada' },
  { id_cita: 11, id_paciente: 2, id_medico: 1, id_consultorio: 1, fecha: desplazarDia(8),   hora_inicio: '09:30:00', hora_fin: '10:00:00', motivo: 'Seguimiento tratamiento',    estado: 'Programada' },
];

// Horarios del wireframe "Agendar cita"
export const horariosDisponibles = ['08:00', '09:30', '11:00', '14:00', '15:30'];

// Utilidades de lectura para las vistas
export const nombreMedico = (id) => {
  const m = medicos.find((x) => x.id_medico === id);
  return m ? `${m.nombre} ${m.apellido}` : '—';
};
export const nombreEspecialidad = (id) => especialidades.find((x) => x.id_especialidad === id)?.nombre ?? '—';
export const nombreConsultorio = (id) => consultorios.find((x) => x.id_consultorio === id)?.nombre ?? '—';
export const citasDePaciente = (idPaciente) =>
  citas.filter((c) => c.id_paciente === idPaciente).sort((a, b) => a.fecha.localeCompare(b.fecha));

// Validaciones de unicidad (RF-03 del prototipo)
export const documentoRegistrado = (doc) => pacientes.some((p) => p.documento === doc);
export const correoRegistrado = (correo) =>
  pacientes.some((p) => p.correo === correo) || usuarios.some((u) => u.correo === correo);