import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import useFormulario from '../../hooks/useFormulario.js';
import { correoValido } from '../../utils/validaciones.js';
import { rutaInicialPorRol } from '../../utils/roles.js';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';
import Aviso from '../../components/ui/Aviso.jsx';

const validar = ({ correo, password }) => {
  const errores = {};
  if (!correo.trim()) errores.correo = 'El correo es obligatorio.';
  else if (!correoValido(correo)) errores.correo = 'Formato de correo inválido (ej.: nombre@dominio.com).';
  if (!password) errores.password = 'La contraseña es obligatoria.';
  else if (password.length < 8) errores.password = 'La contraseña debe tener al menos 8 caracteres.';
  return errores;
};

export default function Login() {
  const { login } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [errorGeneral, setErrorGeneral] = useState('');
  const { valores, errores, cambiar, enviar } = useFormulario({ correo: '', password: '' }, validar);

  const ingresar = ({ correo, password }) => {
    const resultado = login(correo, password);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    navegar(ubicacion.state?.desde ?? rutaInicialPorRol[resultado.rol], { replace: true });
  };

  return (
    <div className="contenedor-estrecho">
      <h1>Iniciar sesión</h1>
      <p className="ayuda-campo">
        Demo: juan.martinez@correo.com / Paciente123* · carlos.ramirez@clinica.com / Medico123* · admin@clinica.com / Admin123*
      </p>
      {errorGeneral && <Aviso tipo="error">{errorGeneral}</Aviso>}
      <form onSubmit={(e) => { setErrorGeneral(''); enviar(ingresar)(e); }} noValidate>
        <FormField
          label="Correo electrónico" tipo="email" nombre="correo"
          valor={valores.correo} onChange={cambiar} error={errores.correo}
          requerido autoComplete="email" placeholder="nombre@dominio.com"
        />
        <FormField
          label="Contraseña" tipo="password" nombre="password"
          valor={valores.password} onChange={cambiar} error={errores.password}
          requerido autoComplete="current-password"
        />
        <Button tipo="submit" bloque>Ingresar</Button>
      </form>
      <p className="enlaces-form">
        <Link to="/recuperar">¿Olvidó su contraseña?</Link> · <Link to="/registro">Crear una cuenta nueva</Link>
      </p>
    </div>
  );
}
