import { useState, useEffect } from 'react';
import { AvailabilityData } from '../types';

interface UseAvailabilityResult {
  data: AvailabilityData | null;
  loading: boolean;
  error: string | null;
}

export function useAvailability(): UseAvailabilityResult {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataUrl = `${import.meta.env.BASE_URL}room_availability.json`;
        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error('Failed to load availability data');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
