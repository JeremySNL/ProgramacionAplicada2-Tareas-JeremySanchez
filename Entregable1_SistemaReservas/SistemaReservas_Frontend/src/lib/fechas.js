const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function hoyISO(): string {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}`;
}

export function horaActualLocal(): string {
  const ahora = new Date();
  return `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
}

export function formatearFecha(isoString: string): string {
  const [año, mes, día] = isoString.slice(0, 10).split('-');
  return `${día}/${mes}/${año}`;
}

export function formatearHora(isoString: string): string {
  return isoString.slice(11, 16);
}

export function esFechaPasada(fechaISO: string): boolean {
  return fechaISO < hoyISO();
}

export function esHorarioPasadoHoy(
  fechaISO: string,
  hora: string,
): boolean {
  if (fechaISO !== hoyISO()) return false;
  return hora <= horaActualLocal();
}

export function generarDias(cantidad: number) {
  const hoy = new Date();
  const días: { value: string; label: string; díaSemana: string }[] = [];

  for (let i = 0; i < cantidad; i += 1) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);

    const value = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
    const díaSemana = nombresDias[fecha.getDay()];

    let label: string;
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

export function generarHorarios(
  inicio = 8,
  fin = 18,
  intervalo = 30,
): string[] {
  const horarios: string[] = [];

  for (let h = inicio; h <= fin; h += 1) {
    for (let m = 0; m < 60; m += intervalo) {
      if (h === fin && m > 0) break;
      horarios.push(`${pad(h)}:${pad(m)}`);
    }
  }

  return horarios;
}
