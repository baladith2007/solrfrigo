import { ProduceBatch, SensorBusItem, SystemAlert } from '../types';

export const INITIAL_PRODUCE_BATCHES: ProduceBatch[] = [
  {
    id: 'batch-1',
    batchCode: '#SS-084',
    cropName: 'Naga King Chilli',
    variety: 'Bhut Jolokia',
    category: 'HOT PEPPERS',
    tag: 'GI-TAGGED',
    weightKg: 180,
    crates: 6,
    freshnessPercent: 96,
    qualityGrade: 'Grade A+',
    storedDays: 4,
    targetMandi: 'Dimapur Agri Terminal',
    dispatchDaysLeft: 5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbWRnm6zxC0ZZRHzB0OLldVeFCy97UOz3fRIZ75wB_PvTbSxg5x6GTraeFW8h9gYqgghrSvqB8MNk3iart4s-6fbHoRQzgGp9nJ-yNJR7jVAQNcqH41RKC5ErT_XRVNwXKClVc8b6JEheipEh2uObQOoOptyTaebpId2M-95UxT4u18Izuw-Q79iZpFC-Ypl5hD3MqVFcNBRQoI5SoDZzNTyItimoNuZLIzvEy-D9bYlWonuceJLA0',
    statusNote: 'Stable capsaicin content & stem crispness',
    farmerName: 'Tepunuo Angami (Jakhama Village)'
  },
  {
    id: 'batch-2',
    batchCode: '#SS-081',
    cropName: 'Khasi Mandarin',
    variety: 'Sweet Citrus reticulata',
    category: 'CITRUS',
    weightKg: 320,
    crates: 12,
    freshnessPercent: 92,
    qualityGrade: 'Grade A',
    storedDays: 7,
    targetMandi: 'Guwahati Wholesale Mandi',
    dispatchDaysLeft: 3,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCEsiJGt0W1lEg66RrRph-6AQEYkcPHWAy7KH3RObnXwWXi5V7_vVRH1DOxwJmJ1IE3W89flWQoyEuqUYi8XN_9l0k_zEcfuTRz6fNanw2wP5vLQXWLQWQ8eb4jq0pYwPsQkgwkFV0HI8NZSmxi8PDiKtYZP-Vi4x76cLkQVPGyngvI0tLoXqBc1Wrxywr2q0R16WLnfFeIy7_32Jz33HVPRk_4bLPV8I-zpDRH67Hc4Wje-6BCRb',
    statusNote: 'Turgid peel, 11.2° Brix sugar retention',
    farmerName: 'Mewanba Sohra (East Khasi Hills)'
  },
  {
    id: 'batch-3',
    batchCode: '#SS-079',
    cropName: 'Ginger (Bhaise)',
    variety: 'High Oleoresin Zingiber',
    category: 'ORGANIC SIKKIM',
    tag: 'ORGANIC CERTIFIED',
    weightKg: 250,
    crates: 10,
    freshnessPercent: 98,
    qualityGrade: 'Ext. Life',
    storedDays: 11,
    targetMandi: 'Siliguri Regulated Market',
    dispatchDaysLeft: 8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvlp29hX9UGMIqvmiDu3SmpHQpMcBLL6l-pvMNMKR46BQ3bTLAUsVnF6ruKIkm9fmgYCqjQxckWxOltA9QLJK_xrciIea3m0Hy0FchjYMljKsy8sY066fm0Rd8GPeg_UhqTZBleDyqjjNJzfz0Q02Ons6lR93wCZlifRjguywlgogb7flqfMCj5dU4lTFU4p8RM4eFAxRe3RrIYoZNv3w2718AEP20DdhKU_P2CO-3cUuM9zWtfEi',
    statusNote: 'Rhizome curing phase complete, zero mold',
    farmerName: 'Passang Bhutia (Namchi FPO)'
  },
  {
    id: 'batch-4',
    batchCode: '#SS-076',
    cropName: 'Mountain Cabbage',
    variety: 'Brassica oleracea cap.',
    category: 'HIGHLAND VEG',
    weightKg: 150,
    crates: 8,
    freshnessPercent: 89,
    qualityGrade: 'Optimal',
    storedDays: 5,
    targetMandi: 'Kohima Local Bazaar',
    dispatchDaysLeft: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLlh4SS3weowz3tOw7B61C99DRsCPuH1Dkd0fMw6XJCosnPcVLd3jT31_yTwpRai0m5JIDVmLt20J8JSQ16JvM16-CISvi-dERKHU2_07UZNS0kUHvM_wH4Ceu0u42vKDL4OL6OKfPUf44c6wigRw4WHF3uf_NHuV0thDD4Hy8DNSUZfHTYiuhxmbysQzn8ma3XJG304fL19ZaiCgbqBR78vIlcJMd1IwCLnTdwcAnBa_ztJIx7KrN',
    statusNote: 'Dense head, dewy moisture locked in',
    farmerName: 'Kezhokhoto Chase (Khonoma)'
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alert-1',
    type: 'advisory',
    title: 'PCM Recharging Active',
    category: 'Advisory • Solar Thermal',
    timeStr: '12:45 PM',
    description: 'Surplus solar output redirected into Phase Change Material buffer. Pre-freezing reservoir to maintain safe chamber cold levels through evening cloud cycles.',
    active: true
  },
  {
    id: 'alert-2',
    type: 'resolved',
    title: 'Chamber Hatch Breach Corrected',
    category: 'Resolved Loop',
    timeStr: '11:15 AM',
    description: 'Magnetic switch registered access duration of 42s during fresh crate loading. Seal secured; chamber interior stabilized safely at 3.8°C.',
    active: false
  }
];

