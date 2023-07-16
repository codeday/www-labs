export function cautionStringToColor(cautionString, highlightAllCaution) {
  return {
    danger: 'red',
    warning: highlightAllCaution ? 'orange' : 'yellow',
    caution: 'yellow',
    info: highlightAllCaution ? 'yellow' : 'green',
    ok: 'green',
  }[cautionString] || 'gray';
}