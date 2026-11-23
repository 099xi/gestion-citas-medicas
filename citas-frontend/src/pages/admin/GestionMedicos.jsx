import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useDatos } from '../../hooks/useDatos.js';
import useFormulario from '../../hooks/useFormulario.js';
import { correoValido, documentoValido, telefonoValido, longitudEntre } from '../../utils/validaciones.js';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Aviso from '../../components/ui/Aviso.jsx';

const FORM_VACIO = { nombre: '', apellido: '', documento: '', telefono: '', correo: '', id_especialidad: '' };

export default function GestionMedicos() {
  // RBAC (RF-12): esta vista solo se monta si RutaProtegida validó rol administrador
  const { sesion } = useAuth();
  const {
    medicos, especialidades, nombreEspecialidad, crearMedico, alternarEstadoMedico,
    documentoMedicoRegistrado, correoMedicoRegistrado,
  } = useDatos();
  const [formAbierto, setFormAbierto] = useState(false);
  const [aviso, setAviso] = useState('');

  const validar = (d) => {
    const e = {};
    if (!longitudEntre(d.nombre, 3, 60)) e.nombre = 'Mínimo 3 caracteres.';
    if (!longitudEntre(d.apellido, 3, 60)) e.apellido = 'Mínimo 3 caracteres.';
    if (!documentoValido(d.documento)) e.documento = 'Entre 6 y 20 dígitos, sin letras.';
    else if (documentoMedicoRegistrado(d.documento.trim())) e.documento = 'Ya existe un médico con ese documento.';
    if (!correoValido(d.correo)) e.correo = 'Formato de correo inválido.';
    else if (correoMedicoRegistrado(d.correo.trim().toLowerCase())) e.correo = 'Ya existe un médico con ese correo.';
    if (!telefonoValido(d.telefono)) e.telefono = 'Entre 7 y 15 dígitos.';
    if (!d.id_especialidad) e.id_especialidad = 'Selecciona una especialidad.';
    return e;
  };

  const { valores, errores, cambiar, enviar, reiniciar } = useFormulario(FORM_VACIO, validar);

  const crear = (d) => {
    const nuevo = {
      nombre: d.nombre.trim(),
      apellido: d.apellido.trim(),
      documento: d.documento.trim(),
      telefono: d.telefono.trim(),
      correo: d.correo.trim().toLowerCase(),
      id_especialidad: Number(d.id_especialidad),
    };
    crearMedico(nuevo); // Mock: en producción sería un POST al backend (RF-11)
    reiniciar();
    setFormAbierto(false);
    setAviso(`Médico ${nuevo.nombre} ${nuevo.apellido} creado correctamente.`);
  };

  const alternar = (m) => {
    alternarEstadoMedico(m.id_medico); // Mock: PATCH al backend
    setAviso(`${m.nombre} ${m.apellido} ahora está ${m.estado === 'Activo' ? 'inactivo' : 'activo'}.`);
  };

  const columnas = [
    { campo: 'nombre', titulo: 'Nombre', render: (m) => `${m.nombre} ${m.apellido}` },
    { campo: 'especialidad', titulo: 'Especialidad', render: (m) => nombreEspecialidad(m.id_especialidad) },
    { campo: 'documento', titulo: 'Documento' },
    { campo: 'estado', titulo: 'Estado', render: (m) => <BadgeEstado estado={m.estado} /> },
    {
      campo: 'accion', titulo: 'Acción',
      render: (m) => (
        <Button
          variante={m.estado === 'Activo' ? 'peligro' : 'secundario'}
          aria-label={`${m.estado === 'Activo' ? 'Inactivar' : 'Activar'} al médico ${m.nombre} ${m.apellido}`}
          onClick={() => alternar(m)}
        >
          {m.estado === 'Activo' ? 'Inactivar' : 'Activar'}
        </Button>
      ),
    },
  ];

  return (
    <>
      <header className="panel-encabezado">
        <h1>Gestión de médicos</h1>
        <Button onClick={() => { setFormAbierto(!formAbierto); setAviso(''); }}>
          {formAbierto ? 'Cerrar formulario' : '+ Nuevo médico'}
        </Button>
      </header>

      {aviso && <Aviso>{aviso}</Aviso>}

      {formAbierto && (
        <section className="tarjeta" style={{ marginBottom: '1.5rem' }} aria-labelledby="titulo-form-medico">
          <h2 id="titulo-form-medico">Alta de médico</h2>
          <form onSubmit={enviar(crear)} noValidate>
            <div className="form-fila">
              <FormField label="Nombres" nombre="nombre" valor={valores.nombre} onChange={cambiar} error={errores.nombre} requerido />
              <FormField label="Apellidos" nombre="apellido" valor={valores.apellido} onChange={cambiar} error={errores.apellido} requerido />
            </div>
            <div className="form-fila">
              <FormField label="Documento" nombre="documento" valor={valores.documento} onChange={cambiar} error={errores.documento} requerido ayuda="Entre 6 y 20 dígitos, único." />
              <FormField label="Teléfono" tipo="tel" nombre="telefono" valor={valores.telefono} onChange={cambiar} error={errores.telefono} requerido />
            </div>
            <div className="form-fila">
              <FormField label="Correo institucional" tipo="email" nombre="correo" valor={valores.correo} onChange={cambiar} error={errores.correo} requerido autoComplete="email" />
              <FormField
                label="Especialidad" nombre="id_especialidad" valor={valores.id_especialidad}
                onChange={cambiar} error={errores.id_especialidad} requerido
                opciones={especialidades.map((es) => ({ valor: String(es.id_especialidad), texto: es.nombre }))}
              />
            </div>
            <div className="hero-acciones">
              <Button tipo="submit">Guardar médico</Button>
              <Button variante="secundario" onClick={() => { setFormAbierto(false); reiniciar(); }}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      <DataTable
        caption={`Médicos registrados (${medicos.length}) · sesión de ${sesion.nombre} (rol ${sesion.rol})`}
        columnas={columnas}
        filas={medicos}
        clave={(m) => m.id_medico}
      />
      <p className="ayuda-campo" style={{ marginTop: '1rem' }}>
        RF-12: acceso restringido al rol administrador. Los médicos inactivos no aparecen
        en el formulario de agendamiento del paciente.
      </p>
    </>
  );
}
