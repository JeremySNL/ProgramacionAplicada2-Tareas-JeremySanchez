import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { crearServicio } from '@/api/servicios';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';

export default function CrearServicioScreen() {
  const { session } = useSession();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!session) return;

    if (!nombre.trim() || !descripcion.trim()) {
      setError('El nombre y la descripción son obligatorios.');
      return;
    }

    const duracionNum = Number(duracion.trim());
    if (!Number.isInteger(duracionNum) || duracionNum <= 0) {
      setError('La duración debe ser un número entero mayor que 0.');
      return;
    }

    const precioNum = Number(precio.trim());
    if (!Number.isFinite(precioNum) || precioNum < 0 || precio.trim() === '') {
      setError('El precio debe ser un número igual o mayor que 0.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await crearServicio(session.token, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        duracion: duracionNum,
        precio: precioNum,
      });

      router.back();
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) return;

      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo crear el servicio.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="small" themeColor="textSecondary">
                Este formulario solo está disponible para administradores.
              </ThemedText>
            </View>

            <Card style={styles.form}>
              <ErrorBanner message={error} />

              <TextField
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Corte de cabello"
                autoCapitalize="sentences"
                editable={!loading}
                returnKeyType="next"
              />

              <TextField
                label="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Describe el servicio"
                multiline
                numberOfLines={3}
                style={styles.textArea}
                editable={!loading}
              />

              <TextField
                label="Duración (minutos)"
                value={duracion}
                onChangeText={setDuracion}
                placeholder="Ej. 30"
                keyboardType="number-pad"
                editable={!loading}
                returnKeyType="next"
              />

              <TextField
                label="Precio"
                value={precio}
                onChangeText={setPrecio}
                placeholder="Ej. 1500.00"
                keyboardType="decimal-pad"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <Button
                title="Guardar servicio"
                onPress={onSubmit}
                loading={loading}
                style={styles.submit}
              />
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  form: {
    gap: Spacing.three,
  },
  textArea: {
    minHeight: 96,
    paddingTop: Spacing.two,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: Spacing.one,
  },
});
