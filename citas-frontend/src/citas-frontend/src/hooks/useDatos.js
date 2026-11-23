import { useContext } from 'react';
import { DatosContext } from '../context/contextos.js';

export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) throw new Error('useDatos debe usarse dentro de <DatosProvider>');
  return contexto;
}
