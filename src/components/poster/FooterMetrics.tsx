import { motion } from 'framer-motion';
import { FleetOverview, SystemHealth } from '@/hooks/useSimulatedData';
import { 
  Car, Fuel, IndianRupee, AlertTriangle, 
  Cpu, RefreshCw, Zap, TreeDeciduous, BarChart3, 
  Brain, Lock
} from 'lucide-react';

interface FooterMetricsProps {
  fleet: FleetOverview;
  system: SystemHealth;
  className?: string;
}

const techBadges = [
  { icon: TreeDeciduous, label: 'Random Forest' },
  { icon: BarChart3, label: 'TVGL' },
  { icon: Brain, label: 'ML Inference' },
  { icon: Lock, label: 'Crypto Logging' },
];

export default function FooterMetrics({ fleet, system, className }: FooterMetricsProps) {
  return (
    <motion.div 
      className={`flex items-center justify-between gap-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      {/* Left - Fleet Overview */}
      <div className="glass-card-blue px-3 py-1.5 flex items-center gap-3">
        <div className="text-[8px] font-rajdhani font-bold text-primary uppercase tracking-wider">
          Fleet
        </div>
        
        <div className="flex items-center gap-3">
          <FleetStat 
            icon={Car} 
            label="Active" 
            value={fleet.activeVehicles.toString()} 
            color="text-primary"
          />
          <FleetStat 
            icon={Fuel} 
            label="Avg KPL" 
            value={fleet.avgFleetKPL.toFixed(1)} 
            color="text-secondary"
          />
          <FleetStat 
            icon={IndianRupee} 
            label="Saved" 
            value={`₹${(fleet.monthlySavings / 100000).toFixed(1)}L`} 
            color="text-coaching"
          />
          <FleetStat 
            icon={AlertTriangle} 
            label="Alerts" 
            value={fleet.anomaliesToday.toString()} 
            color={fleet.anomaliesToday > 5 ? 'text-destructive' : 'text-warning'}
          />
        </div>
      </div>

      {/* Center - Tech Stack */}
      <div className="flex items-center gap-1.5">
        <span className="text-[7px] text-muted-foreground">Powered By:</span>
        {techBadges.map((badge, index) => (
          <motion.div
            key={badge.label}
            className="tech-badge flex items-center gap-1 py-1 px-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.6 + index * 0.05 }}
          >
            <badge.icon className="w-2.5 h-2.5 text-primary" />
            <span className="text-[7px] text-muted-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Right - System Status */}
      <div className="glass-card-green px-3 py-1.5 flex items-center gap-3">
        <SystemStat 
          icon={Zap} 
          label="Health" 
          value={`${system.uptime.toFixed(1)}%`} 
          color="text-secondary"
        />
        <SystemStat 
          icon={RefreshCw} 
          label="Freq" 
          value={`${system.updateFrequency}s`} 
          color="text-primary"
        />
        <SystemStat 
          icon={Cpu} 
          label="Latency" 
          value={`${Math.round(system.avgProcessingTime)}ms`} 
          color="text-muted-foreground"
        />
      </div>
    </motion.div>
  );
}

interface StatProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function FleetStat({ icon: Icon, label, value, color }: StatProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3 h-3 ${color}`} />
      <div>
        <div className="text-[6px] text-muted-foreground leading-none">{label}</div>
        <div className={`text-[10px] font-orbitron font-bold ${color} leading-none mt-0.5`}>{value}</div>
      </div>
    </div>
  );
}

function SystemStat({ icon: Icon, label, value, color }: StatProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-2.5 h-2.5 ${color}`} />
      <div>
        <div className="text-[5px] text-muted-foreground leading-none">{label}</div>
        <div className={`text-[9px] font-orbitron font-bold ${color} leading-none mt-0.5`}>{value}</div>
      </div>
    </div>
  );
}
