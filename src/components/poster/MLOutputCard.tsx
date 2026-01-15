import { motion } from 'framer-motion';
import { MLPredictions } from '@/hooks/useSimulatedData';
import { Fuel, MapPin, Droplets, Gauge, Cloud, IndianRupee, TrendingUp, TreeDeciduous } from 'lucide-react';

interface MLOutputCardProps {
  predictions: MLPredictions;
  className?: string;
}

export default function MLOutputCard({ predictions, className }: MLOutputCardProps) {
  return (
    <motion.div 
      className={`glass-card-blue p-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Primary Output */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <TreeDeciduous className="w-4 h-4 text-secondary" />
          <span className="text-xs font-rajdhani font-bold text-secondary uppercase tracking-wider">
            Random Forest Output
          </span>
        </div>
        
        <div className="glass-card-green p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Fuel className="w-5 h-5 text-secondary" />
            <span className="text-2xl font-orbitron font-bold text-secondary glow-text-green">
              {predictions.fuelRate.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">L/hr</span>
          </div>
          <div className="text-[9px] text-muted-foreground mt-1">
            Real-Time Fuel Rate Prediction
          </div>
        </div>
      </div>

      {/* Derived Metrics Grid */}
      <div className="text-[9px] text-muted-foreground mb-2 font-inter">
        Derived Metrics
      </div>
      
      <div className="grid grid-cols-2 gap-1.5">
        <MetricPill
          icon={MapPin}
          label="Distance"
          value={predictions.distanceTraveled.toFixed(2)}
          unit="km"
          color="text-primary"
          delay={0.7}
        />
        <MetricPill
          icon={Droplets}
          label="Fuel Used"
          value={predictions.fuelConsumed.toFixed(3)}
          unit="L"
          color="text-warning"
          delay={0.75}
        />
        <MetricPill
          icon={Gauge}
          label="Instant KPL"
          value={predictions.instantKPL.toFixed(1)}
          unit="km/L"
          color="text-secondary"
          delay={0.8}
        />
        <MetricPill
          icon={Cloud}
          label="CO₂"
          value={predictions.co2Emissions.toFixed(2)}
          unit="kg"
          color="text-muted-foreground"
          delay={0.85}
        />
        <MetricPill
          icon={IndianRupee}
          label="Cost"
          value={predictions.costRupees.toFixed(0)}
          unit="₹"
          color="text-coaching"
          delay={0.9}
          colSpan={2}
        />
      </div>

      {/* Mini Rolling KPL Chart */}
      <div className="mt-3">
        <div className="flex items-center gap-1 mb-1">
          <TrendingUp className="w-3 h-3 text-secondary" />
          <span className="text-[9px] text-muted-foreground">Rolling KPL Trend</span>
        </div>
        <MiniSparkline data={predictions.rollingKPL} color="#00FF41" />
      </div>
    </motion.div>
  );
}

interface MetricPillProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
  delay: number;
  colSpan?: number;
}

function MetricPill({ icon: Icon, label, value, unit, color, delay, colSpan = 1 }: MetricPillProps) {
  return (
    <motion.div
      className={`flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/30 border border-border/50 ${colSpan === 2 ? 'col-span-2' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Icon className={`w-3 h-3 ${color}`} />
      <div className="flex-1">
        <div className="text-[7px] text-muted-foreground">{label}</div>
        <div className={`text-[10px] font-orbitron font-bold ${color}`}>
          {value}
          <span className="text-[7px] ml-0.5 opacity-70">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface MiniSparklineProps {
  data: number[];
  color: string;
}

function MiniSparkline({ data, color }: MiniSparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-8 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        
        {/* Glow effect */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          filter="blur(2px)"
        />
      </svg>
    </div>
  );
}
