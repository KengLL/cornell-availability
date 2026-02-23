import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AvailabilityData, BuildingAvailability, DayCode } from '../types';
import { useAvailability } from '../hooks/useAvailability';
import { getAllBuildingsAvailability } from '../utils/availabilityUtils';
import { getCurrentDayCode, getCurrentMinutes } from '../utils/timeUtils';

interface AvailabilityContextValue {
  data: AvailabilityData | null;
  loading: boolean;
  error: string | null;
  buildings: BuildingAvailability[];
  currentDay: DayCode;
  currentMinutes: number;
  selectedBuilding: string | null;
  selectedRoom: string | null;
  setSelectedBuilding: (building: string | null) => void;
  setSelectedRoom: (room: string | null) => void;
}

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useAvailability();
  const [currentDay, setCurrentDay] = useState<DayCode>(getCurrentDayCode());
  const [currentMinutes, setCurrentMinutes] = useState(getCurrentMinutes());
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDay(getCurrentDayCode());
      setCurrentMinutes(getCurrentMinutes());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const buildings = data
    ? getAllBuildingsAvailability(data.buildings, currentDay, currentMinutes)
    : [];

  return (
    <AvailabilityContext.Provider
      value={{
        data,
        loading,
        error,
        buildings,
        currentDay,
        currentMinutes,
        selectedBuilding,
        selectedRoom,
        setSelectedBuilding,
        setSelectedRoom,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailabilityContext() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailabilityContext must be used within AvailabilityProvider');
  }
  return context;
}
