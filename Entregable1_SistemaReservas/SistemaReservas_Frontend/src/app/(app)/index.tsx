import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { ApiError } from '@/api/client';
import { listarServicios } from '@/api/servicios';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner, LoadingView } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Servicio } from '@/types/api';

type ModoCarga = 'inicial' | 'refresh' | 'silencioso';

export default function ServiciosScreen() {
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const [servicios, setServicios] = useState<Servicio[]>([]);
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
        const data = await listarServicios(session.token);
        setServicios(data);
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === 401) return;

        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No se pudieron cargar los servicios.',
        );
      } finally {
        if (modo === 'inicial') setLoading(false);
        if (modo === 'refresh') setRefreshing(false);
      }
    },
    [session],
  );

  useFocusEffect(
    useCallback(() => {
      const modo: ModoCarga = primeraCarga.current ? 'inicial' : 'silencioso';
      primeraCarga.current = false;
      void cargar(modo);
    }, [cargar]),
  );

  if (!session) return null;

  if (loading) {
    return <LoadingView message="Cargando servicios..." />;
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={servicios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void cargar('refresh');
            }}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.sessionRow}>
              <View style={styles.sessionInfo}>
                <ThemedText type="small" themeColor="textSecondary">
                  Sesión iniciada como
                </ThemedText>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {session.user.email}
                </ThemedText>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isAdmin
                      ? theme.primary
                      : theme.backgroundSelected,
                  },
                ]}>
                <ThemedText
                  type="small"
                  style={{
                    color: isAdmin ? theme.primaryText : theme.text,
                    fontWeight: '700',
                  }}>
                  {session.user.rol}
                </ThemedText>
              </View>
            </View>

            <Button
              title={isAdmin ? 'Ver reservas' : 'Mis reservas'}
              variant="secondary"
              onPress={() => router.push('/reservas')}
            />

            {isAdmin ? (
              <Button
                title="Nuevo servicio"
                onPress={() => router.push('/crear-servicio')}
              />
            ) : null}

            <ErrorBanner message={error} />

            {error ? (
              <Button
                title="Reintentar"
                variant="secondary"
                onPress={() => {
                  void cargar('refresh');
                }}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.empty}>
            <ThemedText type="smallBold">
              No hay servicios disponibles
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {isAdmin
                ? 'Crea el primer servicio con el botón de arriba.'
                : 'Un administrador todavía no ha creado servicios.'}
            </ThemedText>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/servicios/[id]',
                params: { id: String(item.id) },
              })
            }>
            <Card>
              <View style={styles.itemRow}>
                <ThemedText
                  type="smallBold"
                  numberOfLines={1}
                  style={styles.itemName}>
                  {item.nombre}
                </ThemedText>
                <ThemedText type="smallBold" themeColor="primary">
                  ${Number(item.precio).toFixed(2)}
                </ThemedText>
              </View>

              <ThemedText type="small" themeColor="textSecondary">
                {item.descripcion}
              </ThemedText>

              <View style={styles.durationRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Duración:
                </ThemedText>
                <ThemedText type="small">{item.duracion} min</ThemedText>
              </View>
            </Card>
          </Pressable>
        )}
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
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.five,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.half,
    marginTop: Spacing.half,
  },
});
