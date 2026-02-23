import {
  BuildingsData,
  BuildingAvailability,
  RoomAvailability,
  RoomSchedule,
  CourseSession,
  RoomStatus,
  DayCode,
} from '../types';
import { getCurrentDayCode, getCurrentMinutes } from './timeUtils';

const SOON_THRESHOLD = 30; // minutes

export function getRoomStatus(
  schedule: RoomSchedule,
  day: DayCode,
  currentMinutes: number
): { status: RoomStatus; currentCourse?: CourseSession; nextCourse?: CourseSession; minutesUntilChange?: number } {
  const daySchedule = schedule[day] || [];

  // No classes scheduled for today = available all day
  if (daySchedule.length === 0) {
    return { status: 'available' };
  }

  // Find current course
  let currentCourse: CourseSession | undefined;
  let nextCourse: CourseSession | undefined;

  for (const course of daySchedule) {
    if (course.start <= currentMinutes && currentMinutes < course.end) {
      currentCourse = course;
    } else if (course.start > currentMinutes && !nextCourse) {
      nextCourse = course;
    }
  }

  if (currentCourse) {
    return {
      status: 'occupied',
      currentCourse,
      nextCourse,
      minutesUntilChange: currentCourse.end - currentMinutes,
    };
  }

  if (nextCourse) {
    const minutesUntilNext = nextCourse.start - currentMinutes;
    if (minutesUntilNext <= SOON_THRESHOLD) {
      return {
        status: 'soon-available',
        nextCourse,
        minutesUntilChange: minutesUntilNext,
      };
    }
    return {
      status: 'available',
      nextCourse,
      minutesUntilChange: minutesUntilNext,
    };
  }

  return { status: 'available' };
}

export function getBuildingAvailability(
  buildingName: string,
  rooms: { [roomNumber: string]: RoomSchedule },
  day?: DayCode,
  minutes?: number
): BuildingAvailability {
  const currentDay = day ?? getCurrentDayCode();
  const currentMinutes = minutes ?? getCurrentMinutes();

  const roomAvailabilities: RoomAvailability[] = Object.entries(rooms).map(
    ([roomNumber, schedule]) => {
      const { status, currentCourse, nextCourse, minutesUntilChange } = getRoomStatus(
        schedule,
        currentDay,
        currentMinutes
      );
      return {
        roomNumber,
        status,
        currentCourse,
        nextCourse,
        minutesUntilChange,
      };
    }
  );

  // Sort rooms by number (handle alphanumeric)
  roomAvailabilities.sort((a, b) => {
    const numA = parseInt(a.roomNumber) || 0;
    const numB = parseInt(b.roomNumber) || 0;
    if (numA !== numB) return numA - numB;
    return a.roomNumber.localeCompare(b.roomNumber);
  });

  const availableCount = roomAvailabilities.filter(
    (r) => r.status === 'available' || r.status === 'soon-available'
  ).length;

  return {
    name: buildingName,
    totalRooms: roomAvailabilities.length,
    availableRooms: availableCount,
    rooms: roomAvailabilities,
  };
}

export function getAllBuildingsAvailability(
  buildings: BuildingsData,
  day?: DayCode,
  minutes?: number
): BuildingAvailability[] {
  return Object.entries(buildings)
    .map(([name, rooms]) => getBuildingAvailability(name, rooms, day, minutes))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getStatusColor(status: RoomStatus): string {
  switch (status) {
    case 'available':
      return '#22C55E'; // green-500
    case 'occupied':
      return '#EF4444'; // red-500
    case 'soon-available':
      return '#FACC15'; // yellow-400
    case 'no-data':
    default:
      return '#9CA3AF'; // gray-400
  }
}

export function getStatusBgClass(status: RoomStatus): string {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'occupied':
      return 'bg-red-500';
    case 'soon-available':
      return 'bg-yellow-400';
    case 'no-data':
    default:
      return 'bg-gray-400';
  }
}

export function getStatusTextClass(status: RoomStatus): string {
  switch (status) {
    case 'available':
      return 'text-green-600';
    case 'occupied':
      return 'text-red-600';
    case 'soon-available':
      return 'text-yellow-600';
    case 'no-data':
    default:
      return 'text-gray-500';
  }
}

export function getAvailabilityRatio(available: number, total: number): number {
  if (total === 0) return 0;
  return available / total;
}

export function getAvailabilityColorIntensity(ratio: number): string {
  // Returns a color from red (0%) to green (100%)
  if (ratio >= 0.7) return '#22C55E'; // green
  if (ratio >= 0.5) return '#84CC16'; // lime
  if (ratio >= 0.3) return '#FACC15'; // yellow
  if (ratio >= 0.1) return '#F97316'; // orange
  return '#EF4444'; // red
}
