import { createContext, useContext, useMemo, useState } from 'react';
import { usuarios } from '../data/mockData.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    try {
      const guardada = localStorage.getItem('sgcm_sesion');
      return guardada ? JSON.parse(guardada) : null;
    } catch {
      return null;
    }
  });

  const login = (correo, password) => {
    const usuario = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.password === password
    );
    if (!usuario) {
      return { ok: false, error: 'Credenciales inválidas: verifica tu correo y contraseña.' };
    }
    const { password: _omitida, ...datos } = usuario;
    setSesion(datos);
    localStorage.setItem('sgcm_sesion', JSON.stringify(datos));
    return { ok: true, rol: datos.rol };
  };

  const logout = () => {
    setSesion(null);
    localStorage.removeItem('sgcm_sesion');
  };

  const valor = useMemo(() => ({ sesion, login, logout }), [sesion]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}