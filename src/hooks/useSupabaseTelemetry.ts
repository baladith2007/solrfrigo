import { useState, useEffect, useCallback, useRef } from 'react';
import {
  isSupabaseConfigured,
  fetchLatestSensorReadings,
  subscribeToSensorReadings,
  normalizeSensorReading,
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
        errorMessage: 'Connection Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not detected in import.meta.env.'
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
        return { success: false, error: 'Supabase client not initialized', isRlsBlocked: false };
      }

      let sampleData: Record<string, any> = {
        temperature: payload?.temperature ?? Number((3.6 + Math.random() * 0.6).toFixed(1)),
        humidity: payload?.humidity ?? Math.round(87 + Math.random() * 4),
        battery_level: payload?.batteryLevel ?? Math.round(91 + Math.random() * 5),
        solar_power: payload?.solarPower ?? Math.round(820 + Math.random() * 60),
        cooling_status: payload?.coolingStatus ?? 'Active Peltier Stage (Optimal)',
        created_at: new Date().toISOString()
      };

      try {
        let insertedRow: any = null;
        let { data: insertedList, error } = await client.from('sensor_readings').insert([sampleData]).select();

        if (!error && insertedList && insertedList.length > 0) {
          insertedRow = insertedList[0];
        }

        // If error is about column missing (code 42703), retry with alternative column naming conventions
        if (error && (error.message.includes('created_at') || error.code === '42703')) {
          sampleData = {
            temperature: sampleData.temperature,
            humidity: sampleData.humidity,
            battery_level: sampleData.battery_level,
            solar_power: sampleData.solar_power,
            cooling_status: sampleData.cooling_status,
            reading_time: new Date().toISOString()
          };
          const res2 = await client.from('sensor_readings').insert([sampleData]).select();
          if (!res2.error) {
            error = null;
            insertedRow = res2.data?.[0] || sampleData;
          } else if (res2.error.code === '42703') {
            const camelData = {
              temperature: sampleData.temperature,
              humidity: sampleData.humidity,
              batteryLevel: sampleData.battery_level,
              solarPower: sampleData.solar_power,
              coolingStatus: sampleData.cooling_status
            };
            const res3 = await client.from('sensor_readings').insert([camelData]).select();
            if (!res3.error) {
              error = null;
              insertedRow = res3.data?.[0] || camelData;
            } else {
              error = res3.error;
            }
          } else {
            error = res2.error;
          }
        }

        if (error) {
          const isRls =
            error.message.toLowerCase().includes('row-level security') ||
            error.code === '42501' ||
            error.message.includes('violates row-level');

          if (isRls) {
            setTelemetryState((prev) => ({
              ...prev,
              isRlsBlocked: true,
              errorMessage: 'Supabase RLS Policy: Run SQL in Supabase to grant anonymous insert to sensor_readings.'
            }));
          }

          return {
            success: false,
            error: error.message,
            isRlsBlocked: isRls,
            sampleData
          };
        }

        // Successfully written to Supabase! Immediately update the state
        const normalized = normalizeSensorReading(insertedRow || sampleData);
        setTelemetryState((prev) => {
          const updatedRecent = [
            {
              id: normalized.id,
              temperature: normalized.temperature,
              humidity: normalized.humidity,
              batteryLevel: normalized.batteryLevel,
              solarPower: normalized.solarPower,
              coolingStatus: normalized.coolingStatus,
              readingTime: normalized.readingTime
            },
            ...prev.recentReadings.filter((r) => r.id !== normalized.id).slice(0, 19)
          ];

          return {
            ...prev,
            isConnected: true,
            isRlsBlocked: false,
            isLocalPreview: false,
            errorMessage: null,
            lastReadingTime: normalized.readingTime,
            lastFetchedAt: new Date(),
            latestReading: {
              temperature: normalized.temperature,
              humidity: normalized.humidity,
              batteryLevel: normalized.batteryLevel,
              solarPower: normalized.solarPower,
              coolingStatus: normalized.coolingStatus,
              readingTime: normalized.readingTime
            },
            recentReadings: updatedRecent
          };
        });

        // Background refetch to sync any additional server fields
        fetchReadings(true);
        return { success: true, error: null, isRlsBlocked: false };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Failed to insert test reading', isRlsBlocked: false };
      }
    },
    [fetchReadings]
  );

  // Inject a local preview reading into the UI when RLS blocks cloud writes or for testing
  const addLocalReading = useCallback((payload?: Partial<NormalizedSensorReading>) => {
    const timeNow = new Date().toISOString();
    const localReading = {
      id: `local-${Date.now()}`,
      temperature: payload?.temperature ?? Number((3.6 + Math.random() * 0.6).toFixed(1)),
      humidity: payload?.humidity ?? Math.round(87 + Math.random() * 4),
      batteryLevel: payload?.batteryLevel ?? Math.round(91 + Math.random() * 5),
      solarPower: payload?.solarPower ?? Math.round(820 + Math.random() * 60),
      coolingStatus: payload?.coolingStatus ?? 'Active Peltier Stage (Optimal)',
      readingTime: timeNow
    };

    setTelemetryState((prev) => ({
      ...prev,
      isConnected: true,
      isLocalPreview: true,
      lastReadingTime: timeNow,
      lastFetchedAt: new Date(),
      latestReading: localReading,
      recentReadings: [localReading, ...prev.recentReadings.filter((r) => r.id !== localReading.id).slice(0, 19)]
    }));

    return localReading;
  }, []);

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
        errorMessage: 'Connection Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not detected in import.meta.env.'
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
    insertTestReading,
    addLocalReading
  };
}
