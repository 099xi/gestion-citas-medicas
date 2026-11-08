export default function Button({ children, tipo = 'button', variante = 'primario', bloque = false, onClick, ...resto }) {
  const clases = [
    'boton',
    variante === 'secundario' && 'boton--secundario',
    variante === 'peligro' && 'boton--peligro',
    bloque && 'boton--bloque',
  ].filter(Boolean).join(' ');

  return (
    <button type={tipo} className={clases} onClick={onClick} {...resto}>
      {children}
    </button>
  );
}