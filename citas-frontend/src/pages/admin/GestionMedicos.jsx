import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import BadgeEstado from '../../components/ui/BadgeEstado.jsx';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import { medicos, especialidades, nombreEspecialidad } from '../../data/mockData.js';

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORM_VACIO = { nombre: '', apellido: '', documento: '', telefono: '', correo: '', id_especialidad: '' };

export default function GestionMedicos() {
  // RBAC (RF-12): esta vista solo se monta si RutaProtegida validó rol administrador
  const { sesion } = useAuth();
  const [lista, setLista] = useState([...medicos]);
  const [formAbierto, setFormAbierto] = useState(false);
  const [datos, setDatos] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState('');

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const validar = () => {
    const e = {};
    if (!datos.nombre.trim() || datos.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres.';
    if (!datos.apellido.trim() || datos.apellido.trim().length < 3) e.apellido = 'Mínimo 3 caracteres.';
    if (!/^\d{6,20}$/.test(datos.documento.trim())) e.documento = 'Entre 6 y 20 dígitos, sin letras.';
    else if (lista.some((m) => m.documento === datos.documento.trim())) e.documento = 'Ya existe un médico con ese documento.';
    if (!CORREO_RE.test(datos.correo.trim())) e.correo = 'Formato de correo inválido.';
    else if (lista.some((m) => m.correo === datos.correo.trim().toLowerCase())) e.correo = 'Ya existe un médico con ese correo.';
    if (!/^\d{7,15}$/.test(datos.telefono.trim())) e.telefono = 'Entre 7 y 15 dígitos.';
    if (!datos.id_especialidad) e.id_especialidad = 'Selecciona una especialidad.';
    return e;
  };

  const crear = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    const nuevo = {
      id_medico: Math.max(...lista.map((m) => m.id_medico)) + 1,
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      documento: datos.documento.trim(),
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim().toLowerCase(),
      id_especialidad: Number(datos.id_especialidad),
      estado: 'Activo',
    };
    medicos.push(nuevo); // Mock: en producción sería un POST al backend (RF-11)
    setLista([...medicos]);
    setDatos(FORM_VACIO);
    setFormAbierto(false);
    setAviso(`Médico ${nuevo.nombre} ${nuevo.apellido} creado correctamente.`);
  };

  const alternarEstado = (id) => {
    const medico = medicos.find((m) => m.id_medico === id);
    if (!medico) return;
    medico.estado = medico.estado === 'Activo' ? 'Inactivo' : 'Activo'; // Mock: PATCH al backend
    setLista([...medicos]);
    setAviso(`${medico.nombre} ${medico.apellido} ahora está ${medico.estado.toLowerCase()}.`);
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
          onClick={() => alternarEstado(m.id_medico)}
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

      {aviso && <div className="aviso aviso--exito" role="status">{aviso}</div>}

      {formAbierto && (
        <section className="tarjeta" style={{ marginBottom: '1.5rem' }} aria-labelledby="titulo-form-medico">
          <h2 id="titulo-form-medico">Alta de médico</h2>
          <form onSubmit={crear} noValidate>
            <div className="form-fila">
              <FormField label="Nombres" nombre="nombre" valor={datos.nombre} onChange={cambiar} error={errores.nombre} requerido />
              <FormField label="Apellidos" nombre="apellido" valor={datos.apellido} onChange={cambiar} error={errores.apellido} requerido />
            </div>
            <div className="form-fila">
              <FormField label="Documento" nombre="documento" valor={datos.documento} onChange={cambiar} error={errores.documento} requerido ayuda="Entre 6 y 20 dígitos, único." />
              <FormField label="Teléfono" tipo="tel" nombre="telefono" valor={datos.telefono} onChange={cambiar} error={errores.telefono} requerido />
            </div>
            <div className="form-fila">
              <FormField label="Correo institucional" tipo="email" nombre="correo" valor={datos.correo} onChange={cambiar} error={errores.correo} requerido autoComplete="email" />
              <FormField
                label="Especialidad" nombre="id_especialidad" valor={datos.id_especialidad}
                onChange={cambiar} error={errores.id_especialidad} requerido
                opciones={especialidades.map((es) => ({ valor: String(es.id_especialidad), texto: es.nombre }))}
              />
            </div>
            <div className="hero-acciones">
              <Button tipo="submit">Guardar médico</Button>
              <Button variante="secundario" onClick={() => { setFormAbierto(false); setErrores({}); setDatos(FORM_VACIO); }}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      <DataTable
        caption={`Médicos registrados (${lista.length}) · sesión de ${sesion.nombre} (rol ${sesion.rol})`}
        columnas={columnas}
        filas={lista}
        clave={(m) => m.id_medico}
      />
      <p className="ayuda-campo" style={{ marginTop: '1rem' }}>
        RF-12: acceso restringido al rol administrador. Los médicos inactivos no aparecen
        en el formulario de agendamiento del paciente.
      </p>
    </>
  );
}