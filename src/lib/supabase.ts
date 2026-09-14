import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable retrieval (Vite client-side)
// Users configure these in AI Studio Settings or .env file
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};
const supabaseUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('MY_SUPABASE_URL')
);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export interface RawSensorReading {
  id?: string | number;
  temperature?: number;
  temp?: number;
  chamber_temp?: number;
  humidity?: number;
  rh?: number;
  relative_humidity?: number;
  battery_level?: number;
  battery_soc?: number;
  battery_percentage?: number;
  battery?: number;
  solar_power?: number;
  solar_watts?: number;
  solar_power_w?: number;
  solar?: number;
  cooling_status?: string;
  cooling_state?: string;
  status?: string;
  created_at?: string;
  reading_time?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface NormalizedSensorReading {
  id: string;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  solarPower: number;
  coolingStatus: string;
  readingTime: string;
  isRealtime: boolean;
}

/**
 * Normalizes field names from different possible schema variants in sensor_readings
 */
export function normalizeSensorReading(raw: RawSensorReading, isRealtime = false): NormalizedSensorReading {
  const temperature = Number(
    raw.temperature ?? raw.temp ?? raw.chamber_temp ?? 3.8
  );
  const humidity = Number(
    raw.humidity ?? raw.rh ?? raw.relative_humidity ?? 88
  );
  const batteryLevel = Number(
    raw.battery_level ?? raw.battery_soc ?? raw.battery_percentage ?? raw.battery ?? 92
  );
  const solarPower = Number(
    raw.solar_power ?? raw.solar_watts ?? raw.solar_power_w ?? raw.solar ?? 840
  );
  const coolingStatus = String(
    raw.cooling_status ?? raw.cooling_state ?? raw.status ?? 'Peltier Active (Normal)'
  );
  const readingTime = String(
    raw.reading_time ?? raw.created_at ?? raw.timestamp ?? new Date().toISOString()
  );

  return {
    id: String(raw.id ?? `reading-${Date.now()}`),
    temperature: isNaN(temperature) ? 3.8 : Number(temperature.toFixed(1)),
    humidity: isNaN(humidity) ? 88 : Math.round(humidity),
    batteryLevel: isNaN(batteryLevel) ? 92 : Math.round(batteryLevel),
    solarPower: isNaN(solarPower) ? 840 : Math.round(solarPower),
    coolingStatus,
    readingTime,
    isRealtime
  };
}

/**
 * Fetches the latest sensor readings from Supabase `sensor_readings` table
 */
export async function fetchLatestSensorReadings(limit = 10): Promise<{
  data: NormalizedSensorReading[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: [],
      error: 'Supabase credentials not configured yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };
  }

  try {
    // Try ordering by created_at descending first
    let query = client
      .from('sensor_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    let { data, error } = await query;

    // Fallback if created_at column is named reading_time or id
    if (error && (error.message.includes('created_at') || error.code === '42703')) {
      const fallbackQuery = client
        .from('sensor_readings')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);
      const res = await fallbackQuery;
      data = res.data;
      error = res.error;
    }

    if (error) {
      return {
        data: [],
        error: error.message || 'Error querying sensor_readings table'
      };
    }

    const normalized = (data || []).map((row) => normalizeSensorReading(row));
    return { data: normalized, error: null };
  } catch (err: any) {
    return {
      data: [],
      error: err?.message || 'Network or connection error fetching sensor_readings'
    };
  }
}

/**
 * Subscribes to new live sensor readings pushed to `sensor_readings` in Supabase
 */
export function subscribeToSensorReadings(
  onNewReading: (reading: NormalizedSensorReading) => void,
  onStatusChange?: (status: string) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('public:sensor_readings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
        (payload) => {
          if (payload.new) {
            const normalized = normalizeSensorReading(payload.new, true);
            onNewReading(normalized);
          }
        }
      )
      .subscribe((status) => {
        if (onStatusChange) {
          onStatusChange(status);
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Error establishing Supabase subscription:', err);
    return () => {};
  }
}
