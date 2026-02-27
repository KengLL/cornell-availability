import { RoomAvailability } from '../types';
import { minutesToTimeString } from '../utils/timeUtils';

interface RoomCardProps {
  room: RoomAvailability;
  onClick: () => void;
}

// Status-based styling
function getStatusStyles(status: RoomAvailability['status']) {
  switch (status) {
    case 'available':
      return {
        bg: 'bg-emerald-500 hover:bg-emerald-600',
        text: 'Available',
      };
    case 'occupied':
      return {
        bg: 'bg-rose-500 hover:bg-rose-600',
        text: 'Occupied',
      };
    case 'soon-available':
      return {
        bg: 'bg-amber-500 hover:bg-amber-600',
        text: 'Class Soon',
      };
    case 'no-data':
    default:
      return {
        bg: 'bg-slate-400 hover:bg-slate-500',
        text: 'No Data',
      };
  }
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const styles = getStatusStyles(room.status);

  // Get brief info text
  let infoText = '';
  if (room.status === 'occupied' && room.freeAt !== undefined) {
    infoText = `Until ${minutesToTimeString(room.freeAt)}`;
  } else if (room.status === 'soon-available' && room.nextCourse) {
    infoText = `Until ${minutesToTimeString(room.nextCourse.start)}`;
  } else if (room.status === 'available' && room.nextCourse) {
    infoText = `Until ${minutesToTimeString(room.nextCourse.start)}`;
  } else if (room.status === 'available') {
    infoText = 'All day';
  }

  return (
    <button
      onClick={onClick}
      className={`w-full ${styles.bg} text-white rounded-lg p-3 text-center transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-cornell-red focus:outline-none shadow-sm`}
    >
      <div className="font-bold text-lg">{room.roomNumber}</div>
      <div className="text-xs opacity-90 mt-0.5">{styles.text}</div>
      {infoText && <div className="text-xs opacity-75 mt-1">{infoText}</div>}
    </button>
  );
}
