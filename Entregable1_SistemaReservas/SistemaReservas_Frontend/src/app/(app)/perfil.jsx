import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/services/api';
import { actualizarPerfil, obtenerPerfil } from '@/features/usuarios/api';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Button,
  Card,
  ErrorBanner,
  LoadingView,
  TextField,
} from '@/components/ui';
import { Spacing } from '@/constants/theme';

export default function PerfilScreen() {
  const { session, signOut } = useSession();

  const [perfil, setPerfil] = useState(null);
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const cargar = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    setError(null);

    try {
      const data = await obtenerPerfil(session.token);
      setPerfil(data);
      setNombre(data.nombre);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) return;

      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo cargar el perfil.',
      );
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  async function onGuardar() {
    if (!session) return;

    setMensaje(null);

    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const data = await actualizarPerfil(session.token, nombre.trim());
      setPerfil(data);
      setNombre(data.nombre);
      setMensaje('Nombre actualizado.');
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) return;

      setError(
        caught instanceof ApiError
          ? caught.message
          : 'No se pudo actualizar el nombre.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (!session) return null;

  if (loading) {
    return <LoadingView message="Cargando perfil..." />;
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
            <ErrorBanner message={error} />

            {perfil ? (
              <Card style={styles.card}>
                <ThemedText type="small" themeColor="textSecondary">
                  Nombre
                </ThemedText>
                <ThemedText type="smallBold">{perfil.nombre}</ThemedText>

                <ThemedText type="small" themeColor="textSecondary">
                  Correo electrónico
                </ThemedText>
                <ThemedText type="smallBold">{perfil.email}</ThemedText>
              </Card>
            ) : (
              <Button title="Reintentar" onPress={() => void cargar()} />
            )}

            {perfil ? (
              <Card style={styles.card}>
                <TextField
                  label="Editar nombre"
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Tu nombre"
                  autoCapitalize="words"
                  editable={!saving}
                  returnKeyType="done"
                  onSubmitEditing={() => void onGuardar()}
                />

                {mensaje ? (
                  <ThemedText type="small" themeColor="primary">
                    {mensaje}
                  </ThemedText>
                ) : null}

                <Button
                  title="Guardar"
                  onPress={() => void onGuardar()}
                  loading={saving}
                />
              </Card>
            ) : null}

            <Button
              title="Cerrar sesión"
              variant="danger"
              onPress={() => void signOut()}
            />
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
    gap: Spacing.four,
  },
  card: {
    gap: Spacing.two,
  },
});
