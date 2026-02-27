import { RoomSchedule } from '../types';
import { TimeGrid } from './TimeGrid';
import { useAvailabilityContext } from '../context/AvailabilityContext';
import { getRoomStatus } from '../utils/availabilityUtils';
import { minutesToTimeString, formatMinutesRemaining } from '../utils/timeUtils';

interface RoomDetailProps {
  roomNumber: string;
  buildingName: string;
  schedule: RoomSchedule;
  onClose: () => void;
}

export function RoomDetail({ roomNumber, buildingName, schedule, onClose }: RoomDetailProps) {
  const { currentDay, currentMinutes } = useAvailabilityContext();
  const { status, currentCourse, nextCourse, minutesUntilChange, freeAt } = getRoomStatus(
    schedule,
    currentDay,
    currentMinutes
  );

  const statusInfo = {
    available: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Available Now',
    },
    occupied: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Occupied',
    },
    'soon-available': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Class Starting Soon',
    },
    'no-data': {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'No Schedule Data',
    },
  };

  const info = statusInfo[status];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-cornell-red text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Room {roomNumber}</h2>
            <p className="text-red-200">{buildingName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cornell-darkRed rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Current status */}
        <div className={`p-4 ${info.bg}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold ${info.bg} ${info.text} border`}
              >
                {info.label}
              </span>
            </div>

            {currentCourse && (
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {currentCourse.course_code}: {currentCourse.title}
                </div>
                <div className="text-sm text-gray-600">
                  Until {minutesToTimeString(freeAt ?? currentCourse.end)}
                  {minutesUntilChange && (
                    <span className="ml-2">
                      ({formatMinutesRemaining(freeAt ? freeAt - currentMinutes : minutesUntilChange)} remaining)
                    </span>
                  )}
                </div>
              </div>
            )}

            {status === 'available' && nextCourse && (
              <div className="flex-1">
                <div className="text-sm text-gray-600">
                  Free until {minutesToTimeString(nextCourse.start)}
                  {minutesUntilChange && (
                    <span className="ml-1">
                      ({formatMinutesRemaining(minutesUntilChange)})
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Next: {nextCourse.course_code}
                </div>
              </div>
            )}

            {status === 'available' && !nextCourse && (
              <div className="flex-1 text-sm text-gray-600">
                Free for the rest of the day
              </div>
            )}
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly Schedule</h3>
          <TimeGrid schedule={schedule} />
        </div>
      </div>
    </div>
  );
}
