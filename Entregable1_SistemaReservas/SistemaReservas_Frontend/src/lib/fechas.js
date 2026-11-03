const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Zona horaria del negocio (la misma que usa el backend): UTC-4, sin horario
// de verano. Todo se muestra y se envía en esta zona, sin depender de la del
// dispositivo.
export const OFFSET_NEGOCIO = '-04:00';
const OFFSET_NEGOCIO_MS = -4 * 60 * 60 * 1000;

function pad(n) {
  return n.toString().padStart(2, '0');
}

// Date cuyos getters UTC devuelven la fecha y hora del negocio.
function enZonaNegocio(instante) {
  return new Date(new Date(instante).getTime() + OFFSET_NEGOCIO_MS);
}

export function hoyISO() {
  const ahora = enZonaNegocio(Date.now());
  return `${ahora.getUTCFullYear()}-${pad(ahora.getUTCMonth() + 1)}-${pad(ahora.getUTCDate())}`;
}

export function horaActualLocal() {
  const ahora = enZonaNegocio(Date.now());
  return `${pad(ahora.getUTCHours())}:${pad(ahora.getUTCMinutes())}`;
}

// Acepta 'YYYY-MM-DD' (fecha elegida en el selector, ya en zona del negocio) o
// un instante ISO con hora (viene del backend) que se convierte a esa zona.
export function formatearFecha(isoString) {
  if (isoString.length === 10) {
    const [año, mes, día] = isoString.split('-');
    return `${día}/${mes}/${año}`;
  }

  const fecha = enZonaNegocio(isoString);
  return `${pad(fecha.getUTCDate())}/${pad(fecha.getUTCMonth() + 1)}/${fecha.getUTCFullYear()}`;
}

export function formatearHora(isoString) {
  const fecha = enZonaNegocio(isoString);
  return `${pad(fecha.getUTCHours())}:${pad(fecha.getUTCMinutes())}`;
}

export function esFechaPasada(fechaISO) {
  return fechaISO < hoyISO();
}

export function esHorarioPasadoHoy(fechaISO, hora) {
  if (fechaISO !== hoyISO()) return false;
  return hora <= horaActualLocal();
}

export function generarDias(cantidad) {
  const hoy = new Date();
  const días = [];

  for (let i = 0; i < cantidad; i += 1) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);

    const value = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
    const díaSemana = nombresDias[fecha.getDay()];

    let label;
    if (i === 0) {
      label = 'Hoy';
    } else if (i === 1) {
      label = 'Mañana';
    } else {
      label = `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}`;
    }

    días.push({ value, label, díaSemana });
  }

  return días;
}

export function generarHorarios(inicio = 8, fin = 18, intervalo = 30) {
  const horarios = [];

  for (let h = inicio; h <= fin; h += 1) {
    for (let m = 0; m < 60; m += intervalo) {
      if (h === fin && m > 0) break;
      horarios.push(`${pad(h)}:${pad(m)}`);
    }
  }

  return horarios;
}
