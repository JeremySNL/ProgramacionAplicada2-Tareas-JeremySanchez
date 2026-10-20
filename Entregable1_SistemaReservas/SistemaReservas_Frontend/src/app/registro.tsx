import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Card, ErrorBanner, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Rol } from '@/types/api';

const ROLES: { value: Rol; label: string }[] = [
  { value: 'CLIENTE', label: 'Cliente' },
  { value: 'ADMIN', label: 'Administrador' },
];

export default function RegistroScreen() {
  const { signUp } = useSession();
  const theme = useTheme();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Rol>('CLIENTE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Escribe un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signUp({
        nombre: nombre.trim(),
        email: email.trim(),
        password,
        rol,
      });
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Ocurrió un error inesperado al crear la cuenta.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="subtitle">Crear cuenta</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Elige el rol con el que deseas registrarte.
              </ThemedText>
            </View>

            <Card style={styles.form}>
              <ErrorBanner message={error} />

              <TextField
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                editable={!loading}
                returnKeyType="next"
              />

              <TextField
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!loading}
                returnKeyType="next"
              />

              <TextField
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />

              <View style={styles.field}>
                <ThemedText type="smallBold">Rol</ThemedText>
                <View style={styles.roleRow}>
                  {ROLES.map((option) => {
                    const selected = rol === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        disabled={loading}
                        onPress={() => setRol(option.value)}
                        style={[
                          styles.roleChip,
                          {
                            borderColor: selected
                              ? theme.primary
                              : theme.border,
                            backgroundColor: selected
                              ? theme.primary
                              : theme.backgroundElement,
                          },
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={{
                            color: selected ? theme.primaryText : theme.text,
                          }}>
                          {option.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  El rol de administrador permite crear servicios
                </ThemedText>
              </View>

              <Button
                title="Registrarme"
                onPress={onSubmit}
                loading={loading}
                style={styles.submit}
              />
            </Card>

            <View style={styles.footer}>
              <ThemedText type="small" themeColor="textSecondary">
                ¿Ya tienes cuenta?
              </ThemedText>
              <Link
                href="/login"
                style={[styles.link, { color: theme.primary }]}>
                Inicia sesión
              </Link>
            </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  roleChip: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  submit: {
    marginTop: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    flexWrap: 'wrap',
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
  },
});
