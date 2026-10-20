import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import { login, registrar } from '@/api/auth';
import { setUnauthorizedHandler } from '@/api/client';
import type { Rol } from '@/types/api';
import { decodificarToken, tokenVigente, type TokenPayload } from './jwt';
import { borrarToken, guardarToken, leerToken } from './storage';

type Session = {
  token: string;
  user: TokenPayload;
};

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar la sesión guardada en AsyncStorage al abrir la app.
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
        // Token corrupto o mal formado: se descarta.
        await borrarToken();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Si cualquier petición autenticada devuelve 401, se cierra la sesión.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void borrarToken();
      setSession(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  // Cierra la sesión automáticamente al llegar la fecha de expiración del token.
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

  async function signIn(email: string, password: string) {
    const { token } = await login(email, password);
    const user = decodificarToken(token);

    if (!tokenVigente(user)) {
      throw new Error('El token recibido ya está vencido');
    }

    await guardarToken(token);
    setSession({ token, user });
  }

  async function signUp(data: {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
  }) {
    await registrar(data);
    // El registro no devuelve token, así que iniciamos sesión enseguida.
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
