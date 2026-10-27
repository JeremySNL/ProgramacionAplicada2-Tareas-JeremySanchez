import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { crearReserva } from '@/api/reservas';
import { useSession } from '@/auth/session';
import SelectorFechaHora from '@/components/reservas/selector-fecha-hora';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import {
  esFechaPasada,
  esHorarioPasadoHoy,
  hoyISO,
} from '@/lib/fechas';

export default function NuevaReservaScreen() {
  const { servicioId, nombre } = useLocalSearchParams<{
    servicioId: string;
    nombre?: string;
  }>();
  const router = useRouter();
  const { session } = useSession();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyISO());
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idServicio = Number(servicioId);
  const nombreServicio = nombre ?? 'Servicio';

  function validar(): boolean {
    if (Number.isNaN(idServicio) || idServicio <= 0) {
      setError('El servicio no es válido.');
      return false;
    }

    if (esFechaPasada(fechaSeleccionada)) {
      setError('No se puede reservar una fecha pasada.');
      return false;
    }

    if (!horaSeleccionada) {
      setError('Seleccioná un horario.');
      return false;
    }

    if (esHorarioPasadoHoy(fechaSeleccionada, horaSeleccionada)) {
      setError('Ese horario ya pasó.');
      return false;
    }

    return true;
  }

  async function onSubmit() {
    if (!session) return;

    setError(null);
    if (!validar()) return;

    setLoading(true);

    try {
      await crearReserva(session.token, {
        servicioId: idServicio,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada!,
      });

      router.replace('/reservas');
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) return;

      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo crear la reserva.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (!session) return null;

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Card style={styles.info}>
            <ThemedText type="small" themeColor="textSecondary">
              Reservando
            </ThemedText>
            <ThemedText type="smallBold" style={styles.nombre}>
              {nombreServicio}
            </ThemedText>
          </Card>

          <ErrorBanner message={error} />

          <SelectorFechaHora
            fecha={fechaSeleccionada}
            hora={horaSeleccionada}
            onFechaChange={setFechaSeleccionada}
            onHoraChange={setHoraSeleccionada}
          />

          <Button
            title="Confirmar reserva"
            onPress={() => void onSubmit()}
            loading={loading}
            style={styles.boton}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  info: {
    gap: Spacing.one,
  },
  nombre: {
    fontSize: 18,
  },
  boton: {
    marginTop: Spacing.two,
  },
});
