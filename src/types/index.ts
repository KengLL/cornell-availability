export type DayCode = 'M' | 'T' | 'W' | 'R' | 'F' | 'S' | 'U';

export interface CourseSession {
  course_code: string;
  title: string;
  start: number; // minutes from midnight (0-1439)
  end: number;
}

export interface RoomSchedule {
  [day: string]: CourseSession[];
}

export interface BuildingRooms {
  [roomNumber: string]: RoomSchedule;
}

export interface BuildingsData {
  [buildingName: string]: BuildingRooms;
}

export interface AvailabilityData {
  metadata: {
    generated_at: string;
    source_file: string;
  };
  buildings: BuildingsData;
}

export type RoomStatus = 'available' | 'occupied' | 'soon-available' | 'no-data';

export interface RoomAvailability {
  roomNumber: string;
  status: RoomStatus;
  currentCourse?: CourseSession;
  nextCourse?: CourseSession;
  minutesUntilChange?: number;
  freeAt?: number; // for occupied: absolute minute when room is free for >1 hour
}

export interface BuildingAvailability {
  name: string;
  totalRooms: number;
  availableRooms: number;
  rooms: RoomAvailability[];
}

export interface BuildingCoordinate {
  name: string;
  lat: number;
  lng: number;
}
