import { useState, useEffect, useCallback } from 'react';

// Utility to add realistic noise to values
const addNoise = (value: number, noisePercent: number = 5): number => {
  const noise = (Math.random() - 0.5) * 2 * (value * noisePercent / 100);
  return value + noise;
};

// Utility to smoothly interpolate values
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export interface SensorData {
  speed: number;
  rpm: number;
  maf: number;
  absoluteLoad: number;
  acPower: number;
  heaterPower: number;
  engineDiagnostics: string;
}

export interface MLPredictions {
  fuelRate: number;
  distanceTraveled: number;
  fuelConsumed: number;
  instantKPL: number;
  co2Emissions: number;
  costRupees: number;
  rollingKPL: number[];
}

export interface BehaviorMetrics {
  avgKPL: number;
  avgSpeed: number;
  idlePercent: number;
  harshAccelCount: number;
  harshBrakeCount: number;
  speedVariance: number;
  highRPMPercent: number;
  modeRatios: { city: number; highway: number; ghat: number };
  stopGoIndex: number;
  tvglAnomaly: boolean;
}

export interface DriverScores {
  personalScore: number;
  personalTrend: 'improving' | 'declining' | 'stable';
  fleetScore: number;
  fleetRank: number;
  totalDrivers: number;
  gapFromBest: number;
}

export interface CoachingRecommendation {
  priority: 'high' | 'medium' | 'low';
  message: string;
  potentialSavings: number;
}

export interface SecurityStatus {
  sensorDependencies: 'normal' | 'unusual' | 'tamper';
  dataConsistency: 'verified' | 'unusual' | 'tamper';
  mafLoadCorrelation: 'normal' | 'unusual' | 'tamper';
  rpmPattern: 'normal' | 'unusual' | 'tamper';
  hashChainIntegrity: boolean;
  blockchainAnchor: boolean;
  immutableAuditTrail: boolean;
}

export interface FleetOverview {
  activeVehicles: number;
  avgFleetKPL: number;
  monthlySavings: number;
  anomaliesToday: number;
}

export interface SystemHealth {
  uptime: number;
  updateFrequency: number;
  avgProcessingTime: number;
}

export type DrivingContext = 'city' | 'highway' | 'ghat' | 'mixed';

export interface SimulatedData {
  sensors: SensorData;
  predictions: MLPredictions;
  behavior: BehaviorMetrics;
  scores: DriverScores;
  coaching: CoachingRecommendation[];
  security: SecurityStatus;
  fleet: FleetOverview;
  system: SystemHealth;
  context: DrivingContext;
  timestamp: Date;
}

const contexts: DrivingContext[] = ['city', 'highway', 'ghat', 'mixed'];

const getBaseValuesForContext = (context: DrivingContext) => {
  switch (context) {
    case 'city':
      return { speed: 35, rpm: 2200, maf: 12, load: 45 };
    case 'highway':
      return { speed: 85, rpm: 2800, maf: 28, load: 55 };
    case 'ghat':
      return { speed: 40, rpm: 3500, maf: 35, load: 75 };
    case 'mixed':
    default:
      return { speed: 55, rpm: 2500, maf: 20, load: 50 };
  }
};

