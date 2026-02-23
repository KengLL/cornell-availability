import { RoomSchedule, CourseSession } from '../types';
import { DAY_CODES, DAY_NAMES, minutesToShortTime, getTimeSlots } from '../utils/timeUtils';
import { useAvailabilityContext } from '../context/AvailabilityContext';

interface TimeGridProps {
  schedule: RoomSchedule;
}

// Grid configuration
const START_HOUR = 7; // 7 AM
const END_HOUR = 22; // 10 PM
const HOUR_HEIGHT = 40; // pixels per hour
const TOTAL_HOURS = END_HOUR - START_HOUR;

function minutesToGridPosition(minutes: number): number {
  const hours = minutes / 60;
  return (hours - START_HOUR) * HOUR_HEIGHT;
}

function CourseBlock({ course }: { course: CourseSession }) {
  const top = minutesToGridPosition(course.start);
  const height = ((course.end - course.start) / 60) * HOUR_HEIGHT;

  // Generate a consistent color based on course code
  const hash = course.course_code.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const hue = Math.abs(hash) % 360;
  const bgColor = `hsl(${hue}, 70%, 90%)`;
  const borderColor = `hsl(${hue}, 70%, 50%)`;

  return (
    <div
      className="absolute left-0 right-0 mx-0.5 rounded overflow-hidden border-l-2 text-xs"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 20)}px`,
        backgroundColor: bgColor,
        borderLeftColor: borderColor,
      }}
      title={`${course.course_code}: ${course.title}\n${minutesToShortTime(course.start)} - ${minutesToShortTime(course.end)}`}
    >
      <div className="p-1 h-full overflow-hidden">
        <div className="font-semibold text-gray-800 truncate">{course.course_code}</div>
        {height > 30 && (
          <div className="text-gray-600 truncate text-[10px]">{course.title}</div>
        )}
        {height > 45 && (
          <div className="text-gray-500 text-[10px]">
            {minutesToShortTime(course.start)}-{minutesToShortTime(course.end)}
          </div>
        )}
      </div>
    </div>
  );
}

export function TimeGrid({ schedule }: TimeGridProps) {
  const { currentDay, currentMinutes } = useAvailabilityContext();

  const timeSlots = getTimeSlots();
  const currentTimePosition = minutesToGridPosition(currentMinutes);
  const showCurrentTime = currentMinutes >= START_HOUR * 60 && currentMinutes <= END_HOUR * 60;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Day headers */}
        <div className="flex border-b bg-gray-50 sticky top-0 z-10">
          <div className="w-16 flex-shrink-0" /> {/* Time column spacer */}
          {DAY_CODES.map((day) => (
            <div
              key={day}
              className={`flex-1 text-center py-2 text-sm font-medium ${
                day === currentDay
                  ? 'bg-cornell-red text-white'
                  : 'text-gray-700'
              }`}
            >
              <span className="hidden sm:inline">{DAY_NAMES[day]}</span>
              <span className="sm:hidden">{day}</span>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
          {/* Time labels */}
          <div className="w-16 flex-shrink-0 relative">
            {timeSlots
              .filter((_, i) => i % 2 === 0) // Show every hour
              .map((minutes) => (
                <div
                  key={minutes}
                  className="absolute text-xs text-gray-500 -translate-y-1/2 pr-2 text-right w-full"
                  style={{ top: `${minutesToGridPosition(minutes)}px` }}
                >
                  {minutesToShortTime(minutes)}
                </div>
              ))}
          </div>

          {/* Day columns */}
          {DAY_CODES.map((day) => {
            const daySchedule = schedule[day] || [];
            const isToday = day === currentDay;

            return (
              <div
                key={day}
                className={`flex-1 relative border-l ${
                  isToday ? 'bg-red-50/30' : ''
                }`}
              >
                {/* Hour lines */}
                {timeSlots
                  .filter((_, i) => i % 2 === 0)
                  .map((minutes) => (
                    <div
                      key={minutes}
                      className="absolute left-0 right-0 border-t border-gray-200"
                      style={{ top: `${minutesToGridPosition(minutes)}px` }}
                    />
                  ))}

                {/* Half-hour lines (lighter) */}
                {timeSlots
                  .filter((_, i) => i % 2 === 1)
                  .map((minutes) => (
                    <div
                      key={minutes}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${minutesToGridPosition(minutes)}px` }}
                    />
                  ))}

                {/* Course blocks */}
                {daySchedule.map((course, index) => (
                  <CourseBlock key={`${day}-${index}`} course={course} />
                ))}

                {/* Current time indicator */}
                {isToday && showCurrentTime && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-cornell-red z-10"
                    style={{ top: `${currentTimePosition}px` }}
                  >
                    <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-cornell-red rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
