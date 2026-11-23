import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatos } from '../../hooks/useDatos.js';
import useFormulario from '../../hooks/useFormulario.js';
import { correoValido, documentoValido, telefonoValido, longitudEntre, passwordFuerte } from '../../utils/validaciones.js';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';
import Aviso from '../../components/ui/Aviso.jsx';

const VACIO = {
  nombres: '', apellidos: '', documento: '', correo: '',
  telefono: '', password: '', confirmacion: '',
};

export default function Registro() {
  const { documentoRegistrado, correoRegistrado, registrarPaciente } = useDatos();
  const [exito, setExito] = useState(false);

  const validar = (d) => {
    const e = {};
    if (!d.nombres.trim()) e.nombres = 'Los nombres son obligatorios.';
    else if (!longitudEntre(d.nombres, 3, 60)) e.nombres = 'Debe tener entre 3 y 60 caracteres.';

    if (!d.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios.';
    else if (!longitudEntre(d.apellidos, 3, 60)) e.apellidos = 'Debe tener entre 3 y 60 caracteres.';

    if (!d.documento.trim()) e.documento = 'El documento es obligatorio.';
    else if (!documentoValido(d.documento)) e.documento = 'Entre 6 y 20 dígitos, sin letras ni espacios.';
    else if (documentoRegistrado(d.documento.trim())) e.documento = 'Este documento ya está registrado (RF-03: unicidad).';

    if (!d.correo.trim()) e.correo = 'El correo es obligatorio.';
    else if (!correoValido(d.correo)) e.correo = 'Formato de correo inválido (ej.: nombre@dominio.com).';
    else if (correoRegistrado(d.correo.trim().toLowerCase())) e.correo = 'Este correo ya tiene una cuenta (RF-03: unicidad).';

    if (!d.telefono.trim()) e.telefono = 'El teléfono es obligatorio.';
    else if (!telefonoValido(d.telefono)) e.telefono = 'Entre 7 y 15 dígitos, sin espacios ni guiones.';

    if (!d.password) e.password = 'La contraseña es obligatoria.';
    else if (!passwordFuerte(d.password)) e.password = 'Mínimo 8 caracteres, con mayúscula, minúscula y un número.';

    if (!d.confirmacion) e.confirmacion = 'Confirma tu contraseña.';
    else if (d.confirmacion !== d.password) e.confirmacion = 'Las contraseñas no coinciden.';
    return e;
  };

  const { valores, errores, cambiar, enviar, reiniciar } = useFormulario(VACIO, validar);

  const crearCuenta = (d) => {
    registrarPaciente({
      nombres: d.nombres.trim(),
      apellidos: d.apellidos.trim(),
      documento: d.documento.trim(),
      correo: d.correo.trim().toLowerCase(),
      telefono: d.telefono.trim(),
      password: d.password,
    });
    setExito(true);
    reiniciar();
  };

  return (
    <div className="contenedor-estrecho contenedor-medio">
      <h1>Crear cuenta de paciente</h1>
      <p className="ayuda-campo">Campos obligatorios marcados con * · formato de correo validado al enviar.</p>

      {exito && (
        <Aviso>
          Cuenta creada correctamente (mock). En producción, la contraseña se cifraría
          antes de guardarse (RF-04).{' '}
          <Link to="/login">Ir a iniciar sesión</Link>.
        </Aviso>
      )}

      <form onSubmit={(e) => { setExito(false); enviar(crearCuenta)(e); }} noValidate>
        <div className="form-fila">
          <FormField label="Nombres" nombre="nombres" valor={valores.nombres} onChange={cambiar} error={errores.nombres} requerido autoComplete="given-name" />
          <FormField label="Apellidos" nombre="apellidos" valor={valores.apellidos} onChange={cambiar} error={errores.apellidos} requerido autoComplete="family-name" />
        </div>
        <div className="form-fila">
          <FormField label="Documento de identidad" nombre="documento" valor={valores.documento} onChange={cambiar} error={errores.documento} requerido ayuda="Solo dígitos, entre 6 y 20." />
          <FormField label="Correo electrónico" tipo="email" nombre="correo" valor={valores.correo} onChange={cambiar} error={errores.correo} requerido autoComplete="email" />
        </div>
        <div className="form-fila">
          <FormField label="Teléfono" tipo="tel" nombre="telefono" valor={valores.telefono} onChange={cambiar} error={errores.telefono} requerido autoComplete="tel" />
          <FormField label="Contraseña" tipo="password" nombre="password" valor={valores.password} onChange={cambiar} error={errores.password} requerido autoComplete="new-password" />
        </div>
        <FormField label="Confirmar contraseña" tipo="password" nombre="confirmacion" valor={valores.confirmacion} onChange={cambiar} error={errores.confirmacion} requerido autoComplete="new-password" />
        <div className="hero-acciones">
          <Button tipo="submit">Registrarme</Button>
          <Link className="boton boton--secundario" to="/login">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
