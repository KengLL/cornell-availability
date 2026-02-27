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

const MIN_BREAK = 30;    // gaps <= 30 min between sessions → merged into one occupied block
const SOON_THRESHOLD = 15; // within 15 min of next block → soon-available

interface OccupiedBlock {
  start: number;
  end: number;
}

// Merge consecutive sessions where the gap between them is <= MIN_BREAK into single blocks.
function buildBlocks(sorted: CourseSession[]): OccupiedBlock[] {
  const blocks: OccupiedBlock[] = [];
  for (const course of sorted) {
    const last = blocks[blocks.length - 1];
    if (!last || course.start - last.end > MIN_BREAK) {
      blocks.push({ start: course.start, end: course.end });
    } else {
      last.end = Math.max(last.end, course.end);
    }
  }
  return blocks;
}

export function getRoomStatus(
  schedule: RoomSchedule,
  day: DayCode,
  currentMinutes: number
): { status: RoomStatus; currentCourse?: CourseSession; nextCourse?: CourseSession; minutesUntilChange?: number; freeAt?: number } {
  const daySchedule = schedule[day] || [];

  if (daySchedule.length === 0) {
    return { status: 'available' };
  }

  const sorted = [...daySchedule].sort((a, b) => a.start - b.start);
  const blocks = buildBlocks(sorted);

  const currentBlock = blocks.find(b => b.start <= currentMinutes && currentMinutes < b.end);
  const nextBlock = blocks.find(b => b.start > currentMinutes);

  if (currentBlock) {
    // Specific session at currentMinutes, or next one inside the block (if in a merged break)
    const currentCourse =
      sorted.find(c => c.start <= currentMinutes && currentMinutes < c.end) ??
      sorted.find(c => c.start > currentMinutes && c.start < currentBlock.end);
    const nextCourse = nextBlock ? sorted.find(c => c.start >= nextBlock.start) : undefined;
    return {
      status: 'occupied',
      currentCourse,
      nextCourse,
      freeAt: currentBlock.end,
      minutesUntilChange: currentBlock.end - currentMinutes,
    };
  }

  if (nextBlock) {
    const minutesUntilNext = nextBlock.start - currentMinutes;
    const nextCourse = sorted.find(c => c.start >= nextBlock.start);

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
      const { status, currentCourse, nextCourse, minutesUntilChange, freeAt } = getRoomStatus(
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
        freeAt,
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
    (r) => r.status === 'available'
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
