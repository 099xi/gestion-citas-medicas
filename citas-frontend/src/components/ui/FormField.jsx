import { useId } from 'react';

export default function FormField({
  label, tipo = 'text', nombre, valor, onChange, error, ayuda,
  opciones, requerido = false, placeholder, min, max, autoComplete,
}) {
  const id = useId();
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;
  const descritoPor = [error ? idError : null, ayuda ? idAyuda : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="campo">
      <label htmlFor={id}>
        {label} {requerido && <span aria-hidden="true">*</span>}
      </label>
      {opciones ? (
        <select
          id={id} name={nombre} value={valor} onChange={onChange}
          aria-invalid={error ? 'true' : undefined} aria-describedby={descritoPor}
        >
          <option value="">{placeholder ?? 'Seleccione…'}</option>
          {opciones.map((op) => (
            <option key={op.valor} value={op.valor}>{op.texto}</option>
          ))}
        </select>
      ) : (
        <input
          id={id} type={tipo} name={nombre} value={valor} onChange={onChange}
          placeholder={placeholder} min={min} max={max} autoComplete={autoComplete}
          aria-invalid={error ? 'true' : undefined} aria-describedby={descritoPor}
          aria-required={requerido || undefined}
        />
      )}
      {ayuda && !error && <p className="ayuda-campo" id={idAyuda}>{ayuda}</p>}
      {error && <p className="error-campo" id={idError} role="alert">{error}</p>}
    </div>
  );
}