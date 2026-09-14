import { useState, useEffect, useCallback, useRef } from 'react';
import {
  isSupabaseConfigured,
  fetchLatestSensorReadings,
  subscribeToSensorReadings,
  NormalizedSensorReading,
  getSupabaseClient
} from '../lib/supabase';
import { SupabaseTelemetryState } from '../types';

export function useSupabaseTelemetry() {
  const [telemetryState, setTelemetryState] = useState<SupabaseTelemetryState>({
    isConfigured: isSupabaseConfigured,
    isConnected: false,
    lastReadingTime: null,
    lastFetchedAt: null,
    errorMessage: null,
    isRealtimeActive: false,
    latestReading: null,
    recentReadings: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  // Manual or programmatic refetch
  const fetchReadings = useCallback(async (silent = false) => {
    if (!isSupabaseConfigured) {
      setTelemetryState((prev) => ({
        ...prev,
        isConfigured: false,
        isConnected: false,
        errorMessage: 'Supabase URL & Anon Key not detected in environment variables. Running in local simulation mode.'
      }));
      return;
    }

    if (!silent) setIsLoading(true);

    try {
      const { data, error } = await fetchLatestSensorReadings(12);

      if (!isMounted.current) return;

      if (error) {
        setTelemetryState((prev) => ({
          ...prev,
          isConnected: false,
          errorMessage: error,
          lastFetchedAt: new Date()
        }));
      } else if (data && data.length > 0) {
        const newest = data[0];
        setTelemetryState((prev) => ({
          ...prev,
          isConnected: true,
          errorMessage: null,
          lastReadingTime: newest.readingTime,
          lastFetchedAt: new Date(),
          latestReading: {
            temperature: newest.temperature,
            humidity: newest.humidity,
            batteryLevel: newest.batteryLevel,
            solarPower: newest.solarPower,
            coolingStatus: newest.coolingStatus,
            readingTime: newest.readingTime
          },
          recentReadings: data.map((d) => ({
            id: d.id,
            temperature: d.temperature,
            humidity: d.humidity,
            batteryLevel: d.batteryLevel,
            solarPower: d.solarPower,
            coolingStatus: d.coolingStatus,
            readingTime: d.readingTime
          }))
        }));
      } else {
        // Table exists or returned 0 rows
        setTelemetryState((prev) => ({
          ...prev,
          isConnected: true,
          errorMessage: 'Table `sensor_readings` connected successfully, but contains 0 rows. Awaiting first IoT telemetry packet.',
          lastFetchedAt: new Date()
        }));
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      setTelemetryState((prev) => ({
        ...prev,
        isConnected: false,
        errorMessage: err?.message || 'Error connecting to Supabase',
        lastFetchedAt: new Date()
      }));
    } finally {
      if (isMounted.current && !silent) {
        setIsLoading(false);
      }
    }
  }, []);

  // Send a test reading into Supabase sensor_readings table
  const insertTestReading = useCallback(
    async (payload?: Partial<NormalizedSensorReading>) => {
      const client = getSupabaseClient();
      if (!client) {
        return { success: false, error: 'Supabase client not initialized' };
      }

      const sampleReading = {
        temperature: payload?.temperature ?? Number((3.6 + Math.random() * 0.6).toFixed(1)),
        humidity: payload?.humidity ?? Math.round(87 + Math.random() * 4),
        battery_level: payload?.batteryLevel ?? Math.round(91 + Math.random() * 5),
        solar_power: payload?.solarPower ?? Math.round(820 + Math.random() * 60),
        cooling_status: payload?.coolingStatus ?? 'Active Peltier Stage (Optimal)',
        created_at: new Date().toISOString()
      };

      try {
        const { error } = await client.from('sensor_readings').insert([sampleReading]);
        if (error) {
          return { success: false, error: error.message };
        }
        await fetchReadings(true);
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to insert test reading' };
      }
    },
    [fetchReadings]
  );

  // Setup initial fetch and real-time subscription
  useEffect(() => {
    isMounted.current = true;

    if (isSupabaseConfigured) {
      fetchReadings();

      const unsubscribe = subscribeToSensorReadings(
        (newReading) => {
          if (!isMounted.current) return;
          setTelemetryState((prev) => {
            const updatedRecent = [
              {
                id: newReading.id,
                temperature: newReading.temperature,
                humidity: newReading.humidity,
                batteryLevel: newReading.batteryLevel,
                solarPower: newReading.solarPower,
                coolingStatus: newReading.coolingStatus,
                readingTime: newReading.readingTime
              },
              ...prev.recentReadings.slice(0, 19)
            ];

            return {
              ...prev,
              isConnected: true,
              errorMessage: null,
              lastReadingTime: newReading.readingTime,
              lastFetchedAt: new Date(),
              latestReading: {
                temperature: newReading.temperature,
                humidity: newReading.humidity,
                batteryLevel: newReading.batteryLevel,
                solarPower: newReading.solarPower,
                coolingStatus: newReading.coolingStatus,
                readingTime: newReading.readingTime
              },
              recentReadings: updatedRecent
            };
          });
        },
        (status) => {
          if (!isMounted.current) return;
          setTelemetryState((prev) => ({
            ...prev,
            isRealtimeActive: status === 'SUBSCRIBED'
          }));
        }
      );

      // Periodic refresh heartbeat every 20 seconds
      const interval = setInterval(() => {
        fetchReadings(true);
      }, 20000);

      return () => {
        isMounted.current = false;
        unsubscribe();
        clearInterval(interval);
      };
    } else {
      setTelemetryState((prev) => ({
        ...prev,
        isConfigured: false,
        isConnected: false,
        errorMessage: 'VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are not yet configured.'
      }));
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchReadings]);

  return {
    telemetryState,
    isLoading,
    refreshReadings: () => fetchReadings(false),
    insertTestReading
  };
}
