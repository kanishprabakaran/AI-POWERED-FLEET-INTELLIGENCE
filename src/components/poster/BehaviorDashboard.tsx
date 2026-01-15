import { motion } from 'framer-motion';
import { BehaviorMetrics, DriverScores, DrivingContext } from '@/hooks/useSimulatedData';
import { 
  Gauge, Car, Timer, Zap, CircleSlash, Activity, 
  Thermometer, Shuffle, TrafficCone, AlertTriangle,
  Brain, Building2, Route, Mountain, GitMerge,
  User, Trophy, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

interface BehaviorDashboardProps {
  behavior: BehaviorMetrics;
  scores: DriverScores;
  context: DrivingContext;
  className?: string;
}

const behaviorConfig = [
  { key: 'avgKPL', label: 'Avg KPL', icon: Gauge, format: (v: number) => v.toFixed(1) },
  { key: 'avgSpeed', label: 'Avg Speed', icon: Car, format: (v: number) => `${v.toFixed(0)} km/h` },
  { key: 'idlePercent', label: 'Idle %', icon: Timer, format: (v: number) => `${v.toFixed(1)}%` },
  { key: 'harshAccelCount', label: 'Harsh Accel', icon: Zap, format: (v: number) => v.toString() },
  { key: 'harshBrakeCount', label: 'Harsh Brake', icon: CircleSlash, format: (v: number) => v.toString() },
  { key: 'speedVariance', label: 'Speed Var', icon: Activity, format: (v: number) => v.toFixed(1) },
  { key: 'highRPMPercent', label: 'High RPM %', icon: Thermometer, format: (v: number) => `${v.toFixed(1)}%` },
  { key: 'stopGoIndex', label: 'Stop-Go', icon: TrafficCone, format: (v: number) => v.toFixed(2) },
];

const contextConfig = {
  city: { icon: Building2, label: 'City', color: 'text-primary' },
  highway: { icon: Route, label: 'Highway', color: 'text-secondary' },
  ghat: { icon: Mountain, label: 'Ghat', color: 'text-warning' },
  mixed: { icon: GitMerge, label: 'Mixed', color: 'text-accent' },
};

export default function BehaviorDashboard({ behavior, scores, context, className }: BehaviorDashboardProps) {
  const getStatusColor = (key: string, value: number): string => {
    // Simple heuristics for status colors
    switch (key) {
      case 'avgKPL':
        return value > 12 ? 'text-secondary' : value > 8 ? 'text-coaching' : 'text-destructive';
      case 'idlePercent':
        return value < 5 ? 'text-secondary' : value < 10 ? 'text-coaching' : 'text-destructive';
      case 'harshAccelCount':
      case 'harshBrakeCount':
        return value < 2 ? 'text-secondary' : value < 5 ? 'text-coaching' : 'text-destructive';
      case 'highRPMPercent':
        return value < 10 ? 'text-secondary' : value < 20 ? 'text-coaching' : 'text-destructive';
      case 'stopGoIndex':
        return value < 0.3 ? 'text-secondary' : value < 0.5 ? 'text-coaching' : 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  const TrendIcon = scores.personalTrend === 'improving' ? TrendingUp : 
                    scores.personalTrend === 'declining' ? TrendingDown : Minus;

  return (
    <motion.div 
      className={`glass-card p-3 h-full flex flex-col ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      style={{
        boxShadow: '0 0 40px rgba(0, 212, 255, 0.1), inset 0 0 30px rgba(0, 212, 255, 0.03)',
        borderColor: 'rgba(0, 212, 255, 0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-xs font-rajdhani font-bold text-primary uppercase tracking-wider">
          Behavioral Analytics Engine
        </span>
      </div>
      <div className="text-[8px] text-muted-foreground mb-2">60-Second Window Analysis</div>

      {/* Behavior Vector Grid */}
      <div className="mb-3">
        <div className="text-[9px] text-muted-foreground mb-1.5 font-semibold">Behavior Vector</div>
        <div className="grid grid-cols-4 gap-1">
          {behaviorConfig.map((item, index) => {
            const Icon = item.icon;
            const value = behavior[item.key as keyof BehaviorMetrics] as number;
            const statusColor = getStatusColor(item.key, value);
            
            return (
              <motion.div
                key={item.key}
                className="flex flex-col items-center p-1.5 rounded-lg bg-muted/20 border border-border/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.03 }}
              >
                <Icon className={`w-3 h-3 ${statusColor} mb-0.5`} />
                <div className={`text-[9px] font-orbitron font-bold ${statusColor}`}>
                  {item.format(value)}
                </div>
                <div className="text-[6px] text-muted-foreground text-center leading-tight">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
          
          {/* TVGL Anomaly indicator */}
          <motion.div
            className={`flex flex-col items-center p-1.5 rounded-lg border ${
              behavior.tvglAnomaly 
                ? 'bg-destructive/20 border-destructive/50' 
                : 'bg-muted/20 border-border/30'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.05 }}
          >
            <AlertTriangle className={`w-3 h-3 mb-0.5 ${behavior.tvglAnomaly ? 'text-destructive animate-pulse' : 'text-secondary'}`} />
            <div className={`text-[9px] font-orbitron font-bold ${behavior.tvglAnomaly ? 'text-destructive' : 'text-secondary'}`}>
              {behavior.tvglAnomaly ? 'ALERT' : 'OK'}
            </div>
            <div className="text-[6px] text-muted-foreground text-center leading-tight">
              TVGL
            </div>
          </motion.div>
        </div>
      </div>

      {/* Context Classification */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Brain className="w-3 h-3 text-accent" />
          <span className="text-[9px] text-muted-foreground font-semibold">Context Classifier</span>
        </div>
        
        <div className="flex gap-1">
          {(Object.keys(contextConfig) as DrivingContext[]).map((ctx) => {
            const config = contextConfig[ctx];
            const Icon = config.icon;
            const isActive = ctx === context;
            
            return (
              <motion.div
                key={ctx}
                className={`flex-1 flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                  isActive 
                    ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                    : 'bg-muted/10 border-border/30'
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className={`w-3 h-3 ${isActive ? config.color : 'text-muted-foreground'}`} />
                <span className={`text-[7px] mt-0.5 ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {config.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Score Cards */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        {/* Personal Baseline */}
        <motion.div
          className="glass-card-green p-2 flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-secondary" />
            <span className="text-[8px] text-secondary font-semibold">Personal</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-xl font-orbitron font-bold text-secondary glow-text-green">
              {scores.personalScore}
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendIcon className={`w-3 h-3 ${
                scores.personalTrend === 'improving' ? 'text-secondary' : 
                scores.personalTrend === 'declining' ? 'text-destructive' : 'text-muted-foreground'
              }`} />
              <span className="text-[8px] text-muted-foreground capitalize">
                {scores.personalTrend}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Fleet-Best Baseline */}
        <motion.div
          className="glass-card-yellow p-2 flex flex-col"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Trophy className="w-3 h-3 text-coaching" />
            <span className="text-[8px] text-coaching font-semibold">Fleet-Best</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-0.5">
              Gap: <span className="text-destructive font-bold">-{scores.gapFromBest}</span> pts
            </div>
            <div className="text-sm font-orbitron font-bold text-coaching">
              #{scores.fleetRank}
              <span className="text-[9px] text-muted-foreground">/{scores.totalDrivers}</span>
            </div>
          </div>
          
          {/* Gap indicator bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #FF3838 0%, #FFD60A 50%, #00FF41 100%)`,
                width: `${(scores.personalScore / scores.fleetScore) * 100}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(scores.personalScore / scores.fleetScore) * 100}%` }}
              transition={{ duration: 1, delay: 1.3 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
