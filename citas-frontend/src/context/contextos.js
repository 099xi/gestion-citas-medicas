// Objetos de contexto. Viven aparte de los proveedores para que cada archivo
// de componentes exporte solo componentes (requisito de Fast Refresh).
import { createContext } from 'react';

export const AuthContext = createContext(null);
export const DatosContext = createContext(null);
