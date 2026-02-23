import { DayCode } from '../types';

export const DAY_NAMES: Record<DayCode, string> = {
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  R: 'Thursday',
  F: 'Friday',
  S: 'Saturday',
  U: 'Sunday',
};

export const DAY_CODES: DayCode[] = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];

export const WEEKDAY_MAP: Record<number, DayCode> = {
  0: 'U', // Sunday
  1: 'M',
  2: 'T',
  3: 'W',
  4: 'R',
  5: 'F',
  6: 'S',
};

export function getCurrentDayCode(): DayCode {
  return WEEKDAY_MAP[new Date().getDay()];
}

export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function minutesToTimeString(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 < 12 ? 'AM' : 'PM';
  return `${hours12}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function minutesToShortTime(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 < 12 ? 'a' : 'p';
  if (mins === 0) {
    return `${hours12}${ampm}`;
  }
  return `${hours12}:${mins.toString().padStart(2, '0')}${ampm}`;
}

export function formatMinutesRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function getTimeSlots(): number[] {
  // Generate time slots from 7 AM (420) to 10 PM (1320) in 30-min increments
  const slots: number[] = [];
  for (let m = 420; m <= 1320; m += 30) {
    slots.push(m);
  }
  return slots;
}
