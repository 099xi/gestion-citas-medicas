// Mensaje de resultado para el usuario (éxito o error), accesible para lectores de pantalla.
export default function Aviso({ tipo = 'exito', children }) {
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
