import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import {
  cambiarEstadoReserva,
  cancelarReserva,
  listarMisReservas,
  listarReservas,
} from '@/api/reservas';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner, LoadingView } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatearFecha, formatearHora } from '@/lib/fechas';
import type { EstadoReserva, Reserva } from '@/types/api';

type ModoCarga = 'inicial' | 'refresh' | 'silencioso';

const coloresEstado: Record<EstadoReserva, { bg: string; text: string }> = {
  PENDIENTE: { bg: '#F59E0B', text: '#FFFFFF' },
  COMPLETADA: { bg: '#16A34A', text: '#FFFFFF' },
  CANCELADA: { bg: '#6B7280', text: '#FFFFFF' },
};

const etiquetasEstado: Record<EstadoReserva, string> = {
  PENDIENTE: 'Pendiente',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function ReservasScreen() {
  const { session } = useSession();
  const theme = useTheme();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primeraCarga = useRef(true);

  const isAdmin = session?.user.rol === 'ADMIN';

  const cargar = useCallback(
    async (modo: ModoCarga) => {
      if (!session) return;

      if (modo === 'inicial') setLoading(true);
      if (modo === 'refresh') setRefreshing(true);

      try {
        setError(null);
        const data = isAdmin
          ? await listarReservas(session.token)
          : await listarMisReservas(session.token);
        setReservas(data);
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === 401) return;

        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No se pudieron cargar las reservas.',
        );
      } finally {
        if (modo === 'inicial') setLoading(false);
        if (modo === 'refresh') setRefreshing(false);
      }
    },
    [session, isAdmin],
  );

  useFocusEffect(
    useCallback(() => {
      const modo: ModoCarga = primeraCarga.current ? 'inicial' : 'silencioso';
      primeraCarga.current = false;
      void cargar(modo);
    }, [cargar]),
  );

  async function cambiarEstado(id: number, estado: EstadoReserva) {
    if (!session) return;

    try {
      await cambiarEstadoReserva(session.token, id, estado);
      await cargar('silencioso');
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo actualizar la reserva.',
      );
    }
  }

  function confirmarCancelar(id: number) {
    Alert.alert('Cancelar reserva', '¿Seguro que querés cancelar este turno?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => void ejecutarCancelar(id),
      },
    ]);
  }

  async function ejecutarCancelar(id: number) {
    if (!session) return;

    try {
      await cancelarReserva(session.token, id);
      await cargar('silencioso');
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo cancelar la reserva.',
      );
    }
  }

  if (!session) return null;

  if (loading) {
    return <LoadingView message="Cargando reservas..." />;
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void cargar('refresh')}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <ErrorBanner message={error} />

            {error ? (
              <Button
                title="Reintentar"
                variant="secondary"
                onPress={() => void cargar('refresh')}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.empty}>
            <ThemedText type="smallBold">
              {isAdmin ? 'No hay reservas registradas' : 'No tenés reservas'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {isAdmin
                ? 'Los clientes aún no solicitaron turnos.'
                : 'Empezá reservando un servicio desde la pestaña de Servicios.'}
            </ThemedText>
          </Card>
        }
        renderItem={({ item }) => {
          const puedeCancelar =
            (session.user.rol === 'CLIENTE' || isAdmin) &&
            item.estado === 'PENDIENTE';
          const puedeCompletar = isAdmin && item.estado === 'PENDIENTE';
          const colorEstado = coloresEstado[item.estado];

          return (
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <ThemedText
                  type="smallBold"
                  numberOfLines={1}
                  style={styles.servicioNombre}>
                  {item.servicio.nombre}
                </ThemedText>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colorEstado.bg },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{ color: colorEstado.text, fontWeight: '700' }}>
                    {etiquetasEstado[item.estado]}
                  </ThemedText>
                </View>
              </View>

              {isAdmin && item.usuario ? (
                <ThemedText type="small" themeColor="textSecondary">
                  Cliente: {item.usuario.email}
                </ThemedText>
              ) : null}

              <View style={styles.filaDato}>
                <ThemedText type="small" themeColor="textSecondary">
                  Fecha:
                </ThemedText>
                <ThemedText type="smallBold">
                  {formatearFecha(item.fecha)}
                </ThemedText>
              </View>

              <View style={styles.filaDato}>
                <ThemedText type="small" themeColor="textSecondary">
                  Hora:
                </ThemedText>
                <ThemedText type="smallBold">
                  {formatearHora(item.hora)}
                </ThemedText>
              </View>

              {(puedeCompletar || puedeCancelar) ? (
                <View style={styles.acciones}>
                  {puedeCompletar ? (
                    <Button
                      title="Completar"
                      variant="secondary"
                      onPress={() => void cambiarEstado(item.id, 'COMPLETADA')}
                      style={styles.botonAccion}
                    />
                  ) : null}
                  {puedeCancelar ? (
                    <Button
                      title="Cancelar"
                      variant="danger"
                      onPress={() => confirmarCancelar(item.id)}
                      style={styles.botonAccion}
                    />
                  ) : null}
                </View>
              ) : null}
            </Card>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  separator: {
    height: Spacing.two,
  },
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.five,
  },
  card: {
    gap: Spacing.two,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  servicioNombre: {
    flex: 1,
    fontSize: 16,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  filaDato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  acciones: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  botonAccion: {
    flex: 1,
  },
});
