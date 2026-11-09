import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/ui/FormField.jsx';
import Button from '../../components/ui/Button.jsx';

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Recuperar() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviar = (e) => {
    e.preventDefault();
    if (!correo.trim()) {
      setError('El correo es obligatorio.');
      setEnviado(false);
      return;
    }
    if (!CORREO_RE.test(correo.trim())) {
      setError('Formato de correo inválido (ej.: nombre@dominio.com).');
      setEnviado(false);
      return;
    }
    setError('');
    setEnviado(true); // Mock: aquí el backend enviaría el correo de recuperación.
  };

  return (
    <div className="contenedor-estrecho">
      <h1>Recuperar contraseña</h1>
      <p className="ayuda-campo">
        Escribe tu correo registrado y te enviaremos las instrucciones para restablecerla.
      </p>

      {enviado && (
        <div className="aviso aviso--exito" role="status">
          Si el correo existe en nuestro sistema, recibirás las instrucciones en pocos minutos.
        </div>
      )}

      <form onSubmit={enviar} noValidate>
        <FormField
          label="Correo electrónico" tipo="email" nombre="correo-recuperar"
          valor={correo} onChange={(e) => setCorreo(e.target.value)}
          error={error} requerido autoComplete="email" placeholder="nombre@dominio.com"
        />
        <Button tipo="submit" bloque>Enviar instrucciones</Button>
      </form>
      <p className="enlaces-form">
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </div>
  );
}