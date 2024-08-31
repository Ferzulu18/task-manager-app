import moment from 'moment';

// Función para formatear la fecha
export const formatDueDate = (date) => {
  if (!date) return '';
  return moment(date).format('D [de] MMMM [de] YYYY');
};
