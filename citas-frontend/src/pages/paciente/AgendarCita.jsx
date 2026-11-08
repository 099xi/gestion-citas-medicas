import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';
import { especialidades, medicos, citas, horariosDisponibles, pacientes } from '../../data/mockData.js';
import { hoyISO, sumarMinutos } from '../../utils/fechas.js';

export default function AgendarCita() {
  const { sesion } = useAuth();
  const idPaciente = pacientes.find((p) => p.correo === sesion.correo)?.id_paciente ?? 1;

  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  // Solo médicos ACTIVOS de la especialidad elegida
  const medicosDeEspecialidad = useMemo(
    () => medicos.filter((m) => m.estado === 'Activo' && String(m.id_especialidad) === especialidadId),
    [especialidadId]
  );

  // RF-07: bloques ya ocupados por ese médico en esa fecha (canceladas no cuentan)
  const horariosOcupados = useMemo(
    () =>
      citas
        .filter((c) => String(c.id_medico) === medicoId && c.fecha === fecha && c.estado !== 'Cancelada')
        .map((c) => c.hora_inicio.slice(0, 5)),
    [medicoId, fecha]
  );

  const validar = () => {
    const e = {};
    if (!especialidadId) e.especialidad = 'Selecciona una especialidad.';
    if (!medicoId) e.medico = 'Selecciona un médico disponible.';
    if (!fecha) e.fecha = 'Selecciona una fecha.';
    else if (fecha < hoyISO()) e.fecha = 'La fecha no puede ser anterior a hoy.';
    if (!hora) e.hora = 'Selecciona un bloque de horario disponible.';
    if (motivo.length > 200) e.motivo = 'Máximo 200 caracteres.';
    return e;
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    // RF-08: doble verificación de doble agendamiento
    if (horariosOcupados.includes(hora)) {
      setErrores({ hora: 'Ese bloque ya fue ocupado por otro paciente (RF-08).' });
      return;
    }
    // Mock: registramos la cita en el arreglo compartido (simula el POST al backend)
    const nuevoId = Math.max(...citas.map((c) => c.id_cita)) + 1;
    citas.push({
      id_cita: nuevoId,
      id_paciente: idPaciente,
      id_medico: Number(medicoId),
      id_consultorio: (Number(medicoId) % 3) + 1,
      fecha,
      hora_inicio: `${hora}:00`,
      hora_fin: sumarMinutos(hora, 30),
      motivo: motivo.trim() || 'Consulta general',
      estado: 'Programada',
    });
    setExito(`Cita registrada para el ${fecha} a las ${hora}. Ya puedes verla en Mis citas.`);
    setHora('');
    setMotivo('');
  };

  return (
    <>
      <h1>Agendar nueva cita</h1>
      <p className="ayuda-campo">
        Selección progresiva: especialidad → médico → fecha → hora (RF-07 y RF-08).
      </p>

      {exito && (
        <div className="aviso aviso--exito" role="status">
          {exito} <Link to="/paciente/mis-citas">Ir a Mis citas</Link>.
        </div>
      )}

      <form onSubmit={enviar} noValidate>
        <div className="form-fila">
          <FormField
            label="Especialidad médica" nombre="especialidad" valor={especialidadId}
            onChange={(e) => { setEspecialidadId(e.target.value); setMedicoId(''); setHora(''); setExito(''); }}
            error={errores.especialidad} requerido
            opciones={especialidades.map((es) => ({ valor: String(es.id_especialidad), texto: es.nombre }))}
          />
          <FormField
            label="Médico disponible" nombre="medico" valor={medicoId}
            onChange={(e) => { setMedicoId(e.target.value); setHora(''); setExito(''); }}
            error={errores.medico} requerido
            opciones={medicosDeEspecialidad.map((m) => ({ valor: String(m.id_medico), texto: `${m.nombre} ${m.apellido}` }))}
            placeholder={especialidadId ? 'Seleccione…' : 'Primero elige especialidad'}
          />
        </div>

        <div className="form-fila">
          <FormField
            label="Fecha" tipo="date" nombre="fecha" valor={fecha} min={hoyISO()}
            onChange={(e) => { setFecha(e.target.value); setHora(''); setExito(''); }}
            error={errores.fecha} requerido
          />
          <div className="campo">
            <label id="etiqueta-hora">Hora disponible</label>
            <div className="bloques-horario" role="group" aria-labelledby="etiqueta-hora">
              {horariosDisponibles.map((h) => {
                const ocupado = horariosOcupados.includes(h);
                return (
                  <button
                    key={h}
                    type="button"
                    className="bloque-horario"
                    aria-pressed={hora === h}
                    disabled={ocupado || !medicoId || !fecha}
                    onClick={() => { setHora(h); setErrores((prev) => ({ ...prev, hora: undefined })); setExito(''); }}
                  >
                    {h}{ocupado ? ' (ocupado)' : ''}
                  </button>
                );
              })}
            </div>
            {errores.hora && <p className="error-campo" role="alert">{errores.hora}</p>}
            {!medicoId || !fecha ? (
              <p className="ayuda-campo">Elige médico y fecha para ver la disponibilidad.</p>
            ) : (
              <p className="ayuda-campo">Los bloques marcados "(ocupado)" no se pueden agendar (RF-08).</p>
            )}
          </div>
        </div>

        <FormField
          label="Motivo de la consulta (opcional)" nombre="motivo" valor={motivo}
          onChange={(e) => setMotivo(e.target.value)} error={errores.motivo}
          ayuda="Máximo 200 caracteres."
        />

        <div className="hero-acciones">
          <Button tipo="submit">Confirmar cita</Button>
          <Link className="boton boton--secundario" to="/paciente">Cancelar</Link>
        </div>
      </form>
    </>
  );
}