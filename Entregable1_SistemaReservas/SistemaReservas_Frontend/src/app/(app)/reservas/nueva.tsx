import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { crearReserva } from '@/api/reservas';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  esFechaPasada,
  esHorarioPasadoHoy,
  generarDias,
  generarHorarios,
  hoyISO,
} from '@/lib/fechas';

export default function NuevaReservaScreen() {
  const { servicioId, nombre } = useLocalSearchParams<{
    servicioId: string;
    nombre?: string;
  }>();
  const router = useRouter();
  const { session } = useSession();
  const theme = useTheme();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyISO());
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idServicio = Number(servicioId);
  const nombreServicio = nombre ?? 'Servicio';

  const dias = generarDias(14);
  const horarios = generarHorarios(8, 18, 30);

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

          <View style={styles.seccion}>
            <ThemedText type="smallBold">Fecha</ThemedText>
            <FlatList
              horizontal
              data={dias}
              keyExtractor={(item) => item.value}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipList}
              renderItem={({ item }) => {
                const seleccionado = item.value === fechaSeleccionada;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: seleccionado }}
                    onPress={() => {
                      setFechaSeleccionada(item.value);
                      setHoraSeleccionada(null);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: seleccionado
                          ? theme.primary
                          : theme.backgroundElement,
                        borderColor: seleccionado
                          ? theme.primary
                          : theme.border,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: seleccionado ? theme.primaryText : theme.text,
                      }}>
                      {item.label}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={{
                        color: seleccionado
                          ? theme.primaryText
                          : theme.textSecondary,
                      }}>
                      {item.díaSemana}
                    </ThemedText>
                  </Pressable>
                );
              }}
            />
          </View>

          <View style={styles.seccion}>
            <ThemedText type="smallBold">Horario</ThemedText>
            <View style={styles.horariosGrid}>
              {horarios.map((hora) => {
                const deshabilitado = esHorarioPasadoHoy(
                  fechaSeleccionada,
                  hora,
                );
                const seleccionado = hora === horaSeleccionada;

                return (
                  <Pressable
                    key={hora}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: seleccionado,
                      disabled: deshabilitado,
                    }}
                    disabled={deshabilitado}
                    onPress={() => setHoraSeleccionada(hora)}
                    style={[
                      styles.horaChip,
                      {
                        backgroundColor: seleccionado
                          ? theme.primary
                          : deshabilitado
                            ? theme.backgroundSelected
                            : theme.backgroundElement,
                        borderColor: seleccionado
                          ? theme.primary
                          : theme.border,
                        opacity: deshabilitado ? 0.5 : 1,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: seleccionado
                          ? theme.primaryText
                          : deshabilitado
                            ? theme.textSecondary
                            : theme.text,
                      }}>
                      {hora}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

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
  seccion: {
    gap: Spacing.two,
  },
  chipList: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  chip: {
    minWidth: 72,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.half,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  horaChip: {
    width: '22%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  boton: {
    marginTop: Spacing.two,
  },
});
