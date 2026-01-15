import { motion } from 'framer-motion';
import { SensorData } from '@/hooks/useSimulatedData';
import { Gauge, Zap, Wind, BarChart3, Snowflake, Flame, Wrench, Radio } from 'lucide-react';

interface SensorInputCardProps {
  sensors: SensorData;
  className?: string;
}

const sensorConfig = [
  { key: 'speed', label: 'Speed', unit: 'km/h', icon: Gauge, color: 'text-primary' },
  { key: 'rpm', label: 'Engine RPM', unit: 'rpm', icon: Zap, color: 'text-secondary' },
  { key: 'maf', label: 'MAF', unit: 'g/s', icon: Wind, color: 'text-warning' },
  { key: 'absoluteLoad', label: 'Abs Load', unit: '%', icon: BarChart3, color: 'text-accent' },
  { key: 'acPower', label: 'AC Power', unit: 'kW', icon: Snowflake, color: 'text-primary' },
  { key: 'heaterPower', label: 'Heater', unit: 'W', icon: Flame, color: 'text-destructive' },
  { key: 'engineDiagnostics', label: 'Diag', unit: '', icon: Wrench, color: 'text-secondary' },
];

export default function SensorInputCard({ sensors, className }: SensorInputCardProps) {
  const getSensorValue = (key: string): string => {
    const value = sensors[key as keyof SensorData];
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return String(value);
  };

  return (
    <motion.div 
      className={`glass-card-blue p-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Radio className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-xs font-rajdhani font-bold text-primary uppercase tracking-wider">
          OBD-II Sensor Inputs
        </span>
      </div>
      
      <div className="text-[9px] text-muted-foreground mb-2 font-inter">
        Real-Time Streaming (60s windows)
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {sensorConfig.map((sensor, index) => {
          const Icon = sensor.icon;
          const value = getSensorValue(sensor.key);
          
          return (
            <motion.div
              key={sensor.key}
              className="sensor-pill flex items-center gap-1.5 py-1 px-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <Icon className={`w-3 h-3 ${sensor.color}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[8px] text-muted-foreground truncate">
                  {sensor.label}
                </div>
                <div className={`text-[10px] font-orbitron font-bold ${sensor.color}`}>
                  {value}
                  {sensor.unit && <span className="text-[7px] ml-0.5 opacity-70">{sensor.unit}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Data flow indicator */}
      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: '50%' }}
        />
      </div>
    </motion.div>
  );
}
