export type Duration = number

export function convertToDuration(input: string): Duration | null {

  if (!input.length) {
    return null;
  }

  let h, min: number;
  const val = String(input).replace(',', '.');

  const parts = val.replace(':', '.').replace('h', '.').split('.');
  h = parseFloat(parts[0].toString().trim()) * 3600;

  // 5 min = 0h
  if (parts[0].indexOf('m') !== -1) {
    // first part contains "m"
    h = 0;
    min = parseFloat(parts[0].trim()) * 60;
  } else if (parts[1] && isFinite(parseFloat(parts[0])) && isFinite(parseFloat(parts[1]))) {
    // is numbers 1,5 => 1h 30 min
    h = parseInt(parts[0]) * 3600;
    min = parseInt(parts[1]) * 360;
  } else {
    // not "m"
    min = (parts.length > 1 && parts[1].trim().length ? parseInt(parts[1].trim()) * 60 : 0);
  }

  return h + min || 0;
}

export function humanizeDuration(value: Duration, isDayLogged = false) {
  if (isDayLogged) {
    return (Math.round((value / 86400) * 100) / 100).toString() + 'd'
  }

  let output = '';

  const hours = Math.floor(value / 3600),
    minutes = Math.floor((value - (hours * 3600)) / 60)

  if (hours) {
    output += hours + 'h';
  }

  if (minutes) {
    output += ' ' + minutes + 'min';
  }

  return output;
}