import { useState, useEffect } from 'react';
import { useAvailabilityContext } from '../context/AvailabilityContext';

export function Header() {
  const { selectedBuilding, setSelectedBuilding, setSelectedRoom } = useAvailabilityContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBackToMap = () => {
    setSelectedBuilding(null);
    setSelectedRoom(null);
  };

  return (
    <header className="bg-cornell-red text-white shadow-lg">
      <div className="w-full px-4 py-3 sm:px-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedBuilding && (
              <button
                onClick={handleBackToMap}
                className="p-2 hover:bg-cornell-darkRed rounded-lg transition-colors"
                aria-label="Back to map"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {selectedBuilding || 'Cornell Classroom Availability'}
              </h1>
              {!selectedBuilding && (
                <p className="text-sm text-red-200 hidden sm:block">
                  Find available classrooms across campus
                </p>
              )}
            </div>
          </div>

          <div className="text-right ml-auto">
            <div className="text-lg sm:text-xl font-semibold">
              {time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
            <div className="text-sm text-red-200">
              {time.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
