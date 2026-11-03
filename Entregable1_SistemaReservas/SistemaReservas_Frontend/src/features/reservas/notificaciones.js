import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { formatearFecha, formatearHora } from '@/lib/fechas';

const CANAL_ID = 'recordatorios';
const ANTICIPACION_MS = 24 * 60 * 60 * 1000;

// La documentación de expo-notifications solo lista Android e iOS.
const soportado = Platform.OS !== 'web';

function idRecordatorio(reservaId) {
  return `reserva-${reservaId}`;
}

export async function configurarNotificaciones() {
  if (!soportado) return;

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // En Android 13+ el permiso solo se puede pedir si ya existe un canal.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL_ID, {
        name: 'Recordatorios de reservas',
        importance: AndroidImportance.HIGH,
      });
    }

    const permisos = await Notifications.getPermissionsAsync();
    if (!permisos.granted && permisos.canAskAgain) {
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    // Las notificaciones son opcionales: la app funciona sin ellas.
  }
}

// Programa un aviso 24 horas antes de la reserva. Devuelve el identificador,
// o null si no se programó (menos de 24 horas, sin permiso o error).
export async function programarRecordatorio(reserva) {
  if (!soportado) return null;

  const disparo = new Date(reserva.fechaHora).getTime() - ANTICIPACION_MS;
  if (Number.isNaN(disparo) || disparo <= Date.now()) return null;

  try {
    const permisos = await Notifications.getPermissionsAsync();
    if (!permisos.granted) return null;

    const nombreServicio = reserva.servicio?.nombre ?? 'tu servicio';

    return await Notifications.scheduleNotificationAsync({
      identifier: idRecordatorio(reserva.id),
      content: {
        title: 'Recordatorio de reserva',
        body: `Tienes una reserva de ${nombreServicio} dentro de 24 horas (${formatearFecha(reserva.fechaHora)} a las ${formatearHora(reserva.fechaHora)}).`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: disparo,
        channelId: CANAL_ID,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelarRecordatorio(reservaId) {
  if (!soportado) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(
      idRecordatorio(reservaId),
    );
  } catch {
    // Si no existía o falla, la cancelación de la reserva sigue válida.
  }
}

// TEMPORAL: sirve para comprobar que el teléfono muestra notificaciones.
// Devuelve un texto con el estado del permiso para mostrarlo en pantalla.
export async function enviarNotificacionPrueba() {
  if (!soportado) return 'No disponible en web.';

  try {
    let permisos = await Notifications.getPermissionsAsync();
    if (!permisos.granted && permisos.canAskAgain) {
      permisos = await Notifications.requestPermissionsAsync();
    }

    if (!permisos.granted) {
      return `Permiso denegado (canAskAgain: ${permisos.canAskAgain}). Actívalo en los ajustes del teléfono.`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prueba de notificación',
        body: 'Si ves esto, las notificaciones funcionan.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: CANAL_ID,
      },
    });

    return 'Permiso concedido. La notificación llegará en 5 segundos.';
  } catch (caught) {
    return `Error: ${caught.message}`;
  }
}
