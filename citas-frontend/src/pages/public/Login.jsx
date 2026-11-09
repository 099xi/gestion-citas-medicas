import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const { login } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [datos, setDatos] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};
    if (!datos.correo.trim()) nuevos.correo = 'El correo es obligatorio.';
    else if (!CORREO_RE.test(datos.correo.trim())) nuevos.correo = 'Formato de correo inválido (ej.: nombre@dominio.com).';
    if (!datos.password) nuevos.password = 'La contraseña es obligatoria.';
    else if (datos.password.length < 8) nuevos.password = 'La contraseña debe tener al menos 8 caracteres.';
    return nuevos;
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    setErrorGeneral('');
    if (Object.keys(nuevos).length > 0) return;

    const resultado = login(datos.correo, datos.password);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    const destino = ubicacion.state?.desde ?? (resultado.rol === 'administrador' ? '/admin/medicos' : '/paciente');
    navegar(destino, { replace: true });
  };

  return (
    <div className="contenedor-estrecho">
      <h1>Iniciar sesión</h1>
      <p className="ayuda-campo">
        Demo: juan.martinez@correo.com / Paciente123* · admin@clinica.com / Admin123*
      </p>
      {errorGeneral && <div className="aviso aviso--error" role="alert">{errorGeneral}</div>}
      <form onSubmit={enviar} noValidate>
        <FormField
          label="Correo electrónico" tipo="email" nombre="correo"
          valor={datos.correo} onChange={cambiar} error={errores.correo}
          requerido autoComplete="email" placeholder="nombre@dominio.com"
        />
        <FormField
          label="Contraseña" tipo="password" nombre="password"
          valor={datos.password} onChange={cambiar} error={errores.password}
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