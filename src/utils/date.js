import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import 'dayjs/locale/es.js';

// Configuración de dayjs: se establece el idioma en español y se extienden sus funcionalidades
// para soportar formatos personalizados, tiempo relativo, y comparaciones de fechas.
dayjs.locale('es');
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Función que deshabilita fechas pasadas
// Retorna 'true' si la fecha actual es menor que el inicio del día presente.
export const disabledDate = (current) => {
  return current && current < dayjs().startOf('day');
};

// Función que formatea una fecha en un formato legible para humanos
// Si la fecha es hoy, indica "Vence hoy", si ya pasó, muestra cuándo venció
// Si la fecha es en el futuro, muestra el tiempo que falta hasta que venza.
export const formatHumanDate = (date) => {
  if (!date) return ''; // Si no hay fecha, retorna vacío

  const now = dayjs();
  const humanDate = dayjs(date);

  if (humanDate.isSame(now, 'day')) {
    return 'Vence hoy';
  }

  if (humanDate.isBefore(now, 'day')) {
    return `Venció ${humanDate.fromNow()}`;
  }

  return `Vence ${humanDate.fromNow()}`;
};

// Función que verifica si una fecha está dentro de un rango de fechas específico (inclusive)
// Retorna 'true' si la fecha está entre las fechas de inicio y fin.
export const isWithinRange = (date, start, end) => {
  const checkDate = dayjs(date);
  return (
    checkDate.isSameOrAfter(start, 'day') &&
    checkDate.isSameOrBefore(end, 'day')
  );
};
