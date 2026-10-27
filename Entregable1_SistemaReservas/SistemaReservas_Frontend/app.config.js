module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL ??
      'https://programacionaplicada2-tareas-jeremysanchez-production.up.railway.app',
  },
});
