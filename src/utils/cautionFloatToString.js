export function cautionFloatToString(caution, highlightAllCaution) {
  if (typeof caution === 'undefined' || caution === null) return null;
  if (caution >= 0.9) return 'danger';
  if (caution >= 0.5) return 'warning';
  if (caution >= 0.2) return 'caution';
  if (caution >= 0.1) return 'info';
  if (highlightAllCaution && caution > 0) return 'info';
  return 'ok';
}
