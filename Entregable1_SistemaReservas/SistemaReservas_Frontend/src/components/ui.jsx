import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: {
      background: theme.primary,
      text: theme.primaryText,
      border: theme.primary,
    },
    secondary: {
      background: theme.backgroundElement,
      text: theme.text,
      border: theme.border,
    },
    danger: {
      background: theme.dangerSolid,
      text: '#FFFFFF',
      border: theme.dangerSolid,
    },
    ghost: {
      background: 'transparent',
      text: theme.primary,
      border: 'transparent',
    },
  };

  const colors = palette[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: isDisabled ? 0.55 : pressed ? 0.8 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <ThemedText type="smallBold" style={{ color: colors.text }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

export function TextField({ label, style, ...rest }) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.border,
            backgroundColor: theme.inputBackground,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

export function ErrorBanner({ message }) {
  const theme = useTheme();

  if (!message) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.errorBanner,
        {
          borderColor: theme.danger,
          backgroundColor: theme.danger + '14',
        },
      ]}>
      <ThemedText type="small" style={{ color: theme.danger }}>
        {message}
      </ThemedText>
    </View>
  );
}

export function LoadingView({ message }) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      {message ? (
        <ThemedText type="small" themeColor="textSecondary">
          {message}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

export function Card({ children, style }) {
  return (
    <ThemedView type="backgroundElement" style={[styles.card, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
