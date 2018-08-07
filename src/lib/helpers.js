export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function valueFormat(number, decimalPointsAmount) {
  return (+number).toFixed(decimalPointsAmount).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}