export const useSimulatedData = (updateInterval: number = 2000): SimulatedData => {
  const [context, setContext] = useState<DrivingContext>('city');
  const [data, setData] = useState<SimulatedData>(() => generateInitialData('city'));

  // Change context every 30 seconds
  useEffect(() => {
    const contextInterval = setInterval(() => {
      const newContext = contexts[Math.floor(Math.random() * contexts.length)];
      setContext(newContext);
    }, 30000);

    return () => clearInterval(contextInterval);
  }, []);

  // Update sensor data regularly
  useEffect(() => {
    const updateData = () => {
      setData(prev => generateUpdatedData(prev, context));
    };

    const interval = setInterval(updateData, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, context]);

  return data;
};

function generateInitialData(context: DrivingContext): SimulatedData {
  const baseValues = getBaseValuesForContext(context);
  
  const sensors: SensorData = {
    speed: addNoise(baseValues.speed, 10),
    rpm: addNoise(baseValues.rpm, 8),
    maf: addNoise(baseValues.maf, 5),
    absoluteLoad: addNoise(baseValues.load, 5),
    acPower: addNoise(1.2, 20),
    heaterPower: addNoise(400, 15),
    engineDiagnostics: 'OK',
  };

  const fuelRate = calculateFuelRate(sensors);
  const instantKPL = sensors.speed > 0 ? sensors.speed / fuelRate : 0;

  const predictions: MLPredictions = {
    fuelRate,
    distanceTraveled: 0,
    fuelConsumed: 0,
    instantKPL,
    co2Emissions: fuelRate * 2.31, // kg CO2 per liter
    costRupees: 0,
    rollingKPL: Array(10).fill(instantKPL).map(v => addNoise(v, 5)),
  };

  const behavior: BehaviorMetrics = {
    avgKPL: addNoise(12.5, 10),
    avgSpeed: addNoise(45, 15),
    idlePercent: addNoise(8, 30),
    harshAccelCount: Math.floor(Math.random() * 5),
    harshBrakeCount: Math.floor(Math.random() * 3),
    speedVariance: addNoise(15, 20),
    highRPMPercent: addNoise(12, 25),
    modeRatios: { city: 0.5, highway: 0.3, ghat: 0.2 },
    stopGoIndex: addNoise(0.35, 20),
    tvglAnomaly: false,
  };

  const scores: DriverScores = {
    personalScore: Math.floor(addNoise(72, 5)),
    personalTrend: 'improving',
    fleetScore: Math.floor(addNoise(85, 3)),
    fleetRank: 47,
    totalDrivers: 200,
    gapFromBest: 18,
  };

  const coaching: CoachingRecommendation[] = [
    { priority: 'high', message: 'Reduce harsh braking by 40%', potentialSavings: 450 },
    { priority: 'medium', message: 'Decrease idle time in city', potentialSavings: 200 },
    { priority: 'low', message: 'Optimize AC usage', potentialSavings: 80 },
  ];

  const security: SecurityStatus = {
    sensorDependencies: 'normal',
    dataConsistency: 'verified',
    mafLoadCorrelation: 'unusual',
    rpmPattern: 'normal',
    hashChainIntegrity: true,
    blockchainAnchor: true,
    immutableAuditTrail: true,
  };

  const fleet: FleetOverview = {
    activeVehicles: 847,
    avgFleetKPL: 13.2,
    monthlySavings: 420000,
    anomaliesToday: 3,
  };

  const system: SystemHealth = {
    uptime: 99.8,
    updateFrequency: 60,
    avgProcessingTime: 127,
  };

  return {
    sensors,
    predictions,
    behavior,
    scores,
    coaching,
    security,
    fleet,
    system,
    context,
    timestamp: new Date(),
  };
}

function generateUpdatedData(prev: SimulatedData, context: DrivingContext): SimulatedData {
  const baseValues = getBaseValuesForContext(context);
  const lerpFactor = 0.3;

  // Smoothly transition sensor values
  const sensors: SensorData = {
    speed: lerp(prev.sensors.speed, addNoise(baseValues.speed, 15), lerpFactor),
    rpm: lerp(prev.sensors.rpm, addNoise(baseValues.rpm, 10), lerpFactor),
    maf: lerp(prev.sensors.maf, addNoise(baseValues.maf, 8), lerpFactor),
    absoluteLoad: lerp(prev.sensors.absoluteLoad, addNoise(baseValues.load, 8), lerpFactor),
    acPower: lerp(prev.sensors.acPower, addNoise(1.2, 25), lerpFactor),
    heaterPower: lerp(prev.sensors.heaterPower, addNoise(400, 20), lerpFactor),
    engineDiagnostics: 'OK',
  };

  const fuelRate = calculateFuelRate(sensors);
  const instantKPL = sensors.speed > 0 ? sensors.speed / fuelRate : 0;
  const timeDelta = 2 / 3600; // 2 seconds in hours

  const predictions: MLPredictions = {
    fuelRate,
    distanceTraveled: prev.predictions.distanceTraveled + (sensors.speed * timeDelta),
    fuelConsumed: prev.predictions.fuelConsumed + (fuelRate * timeDelta),
    instantKPL,
    co2Emissions: prev.predictions.co2Emissions + (fuelRate * timeDelta * 2.31),
    costRupees: prev.predictions.costRupees + (fuelRate * timeDelta * 106.5), // ₹106.5 per liter
    rollingKPL: [...prev.predictions.rollingKPL.slice(1), instantKPL],
  };

  // Occasionally trigger events
  const harshAccelEvent = Math.random() < 0.05;
  const harshBrakeEvent = Math.random() < 0.03;
  const anomalyEvent = Math.random() < 0.02;

  const behavior: BehaviorMetrics = {
    avgKPL: lerp(prev.behavior.avgKPL, addNoise(12.5 + (context === 'highway' ? 3 : 0), 8), 0.1),
    avgSpeed: lerp(prev.behavior.avgSpeed, sensors.speed, 0.2),
    idlePercent: lerp(prev.behavior.idlePercent, addNoise(context === 'city' ? 12 : 5, 20), 0.1),
    harshAccelCount: prev.behavior.harshAccelCount + (harshAccelEvent ? 1 : 0),
    harshBrakeCount: prev.behavior.harshBrakeCount + (harshBrakeEvent ? 1 : 0),
    speedVariance: lerp(prev.behavior.speedVariance, addNoise(context === 'city' ? 20 : 8, 15), 0.1),
    highRPMPercent: lerp(prev.behavior.highRPMPercent, addNoise(context === 'ghat' ? 25 : 10, 20), 0.1),
    modeRatios: prev.behavior.modeRatios,
    stopGoIndex: lerp(prev.behavior.stopGoIndex, addNoise(context === 'city' ? 0.5 : 0.15, 15), 0.1),
    tvglAnomaly: anomalyEvent || prev.behavior.tvglAnomaly,
  };

  // Slowly update scores
  const scoreChange = (Math.random() - 0.4) * 0.5; // Slight bias toward improvement
  const newPersonalScore = Math.max(0, Math.min(100, prev.scores.personalScore + scoreChange));
  
  const scores: DriverScores = {
    personalScore: Math.floor(newPersonalScore),
    personalTrend: scoreChange > 0.1 ? 'improving' : scoreChange < -0.1 ? 'declining' : prev.scores.personalTrend,
    fleetScore: prev.scores.fleetScore,
    fleetRank: Math.max(1, Math.min(200, prev.scores.fleetRank + Math.floor((Math.random() - 0.5) * 2))),
    totalDrivers: 200,
    gapFromBest: Math.max(0, prev.scores.fleetScore - Math.floor(newPersonalScore)),
  };

  // Update security status occasionally
  const security: SecurityStatus = {
    ...prev.security,
    mafLoadCorrelation: anomalyEvent ? 'unusual' : Math.random() < 0.05 ? 'normal' : prev.security.mafLoadCorrelation,
    rpmPattern: Math.random() < 0.01 ? 'tamper' : Math.random() < 0.05 ? 'normal' : prev.security.rpmPattern,
  };

  // Update fleet stats slightly
  const fleet: FleetOverview = {
    activeVehicles: prev.fleet.activeVehicles + Math.floor((Math.random() - 0.5) * 4),
    avgFleetKPL: lerp(prev.fleet.avgFleetKPL, addNoise(13.2, 3), 0.05),
    monthlySavings: prev.fleet.monthlySavings + Math.floor((Math.random() - 0.3) * 1000),
    anomaliesToday: anomalyEvent ? prev.fleet.anomaliesToday + 1 : prev.fleet.anomaliesToday,
  };

  const system: SystemHealth = {
    uptime: Math.min(100, lerp(prev.system.uptime, addNoise(99.8, 0.5), 0.1)),
    updateFrequency: 60,
    avgProcessingTime: lerp(prev.system.avgProcessingTime, addNoise(127, 15), 0.2),
  };

  return {
    sensors,
    predictions,
    behavior,
    scores,
    coaching: prev.coaching,
    security,
    fleet,
    system,
    context,
    timestamp: new Date(),
  };
}

function calculateFuelRate(sensors: SensorData): number {
  // Simplified fuel rate calculation based on sensor inputs
  // Real model would use trained Random Forest
  const baseRate = 1.5;
  const speedFactor = sensors.speed * 0.015;
  const rpmFactor = sensors.rpm * 0.0003;
  const loadFactor = sensors.absoluteLoad * 0.02;
  const acFactor = sensors.acPower * 0.3;
  
  return Math.max(0.5, baseRate + speedFactor + rpmFactor + loadFactor + acFactor);
}

export default useSimulatedData;
