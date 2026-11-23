import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './contextos.js';
import { useDatos } from '../hooks/useDatos.js';

const CLAVE_SESION = 'sgcm_sesion';

const leerSesionGuardada = () => {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const { usuarios } = useDatos();
  const [guardada, setGuardada] = useState(leerSesionGuardada);

  // La sesión solo es válida si el usuario sigue existiendo en los datos
  // (evita sesiones "huérfanas" cuando la demo se recarga y se reinician los datos de prueba).
  const sesion = useMemo(
    () => (guardada && usuarios.some((u) => u.correo === guardada.correo) ? guardada : null),
    [guardada, usuarios]
  );

  const login = useCallback(
    (correo, password) => {
      const usuario = usuarios.find((u) => u.correo === correo.trim().toLowerCase() && u.password === password);
      if (!usuario) {
        return { ok: false, error: 'Credenciales inválidas: verifica tu correo y contraseña.' };
      }
      const { password: _omitida, ...datos } = usuario;
      setGuardada(datos);
      try { localStorage.setItem(CLAVE_SESION, JSON.stringify(datos)); } catch { /* sin almacenamiento */ }
      return { ok: true, rol: datos.rol };
    },
    [usuarios]
  );

  const logout = useCallback(() => {
    setGuardada(null);
    try { localStorage.removeItem(CLAVE_SESION); } catch { /* sin almacenamiento */ }
  }, []);

  const valor = useMemo(() => ({ sesion, login, logout }), [sesion, login, logout]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
