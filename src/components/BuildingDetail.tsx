import { useState } from 'react';
import { useAvailabilityContext } from '../context/AvailabilityContext';
import { RoomCard } from './RoomCard';
import { RoomDetail } from './RoomDetail';
import { RoomStatus, RoomAvailability } from '../types';

type FilterOption = 'all' | RoomStatus;

// Extract floor prefix from room number (e.g., "G01" -> "G", "101" -> "1", "B12" -> "B")
function getFloorPrefix(roomNumber: string): string {
  const match = roomNumber.match(/^([A-Za-z]+|\d)/);
  if (!match) return '?';
  const prefix = match[1];
  // If it starts with a letter, return the letter(s)
  if (/^[A-Za-z]+$/.test(prefix)) {
    return prefix.toUpperCase();
  }
  // Otherwise return the first digit as the floor
  return prefix;
}

// Get sort order for floor prefix (G=0, B=-1, 1=1, 2=2, etc.)
function getFloorSortOrder(prefix: string): number {
  if (prefix === 'G') return 0;
  if (prefix === 'B') return -1;
  if (prefix === 'LL') return -2; // Lower level
  const num = parseInt(prefix, 10);
  if (!isNaN(num)) return num;
  // Other letter prefixes sort after numbers
  return 100 + prefix.charCodeAt(0);
}

// Sort rooms by floor prefix then by room number
function sortRooms(rooms: RoomAvailability[]): RoomAvailability[] {
  return [...rooms].sort((a, b) => {
    const prefixA = getFloorPrefix(a.roomNumber);
    const prefixB = getFloorPrefix(b.roomNumber);
    const orderA = getFloorSortOrder(prefixA);
    const orderB = getFloorSortOrder(prefixB);

    if (orderA !== orderB) return orderA - orderB;

    // Within same floor, sort by room number naturally
    return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
  });
}

// Group rooms by floor prefix
function groupRoomsByFloor(rooms: RoomAvailability[]): Map<string, RoomAvailability[]> {
  const groups = new Map<string, RoomAvailability[]>();
  const sortedRooms = sortRooms(rooms);

  for (const room of sortedRooms) {
    const prefix = getFloorPrefix(room.roomNumber);
    if (!groups.has(prefix)) {
      groups.set(prefix, []);
    }
    groups.get(prefix)!.push(room);
  }

  return groups;
}

// Get display name for floor
function getFloorDisplayName(prefix: string): string {
  if (prefix === 'G') return 'Ground Floor';
  if (prefix === 'B') return 'Basement';
  if (prefix === 'LL') return 'Lower Level';
  const num = parseInt(prefix, 10);
  if (!isNaN(num)) return `Floor ${num}`;
  return `Floor ${prefix}`;
}

export function BuildingDetail() {
  const { buildings, selectedBuilding, data, setSelectedRoom, selectedRoom, setSelectedBuilding } =
    useAvailabilityContext();
  const [filter, setFilter] = useState<FilterOption>('all');

  const building = buildings.find((b) => b.name === selectedBuilding);

  if (!building) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Building not found</p>
      </div>
    );
  }

  const filteredRooms =
    filter === 'all'
      ? building.rooms
      : building.rooms.filter((r) => r.status === filter);

  const filterOptions: { value: FilterOption; label: string; count: number }[] = [
    { value: 'all', label: 'All Rooms', count: building.rooms.length },
    {
      value: 'available',
      label: 'Available',
      count: building.rooms.filter((r) => r.status === 'available').length,
    },
    {
      value: 'soon-available',
      label: 'Soon Available',
      count: building.rooms.filter((r) => r.status === 'soon-available').length,
    },
    {
      value: 'occupied',
      label: 'Occupied',
      count: building.rooms.filter((r) => r.status === 'occupied').length,
    },
  ];

  // Get room schedule data for RoomDetail
  const roomSchedule =
    selectedRoom && data?.buildings[selectedBuilding!]
      ? data.buildings[selectedBuilding!][selectedRoom]
      : null;

  return (
    <div className="h-full overflow-auto">
      {/* Building header with close button */}
      <div className="bg-cornell-red text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{building.name}</h2>
        <button
          onClick={() => setSelectedBuilding(null)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Building summary */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-emerald-600">
                {building.availableRooms}
                <span className="text-gray-400 text-lg font-normal">
                  /{building.totalRooms}
                </span>
              </div>
              <div className="text-sm text-gray-500">rooms available now</div>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filter === opt.value
                    ? 'bg-cornell-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Room grid grouped by floor */}
      <div className="p-4">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No rooms match this filter
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(groupRoomsByFloor(filteredRooms)).map(([floorPrefix, rooms]) => (
              <div key={floorPrefix}>
                <h3 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">
                  {getFloorDisplayName(floorPrefix)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.roomNumber}
                      room={room}
                      onClick={() => setSelectedRoom(room.roomNumber)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room detail modal */}
      {selectedRoom && roomSchedule && (
        <RoomDetail
          roomNumber={selectedRoom}
          buildingName={building.name}
          schedule={roomSchedule}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