export const INITIAL_SENSOR_BUSES: SensorBusItem[] = [
  {
    id: 'sensor-ds1',
    name: 'Chamber Center',
    busType: 'DS18B20 Probe 01',
    value: '3.8',
    unit: '°C',
    statusText: 'Normal (2–4°C)',
    nominal: true,
    icon: 'sensors'
  },
  {
    id: 'sensor-ds2',
    name: 'PCM Core Bed',
    busType: 'DS18B20 Probe 02',
    value: '-1.2',
    unit: '°C',
    statusText: 'Solid State',
    nominal: true,
    icon: 'ac_unit'
  },
  {
    id: 'sensor-ina-solar',
    name: 'Solar Array Bus',
    busType: 'INA226 (I2C 0x40)',
    value: '38.4V',
    unit: '',
    subValue: '21.9 A (841W)',
    statusText: 'Peak Gen',
    nominal: true,
    icon: 'wb_sunny'
  },
  {
    id: 'sensor-ina-bat',
    name: 'LiFePO4 Storage',
    busType: 'INA226 (I2C 0x41)',
    value: '54.1V',
    unit: '',
    subValue: '+7.8 A (Charge)',
    statusText: '94% SoC',
    nominal: true,
    icon: 'battery_charging_full'
  },
  {
    id: 'sensor-ntc-peltier',
    name: 'TEC Heat Sink',
    busType: 'Peltier Stage NTC',
    value: '34.2',
    unit: '°C',
    statusText: 'Fan at 1,850 RPM',
    nominal: true,
    icon: 'mode_fan'
  },
  {
    id: 'sensor-pump',
    name: 'Hydronic Loop',
    busType: '12V Solenoid & Pump',
    value: '12.2V',
    unit: '',
    subValue: '3.4 L/min Flow',
    statusText: 'Relay Engaged',
    nominal: true,
    icon: 'water_drop'
  }
];

export const HOURLY_TEMPERATURE_DATA = [
  { time: '00:00', chamber: 3.9, ambient: 16.2, setpoint: 4.0 },
  { time: '03:00', chamber: 3.9, ambient: 15.0, setpoint: 4.0 },
  { time: '06:00', chamber: 3.8, ambient: 17.5, setpoint: 4.0 },
  { time: '09:00', chamber: 4.0, ambient: 22.8, setpoint: 4.0 },
  { time: '12:00', chamber: 4.1, ambient: 27.5, setpoint: 4.0 },
  { time: '13:00', chamber: 4.1, ambient: 28.0, setpoint: 4.0 },
  { time: '15:00', chamber: 3.9, ambient: 25.4, setpoint: 4.0 },
  { time: '18:00', chamber: 3.8, ambient: 21.0, setpoint: 4.0 },
  { time: '21:00', chamber: 3.8, ambient: 18.2, setpoint: 4.0 },
  { time: 'Now', chamber: 3.8, ambient: 22.0, setpoint: 4.0 }
];
