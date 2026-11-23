import { useState } from 'react';
import Button from './Button.jsx';

// Botón de acción delicada (p. ej. cancelar una cita) que pide una segunda
// confirmación en la misma fila antes de ejecutarse.
export default function AccionConfirmable({ etiqueta, etiquetaConfirmar, ariaLabel, alConfirmar }) {
  const [pidiendo, setPidiendo] = useState(false);

  if (!pidiendo) {
    return (
      <Button variante="secundario" aria-label={ariaLabel} onClick={() => setPidiendo(true)}>
        {etiqueta}
      </Button>
    );
  }
  return (
    <span className="hero-acciones">
      <Button
        variante="peligro"
        onClick={() => { setPidiendo(false); alConfirmar(); }}
      >
        {etiquetaConfirmar}
      </Button>
      <Button variante="secundario" onClick={() => setPidiendo(false)}>No</Button>
    </span>
  );
}
