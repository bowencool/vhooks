import type { Duration } from '.';

export type CalculatedDuration = Record<string, number>;
// export type CalculatedDuration = Partial<Record<'D' | 'H' | 'm' | 's' | 'S', number>>;
export function calculateDuration(time: Duration, format = 'DD:HH:mm:ss'): CalculatedDuration {
  const ret: CalculatedDuration = {};
  const scannedTimes = Object.values(time);
  const scannedFormats: (keyof CalculatedDuration)[] = ['D', 'H', 'm', 's'];
  const padValues = [24, 60, 60, 1000];

  scannedFormats.forEach((scannedFormat, index) => {
    if (!format.includes(scannedFormat)) {
      scannedTimes[index + 1] += scannedTimes[index] * padValues[index];
    } else {
      ret[scannedFormat] = scannedTimes[index];
    }
  });

  if (format.includes('S')) {
    const ms = scannedTimes[scannedTimes.length - 1];
    ret.S = ms;
  }
  return ret;
}

export function formatDuration(time: CalculatedDuration, format = 'DD:HH:mm:ss'): string {
  format = format.replace(/(D|H|m|s)+/g, (rez, key) => `${time[key]}`.padStart(rez.length, '0'));
  format = format.replace(/(S)+/g, (rez, key) => `${time[key]}`.padStart(3, '0').slice(0, rez.length));

  return format;
}
