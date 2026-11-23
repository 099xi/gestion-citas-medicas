import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useDatos } from '../../hooks/useDatos.js';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';
import Aviso from '../../components/ui/Aviso.jsx';
import { hoyISO } from '../../utils/fechas.js';

export default function AgendarCita() {
  const { sesion } = useAuth();
  const { especialidades, medicosActivosDe, horariosDisponibles, horariosOcupados, pacientePorCorreo, agendarCita } = useDatos();
  const paciente = pacientePorCorreo(sesion.correo);

  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  // Solo médicos ACTIVOS de la especialidad elegida
  const medicosDeEspecialidad = especialidadId ? medicosActivosDe(Number(especialidadId)) : [];
  // RF-07: bloques ya ocupados por ese médico en esa fecha
  const ocupados = medicoId && fecha ? horariosOcupados(Number(medicoId), fecha) : [];

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

    // El contexto vuelve a verificar el doble agendamiento (RF-08) y registra la cita
    const resultado = agendarCita({
      idPaciente: paciente.id_paciente, idMedico: Number(medicoId), fecha, hora, motivo,
    });
    if (!resultado.ok) {
      setErrores({ hora: resultado.error });
      return;
    }
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
        <Aviso>
          {exito} <Link to="/paciente/mis-citas">Ir a Mis citas</Link>.
        </Aviso>
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
                const ocupado = ocupados.includes(h);
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
