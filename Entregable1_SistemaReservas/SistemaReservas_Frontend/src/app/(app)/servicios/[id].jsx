import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { listarServicios } from '@/api/servicios';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner, LoadingView } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Servicio } from '@/types/api';

export default function ServicioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useSession();

  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const servicioId = Number(id);
  const isCliente = session?.user.rol === 'CLIENTE';

  const cargar = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listarServicios(session.token);
      const encontrado = data.find((item) => item.id === servicioId);

      if (!encontrado) {
        setError('No se encontró el servicio solicitado.');
      } else {
        setServicio(encontrado);
      }
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) return;

      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo cargar el servicio.',
      );
    } finally {
      setLoading(false);
    }
  }, [session, servicioId]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  function onReservar() {
    if (!servicio) return;

    router.push({
      pathname: '/reservas/nueva',
      params: {
        servicioId: String(servicio.id),
        nombre: servicio.nombre,
      },
    });
  }

  if (loading) {
    return <LoadingView message="Cargando servicio..." />;
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          <ErrorBanner message={error} />

          {error ? (
            <Button title="Reintentar" onPress={() => void cargar()} />
          ) : null}

          {servicio ? (
            <Card style={styles.card}>
              <ThemedText type="smallBold" style={styles.title}>
                {servicio.nombre}
              </ThemedText>

              <ThemedText type="small" themeColor="textSecondary">
                {servicio.descripcion}
              </ThemedText>

              <View style={styles.row}>
                <ThemedText type="small" themeColor="textSecondary">
                  Duración:
                </ThemedText>
                <ThemedText type="smallBold">
                  {servicio.duracion} min
                </ThemedText>
              </View>

              <View style={styles.row}>
                <ThemedText type="small" themeColor="textSecondary">
                  Precio:
                </ThemedText>
                <ThemedText type="smallBold" themeColor="primary">
                  ${Number(servicio.precio).toFixed(2)}
                </ThemedText>
              </View>

              {isCliente ? (
                <Button
                  title="Reservar"
                  onPress={onReservar}
                  style={styles.boton}
                />
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  Solo los clientes pueden realizar reservas.
                </ThemedText>
              )}
            </Card>
          ) : null}
        </View>
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
    gap: Spacing.three,
  },
  card: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  boton: {
    marginTop: Spacing.two,
  },
});
