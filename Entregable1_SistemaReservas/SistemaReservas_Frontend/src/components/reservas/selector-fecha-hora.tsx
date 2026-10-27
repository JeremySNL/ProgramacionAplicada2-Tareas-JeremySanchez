import NativeDateTimePicker from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatearFecha } from '@/lib/fechas';

type SelectorFechaHoraProps = {
  fecha: string;
  hora: string | null;
  onFechaChange: (fecha: string) => void;
  onHoraChange: (hora: string) => void;
};

type PickerActivo = 'fecha' | 'hora' | null;

function desdeFechaLocal(fecha: string, hora = '12:00'): Date {
  return new Date(`${fecha}T${hora}:00`);
}

function fechaLocal(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function horaLocal(date: Date): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function hoyLocal(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export default function SelectorFechaHora({
  fecha,
  hora,
  onFechaChange,
  onHoraChange,
}: SelectorFechaHoraProps) {
  const theme = useTheme();
  const [pickerActivo, setPickerActivo] = useState<PickerActivo>(null);

  const value =
    pickerActivo === 'hora'
      ? desdeFechaLocal(fecha, hora ?? '09:00')
      : desdeFechaLocal(fecha);

  function onValueChange(_event: unknown, selectedDate?: Date) {
    setPickerActivo(null);
    if (!selectedDate) return;

    if (pickerActivo === 'fecha') {
      onFechaChange(fechaLocal(selectedDate));
    } else if (pickerActivo === 'hora') {
      onHoraChange(horaLocal(selectedDate));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="smallBold">Fecha</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Elegir fecha, seleccionada ${formatearFecha(fecha)}`}
          onPress={() => setPickerActivo('fecha')}
          style={[
            styles.field,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundElement,
            },
          ]}>
          <ThemedText type="smallBold">{formatearFecha(fecha)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Tocar para cambiar
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold">Hora</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            hora ? `Elegir hora, seleccionada ${hora}` : 'Elegir hora'
          }
          onPress={() => setPickerActivo('hora')}
          style={[
            styles.field,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundElement,
            },
          ]}>
          <ThemedText type="smallBold">{hora ?? 'Seleccionar hora'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Formato de 24 horas
          </ThemedText>
        </Pressable>
      </View>

      {pickerActivo ? (
        <NativeDateTimePicker
          value={value}
          mode={pickerActivo === 'fecha' ? 'date' : 'time'}
          minimumDate={pickerActivo === 'fecha' ? hoyLocal() : undefined}
          is24Hour
          presentation="dialog"
          display={Platform.OS === 'ios' ? 'compact' : undefined}
          onValueChange={onValueChange}
          onDismiss={() => setPickerActivo(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  field: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
    gap: Spacing.half,
  },
});
