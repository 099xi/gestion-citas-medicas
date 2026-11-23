// Utilidades de fecha/hora para la demo (sin dependencias externas).
// Todas trabajan con la fecha LOCAL del equipo, nunca con UTC: así la demo
// se ve igual a cualquier hora del día (toISOString() usa UTC y desfasa el día).
const dosDigitos = (n) => String(n).padStart(2, '0');

export const aISO = (fecha) =>
  `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

export const hoyISO = () => aISO(new Date());

export const desplazarDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return aISO(fecha);
};

export const formatoFecha = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d} ${meses[m - 1]} ${y}`;
};

export const sumarMinutos = (hora, minutos) => {
  const [h, m] = hora.split(':').map(Number);
  const total = h * 60 + m + minutos;
  return `${dosDigitos(Math.floor(total / 60))}:${dosDigitos(total % 60)}:00`;
};
