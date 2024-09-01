export const truncateText = (text, size) => {
  if (!text) return '';
  return text.length > size ? `${text.substring(0, size)}...` : text;
};
