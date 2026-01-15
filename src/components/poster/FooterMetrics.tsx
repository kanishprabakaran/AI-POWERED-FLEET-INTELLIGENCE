import { motion } from 'framer-motion';
import { FleetOverview, SystemHealth } from '@/hooks/useSimulatedData';
import { 
  Car, Fuel, IndianRupee, AlertTriangle, 
  Cpu, RefreshCw, Zap, TreeDeciduous, BarChart3, 
  Shield, Brain, Cloud, Lock
} from 'lucide-react';

interface FooterMetricsProps {
  fleet: FleetOverview;
  system: SystemHealth;
  className?: string;
}

const techBadges = [
  { icon: TreeDeciduous, label: 'Random Forest' },
  { icon: BarChart3, label: 'TVGL Algorithm' },
  { icon: Brain, label: 'ML Inference' },
  { icon: Lock, label: 'Crypto Logging' },
  { icon: Cloud, label: 'Real-Time Analytics' },
];

export default function FooterMetrics({ fleet, system, className }: FooterMetricsProps) {
  return (
    <motion.div 
      className={`flex items-center justify-between gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      {/* Left - Fleet Overview */}
      <div className="glass-card-blue px-4 py-2 flex items-center gap-4">
        <div className="text-[9px] font-rajdhani font-bold text-primary uppercase tracking-wider">
          Fleet Overview
        </div>
        
        <div className="flex items-center gap-4">
          <FleetStat 
            icon={Car} 
            label="Active Vehicles" 
            value={fleet.activeVehicles.toString()} 
            color="text-primary"
          />
          <FleetStat 
            icon={Fuel} 
            label="Avg Fleet KPL" 
            value={fleet.avgFleetKPL.toFixed(1)} 
            color="text-secondary"
          />
          <FleetStat 
            icon={IndianRupee} 
            label="Monthly Savings" 
            value={`₹${(fleet.monthlySavings / 100000).toFixed(1)}L`} 
            color="text-coaching"
          />
          <FleetStat 
            icon={AlertTriangle} 
            label="Anomalies Today" 
            value={fleet.anomaliesToday.toString()} 
            color={fleet.anomaliesToday > 5 ? 'text-destructive' : 'text-warning'}
          />
        </div>
      </div>

      {/* Center - Tech Stack */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <span className="text-[8px] text-muted-foreground mr-2">Powered By:</span>
        {techBadges.map((badge, index) => (
          <motion.div
            key={badge.label}
            className="tech-badge flex items-center gap-1.5 hover:bg-primary/10 transition-colors cursor-default"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.6 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <badge.icon className="w-3 h-3 text-primary" />
            <span className="text-[8px] text-muted-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Right - System Status */}
      <div className="glass-card-green px-4 py-2 flex items-center gap-4">
        <SystemStat 
          icon={Zap} 
          label="System Health" 
          value={`${system.uptime.toFixed(1)}%`} 
          color="text-secondary"
        />
        <SystemStat 
          icon={RefreshCw} 
          label="Update Freq" 
          value={`${system.updateFrequency}s`} 
          color="text-primary"
        />
        <SystemStat 
          icon={Cpu} 
          label="Processing" 
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
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <div className="text-[7px] text-muted-foreground">{label}</div>
        <div className={`text-sm font-orbitron font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function SystemStat({ icon: Icon, label, value, color }: StatProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-3 h-3 ${color}`} />
      <div>
        <div className="text-[6px] text-muted-foreground">{label}</div>
        <div className={`text-[11px] font-orbitron font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}
