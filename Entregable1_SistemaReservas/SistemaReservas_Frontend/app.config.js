/**
 * URL de la API centralizada en la configuración de Expo.
 *
 * Se lee desde .env (EXPO_PUBLIC_API_URL) y se expone a la app en
 * `Constants.expoConfig.extra.apiUrl`. Ninguna pantalla debe tener la URL
 * escrita directamente.
 *
 * @param {{ config: import('expo/config').ExpoConfig }} context
 */
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL ??
      'https://programacionaplicada2-tareas-jeremysanchez-production.up.railway.app',
  },
});
