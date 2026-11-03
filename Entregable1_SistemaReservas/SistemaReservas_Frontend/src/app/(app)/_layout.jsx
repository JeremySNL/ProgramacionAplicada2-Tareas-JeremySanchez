import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useSession } from '@/auth/session';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function AppLayout() {
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isAdmin = session?.user.rol === 'ADMIN';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
      }}>
      <Stack.Screen
        name="servicios/index"
        options={{
          title: 'Servicios',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => router.push('/perfil')}>
              <ThemedText type="smallBold" themeColor="primary">
                Perfil
              </ThemedText>
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />

      <Stack.Screen
        name="servicios/[id]"
        options={{ title: 'Servicio' }}
      />

      <Stack.Screen
        name="reservas/index"
        options={{ title: 'Reservas' }}
      />

      <Stack.Protected guard={isAdmin}>
        <Stack.Screen
          name="crear-servicio"
          options={{ title: 'Nuevo servicio' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={session?.user.rol === 'CLIENTE'}>
        <Stack.Screen
          name="reservas/nueva"
          options={{ title: 'Nueva reserva' }}
        />
      </Stack.Protected>
    </Stack>
  );
}
