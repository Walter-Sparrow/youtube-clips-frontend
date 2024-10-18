interface Hms {
  hours: number;
  minutes: number;
  seconds: number;
}

export function secondsToHms(s: number): Hms {
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: Math.floor(s % 60),
  };
}

export function hmsStringToSeconds(hms: string) {
  const [hours, minutes, seconds] = hms.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function hmsToSeconds(hms: Hms) {
  return hms.hours * 3600 + hms.minutes * 60 + hms.seconds;
}

export function hmsToStr(hms: Hms) {
  return `${hms.hours.toString().padStart(2, "0")}:${hms.minutes.toString().padStart(2, "0")}:${hms.seconds.toString().padStart(2, "0")}`;
}
