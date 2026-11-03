import { createContext, useContext, useEffect, useState } from 'react';

import { login, registrar } from '@/auth/api';
import { setUnauthorizedHandler } from '@/services/api';
import { decodificarToken, tokenVigente } from './jwt';
import { borrarToken, guardarToken, leerToken } from './storage';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await leerToken();
        if (!token) return;

        const user = decodificarToken(token);

        if (!tokenVigente(user)) {
          await borrarToken();
          return;
        }

        if (active) setSession({ token, user });
      } catch {
        await borrarToken();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void borrarToken();
      setSession(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!session) return;

    const restante = session.user.exp * 1000 - Date.now();

    const timeout = setTimeout(
      () => {
        void borrarToken();
        setSession(null);
      },
      Math.max(restante, 0),
    );

    return () => clearTimeout(timeout);
  }, [session]);

  async function signIn(email, password) {
    const { token } = await login(email, password);
    const user = decodificarToken(token);

    if (!tokenVigente(user)) {
      throw new Error('El token recibido ya está vencido');
    }

    await guardarToken(token);
    setSession({ token, user });
  }

  async function signUp(data) {
    await registrar(data);
    await signIn(data.email, data.password);
  }

  async function signOut() {
    await borrarToken();
    setSession(null);
  }

  return (
    <SessionContext.Provider
      value={{ session, isLoading, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>');
  }

  return value;
}
