// Esta función trunca un texto si supera un tamaño máximo especificado.
// Si el texto es más largo que el tamaño permitido, devuelve una versión truncada con '...' al final.
// Si el texto no excede el tamaño, se devuelve tal cual.
// Si el texto no está definido o es nulo, devuelve una cadena vacía.
export const truncateText = (text, size) => {
  if (!text) return '';
  return text.length > size ? `${text.substring(0, size)}...` : text;
};
