import { motion } from 'framer-motion';
import { SensorData } from '@/hooks/useSimulatedData';
import { Gauge, Zap, Wind, BarChart3, Snowflake, Flame, Radio } from 'lucide-react';

interface SensorInputCardProps {
  sensors: SensorData;
  className?: string;
}

const sensorConfig = [
  { key: 'speed', label: 'Speed', unit: 'km/h', icon: Gauge, color: 'text-primary' },
  { key: 'rpm', label: 'RPM', unit: '', icon: Zap, color: 'text-secondary' },
  { key: 'maf', label: 'MAF', unit: 'g/s', icon: Wind, color: 'text-warning' },
  { key: 'absoluteLoad', label: 'Load', unit: '%', icon: BarChart3, color: 'text-accent' },
  { key: 'acPower', label: 'AC', unit: 'kW', icon: Snowflake, color: 'text-primary' },
  { key: 'heaterPower', label: 'Heat', unit: 'W', icon: Flame, color: 'text-destructive' },
];

export default function SensorInputCard({ sensors, className }: SensorInputCardProps) {
  const getSensorValue = (key: string): string => {
    const value = sensors[key as keyof SensorData];
    if (typeof value === 'number') {
      if (key === 'rpm') return Math.round(value).toString();
      if (key === 'heaterPower') return Math.round(value).toString();
      return value.toFixed(1);
    }
    return String(value);
  };

  return (
    <motion.div 
      className={`glass-card-blue p-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <Radio className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[8px] font-rajdhani font-bold text-primary uppercase tracking-wider">
          OBD-II Inputs
        </span>
        <span className="text-[7px] text-muted-foreground ml-auto">60s window</span>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-1">
        {sensorConfig.map((sensor, index) => {
          const Icon = sensor.icon;
          const value = getSensorValue(sensor.key);
          
          return (
            <motion.div
              key={sensor.key}
              className="flex items-center gap-1 p-1 rounded bg-muted/20 border border-border/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <Icon className={`w-2.5 h-2.5 ${sensor.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0 flex items-baseline justify-between">
                <span className="text-[7px] text-muted-foreground truncate">
                  {sensor.label}
                </span>
                <span className={`text-[9px] font-orbitron font-bold ${sensor.color}`}>
                  {value}
                  {sensor.unit && <span className="text-[6px] ml-0.5 opacity-60">{sensor.unit}</span>}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Data flow indicator */}
      <div className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ width: '50%' }}
        />
      </div>
    </motion.div>
  );
}
