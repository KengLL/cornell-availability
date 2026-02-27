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
  isLiveTime: boolean;
  setCurrentDay: (day: DayCode) => void;
  setCurrentMinutes: (minutes: number) => void;
  resetToNow: () => void;
  selectedBuilding: string | null;
  selectedRoom: string | null;
  setSelectedBuilding: (building: string | null) => void;
  setSelectedRoom: (room: string | null) => void;
}

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useAvailability();
  const [isLiveTime, setIsLiveTime] = useState(true);
  const [currentDay, setCurrentDayState] = useState<DayCode>(getCurrentDayCode());
  const [currentMinutes, setCurrentMinutesState] = useState(getCurrentMinutes());
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Update time every minute only when in live mode
  useEffect(() => {
    if (!isLiveTime) return;
    const interval = setInterval(() => {
      setCurrentDayState(getCurrentDayCode());
      setCurrentMinutesState(getCurrentMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, [isLiveTime]);

  const setCurrentDay = (day: DayCode) => {
    setIsLiveTime(false);
    setCurrentDayState(day);
  };

  const setCurrentMinutes = (minutes: number) => {
    setIsLiveTime(false);
    setCurrentMinutesState(minutes);
  };

  const resetToNow = () => {
    setIsLiveTime(true);
    setCurrentDayState(getCurrentDayCode());
    setCurrentMinutesState(getCurrentMinutes());
  };

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
        isLiveTime,
        setCurrentDay,
        setCurrentMinutes,
        resetToNow,
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
