// =====================================================================
// Reglas de validación compartidas por todos los formularios.
// Una sola fuente de verdad: si cambia una regla, se cambia aquí.
// =====================================================================

export const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const correoValido = (valor) => CORREO_RE.test(valor.trim());
export const documentoValido = (valor) => /^\d{6,20}$/.test(valor.trim());
export const telefonoValido = (valor) => /^\d{7,15}$/.test(valor.trim());
export const longitudEntre = (valor, min, max) => {
  const largo = valor.trim().length;
  return largo >= min && largo <= max;
};
export const passwordFuerte = (valor) =>
  valor.length >= 8 && /[A-Z]/.test(valor) && /[a-z]/.test(valor) && /\d/.test(valor);
