import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';
import { documentoRegistrado, correoRegistrado } from '../../data/mockData.js';

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VACIO = {
  nombres: '', apellidos: '', documento: '', correo: '',
  telefono: '', password: '', confirmacion: '',
};

export default function Registro() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const validar = () => {
    const e = {};
    if (!datos.nombres.trim()) e.nombres = 'Los nombres son obligatorios.';
    else if (datos.nombres.trim().length < 3 || datos.nombres.trim().length > 60)
      e.nombres = 'Debe tener entre 3 y 60 caracteres.';

    if (!datos.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios.';
    else if (datos.apellidos.trim().length < 3 || datos.apellidos.trim().length > 60)
      e.apellidos = 'Debe tener entre 3 y 60 caracteres.';

    if (!datos.documento.trim()) e.documento = 'El documento es obligatorio.';
    else if (!/^\d{6,20}$/.test(datos.documento.trim()))
      e.documento = 'Entre 6 y 20 dígitos, sin letras ni espacios.';
    else if (documentoRegistrado(datos.documento.trim()))
      e.documento = 'Este documento ya está registrado (RF-03: unicidad).';

    if (!datos.correo.trim()) e.correo = 'El correo es obligatorio.';
    else if (!CORREO_RE.test(datos.correo.trim()))
      e.correo = 'Formato de correo inválido (ej.: nombre@dominio.com).';
    else if (correoRegistrado(datos.correo.trim().toLowerCase()))
      e.correo = 'Este correo ya tiene una cuenta (RF-03: unicidad).';

    if (!datos.telefono.trim()) e.telefono = 'El teléfono es obligatorio.';
    else if (!/^\d{7,15}$/.test(datos.telefono.trim()))
      e.telefono = 'Entre 7 y 15 dígitos, sin espacios ni guiones.';

    if (!datos.password) e.password = 'La contraseña es obligatoria.';
    else if (
      datos.password.length < 8 ||
      !/[A-Z]/.test(datos.password) ||
      !/[a-z]/.test(datos.password) ||
      !/\d/.test(datos.password)
    )
      e.password = 'Mínimo 8 caracteres, con mayúscula, minúscula y un número.';

    if (!datos.confirmacion) e.confirmacion = 'Confirma tu contraseña.';
    else if (datos.confirmacion !== datos.password)
      e.confirmacion = 'Las contraseñas no coinciden.';

    return e;
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setExito(false);
      return;
    }
    // Mock: en producción aquí se cifraría la contraseña (RF-04) y se persistiría.
    setExito(true);
    setDatos(VACIO);
  };

  return (
    <div className="contenedor-estrecho contenedor-medio">
      <h1>Crear cuenta de paciente</h1>
      <p className="ayuda-campo">Campos obligatorios marcados con * · formato de correo validado al enviar.</p>

      {exito && (
        <div className="aviso aviso--exito" role="status">
          Cuenta creada correctamente (mock). En producción, la contraseña se cifraría
          antes de guardarse (RF-04).{' '}
          <Link to="/login">Ir a iniciar sesión</Link>.
        </div>
      )}

      <form onSubmit={enviar} noValidate>
        <div className="form-fila">
          <FormField label="Nombres" nombre="nombres" valor={datos.nombres} onChange={cambiar} error={errores.nombres} requerido autoComplete="given-name" />
          <FormField label="Apellidos" nombre="apellidos" valor={datos.apellidos} onChange={cambiar} error={errores.apellidos} requerido autoComplete="family-name" />
        </div>
        <div className="form-fila">
          <FormField label="Documento de identidad" nombre="documento" valor={datos.documento} onChange={cambiar} error={errores.documento} requerido ayuda="Solo dígitos, entre 6 y 20." />
          <FormField label="Correo electrónico" tipo="email" nombre="correo" valor={datos.correo} onChange={cambiar} error={errores.correo} requerido autoComplete="email" />
        </div>
        <div className="form-fila">
          <FormField label="Teléfono" tipo="tel" nombre="telefono" valor={datos.telefono} onChange={cambiar} error={errores.telefono} requerido autoComplete="tel" />
          <FormField label="Contraseña" tipo="password" nombre="password" valor={datos.password} onChange={cambiar} error={errores.password} requerido autoComplete="new-password" />
        </div>
        <FormField label="Confirmar contraseña" tipo="password" nombre="confirmacion" valor={datos.confirmacion} onChange={cambiar} error={errores.confirmacion} requerido autoComplete="new-password" />
        <div className="hero-acciones">
          <Button tipo="submit">Registrarme</Button>
          <Link className="boton boton--secundario" to="/login">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}