import { motion } from 'framer-motion';
import { CoachingRecommendation, MLPredictions } from '@/hooks/useSimulatedData';
import { 
  GraduationCap, AlertCircle, AlertTriangle, CheckCircle, 
  IndianRupee, Fuel, Cloud, Lightbulb, TrendingUp
} from 'lucide-react';

interface CoachingPanelProps {
  coaching: CoachingRecommendation[];
  predictions: MLPredictions;
  className?: string;
}

const priorityConfig = {
  high: { 
    icon: AlertCircle, 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10', 
    borderColor: 'border-destructive/30',
    label: 'HIGH PRIORITY'
  },
  medium: { 
    icon: AlertTriangle, 
    color: 'text-coaching', 
    bgColor: 'bg-coaching/10', 
    borderColor: 'border-coaching/30',
    label: 'MEDIUM'
  },
  low: { 
    icon: CheckCircle, 
    color: 'text-secondary', 
    bgColor: 'bg-secondary/10', 
    borderColor: 'border-secondary/30',
    label: 'LOW'
  },
};

export default function CoachingPanel({ coaching, predictions, className }: CoachingPanelProps) {
  // Calculate projected improvements
  const currentKPL = predictions.instantKPL;
  const projectedKPL = currentKPL * 1.19; // ~19% improvement if all recommendations followed
  const monthlySavings = coaching.reduce((sum, c) => sum + c.potentialSavings * 4, 0);
  const co2Reduction = (projectedKPL - currentKPL) * 2.31 * 30; // Rough estimate

  return (
    <motion.div 
      className={`glass-card-yellow p-3 h-full flex flex-col ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-4 h-4 text-coaching" />
        <span className="text-xs font-rajdhani font-bold text-coaching uppercase tracking-wider">
          AI Driver Coach
        </span>
      </div>
      <div className="text-[8px] text-muted-foreground mb-2">Real-Time Recommendations</div>

      {/* Recommendations */}
      <div className="space-y-1.5 mb-3">
        {coaching.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={index}
              className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-3 h-3 mt-0.5 ${config.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-[7px] font-bold ${config.color} mb-0.5`}>
                    {config.label}
                  </div>
                  <div className="text-[9px] text-foreground leading-tight">
                    "{rec.message}"
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <IndianRupee className="w-2.5 h-2.5 text-coaching" />
                    <span className="text-[8px] text-coaching font-semibold">
                      ₹{rec.potentialSavings}/week
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Impact Preview */}
      <motion.div
        className="glass-card p-2 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.3 }}
        style={{
          background: 'rgba(0, 255, 65, 0.05)',
          borderColor: 'rgba(0, 255, 65, 0.2)',
        }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <TrendingUp className="w-3 h-3 text-secondary" />
          <span className="text-[8px] font-semibold text-secondary">If Recommendations Followed:</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5">
          <div className="text-center">
            <div className="text-[7px] text-muted-foreground">KPL</div>
            <div className="text-[9px] font-orbitron">
              <span className="text-muted-foreground">{currentKPL.toFixed(1)}</span>
              <span className="text-secondary mx-0.5">→</span>
              <span className="text-secondary font-bold">{projectedKPL.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[7px] text-muted-foreground">Monthly</div>
            <div className="flex items-center justify-center gap-0.5">
              <IndianRupee className="w-2.5 h-2.5 text-coaching" />
              <span className="text-[9px] font-orbitron text-coaching font-bold">
                {monthlySavings.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[7px] text-muted-foreground">CO₂</div>
            <div className="flex items-center justify-center gap-0.5">
              <Cloud className="w-2.5 h-2.5 text-primary" />
              <span className="text-[9px] font-orbitron text-primary font-bold">
                -{co2Reduction.toFixed(0)}kg
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        className="flex-1 glass-card p-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
        style={{
          background: 'rgba(255, 214, 10, 0.03)',
          borderColor: 'rgba(255, 214, 10, 0.15)',
        }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Lightbulb className="w-3 h-3 text-coaching" />
          <span className="text-[8px] font-semibold text-coaching">Quick Tips</span>
        </div>
        
        <ul className="space-y-0.5">
          <li className="text-[7px] text-muted-foreground flex items-start gap-1">
            <span className="text-coaching">•</span>
            Maintain steady speed 40-60 km/h in city
          </li>
          <li className="text-[7px] text-muted-foreground flex items-start gap-1">
            <span className="text-coaching">•</span>
            Anticipate stops to avoid harsh braking
          </li>
          <li className="text-[7px] text-muted-foreground flex items-start gap-1">
            <span className="text-coaching">•</span>
            Limit idle time to &lt;5%
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
