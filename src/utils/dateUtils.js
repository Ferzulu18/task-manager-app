import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/es';

dayjs.locale('es');
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

export const disabledDate = (current) => {
  return current && current < dayjs().startOf('day');
};

export const formatHumanDate = (date) => {
  if (!date) return '';

  const now = dayjs();
  const humanDate = dayjs(date);

  // Verifica si la fecha es el mismo día que hoy
  if (humanDate.isSame(now, 'day')) {
    return 'Vence hoy'; // La fecha es hoy
  }

  // Si la fecha ya pasó, devuelve la fecha en formato relativo
  if (humanDate.isBefore(now, 'day')) {
    return `Venció ${humanDate.fromNow()}`;
  }

  // Si la fecha es en el futuro, devuelve el tiempo restante
  return `Vence ${humanDate.fromNow()}`;
};
