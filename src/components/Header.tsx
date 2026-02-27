import { useState, useEffect } from 'react';
import { useAvailabilityContext } from '../context/AvailabilityContext';
import { DAY_CODES, DAY_NAMES } from '../utils/timeUtils';
import { DayCode } from '../types';

const MINUTES = [0, 15, 30, 45];

function hourLabel(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export function Header() {
  const {
    selectedBuilding,
    setSelectedBuilding,
    setSelectedRoom,
    currentDay,
    currentMinutes,
    isLiveTime,
    setCurrentDay,
    setCurrentMinutes,
    resetToNow,
  } = useAvailabilityContext();
  const [realTime, setRealTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBackToMap = () => {
    setSelectedBuilding(null);
    setSelectedRoom(null);
  };

  // Snap to 15-min grid for display
  const snapped = Math.min(Math.round(currentMinutes / 15) * 15, 23 * 60 + 45);
  const currentHour = Math.floor(snapped / 60);
  const currentMinute = snapped % 60;

  return (
    <header className="bg-cornell-red text-white shadow-lg">
      <div className="w-full px-4 py-2.5">
        <div className="flex items-center gap-3 justify-between">

          {/* Left: Back + Title */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            {selectedBuilding && (
              <button
                onClick={handleBackToMap}
                className="p-1.5 hover:bg-cornell-darkRed rounded-lg transition-colors flex-shrink-0"
                aria-label="Back to map"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg sm:text-xl font-bold truncate">
              {selectedBuilding || 'Cornell Classroom Availability'}
            </h1>
          </div>

          {/* Center: Day + Time pickers */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Day buttons */}
            <div className="flex gap-0.5">
              {DAY_CODES.map((day) => (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day as DayCode)}
                  title={DAY_NAMES[day as DayCode]}
                  className={`w-7 h-7 text-xs font-semibold rounded transition-colors ${
                    currentDay === day
                      ? 'bg-white text-cornell-red'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-white/30 flex-shrink-0" />

            {/* Hour select */}
            <select
              value={currentHour}
              onChange={(e) => setCurrentMinutes(parseInt(e.target.value) * 60 + currentMinute)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded px-2 py-1 border border-white/20 focus:outline-none focus:border-white/60 [color-scheme:dark] cursor-pointer"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{hourLabel(h)}</option>
              ))}
            </select>

            {/* Minute buttons */}
            <div className="flex gap-0.5">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  onClick={() => setCurrentMinutes(currentHour * 60 + m)}
                  className={`w-8 h-7 text-xs font-semibold rounded transition-colors ${
                    currentMinute === m
                      ? 'bg-white text-cornell-red'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  :{m.toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            {/* Now button */}
            <button
              onClick={resetToNow}
              disabled={isLiveTime}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                isLiveTime
                  ? 'bg-white/10 text-white/40 cursor-default'
                  : 'bg-white text-cornell-red hover:bg-red-50'
              }`}
            >
              Now
            </button>
          </div>

          {/* Right: Real clock */}
          <div className="text-right flex-shrink-0">
            <div className="text-base sm:text-lg font-semibold leading-tight">
              {realTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
            <div className="text-xs text-red-200 leading-tight">
              {realTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
