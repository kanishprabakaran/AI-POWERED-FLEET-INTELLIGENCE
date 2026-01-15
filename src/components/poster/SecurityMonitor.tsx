import { motion } from 'framer-motion';
import { SecurityStatus } from '@/hooks/useSimulatedData';
import TVGLGraph from './TVGLGraph';
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, 
  Link, Database, FileText, Hash, Lock
} from 'lucide-react';

interface SecurityMonitorProps {
  security: SecurityStatus;
  className?: string;
}

const statusConfig = {
  normal: { icon: CheckCircle, color: 'text-secondary', label: 'Normal' },
  verified: { icon: CheckCircle, color: 'text-secondary', label: 'Verified' },
  unusual: { icon: AlertTriangle, color: 'text-warning', label: 'Unusual' },
  tamper: { icon: XCircle, color: 'text-destructive', label: 'Tamper Suspected' },
};

export default function SecurityMonitor({ security, className }: SecurityMonitorProps) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const mockHash = '0x7a9f2c' + Math.random().toString(16).slice(2, 6) + '...';

  return (
    <motion.div 
      className={`glass-card-purple p-3 h-full flex flex-col ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-accent animate-pulse" />
        <span className="text-xs font-rajdhani font-bold text-accent uppercase tracking-wider">
          TVGL Anomaly Detection
        </span>
      </div>
      <div className="text-[8px] text-muted-foreground mb-2">Time-Varying Graphical Lasso</div>

      {/* TVGL Graph Visualization */}
      <div className="h-24 mb-2 rounded-lg overflow-hidden border border-accent/20 bg-black/50">
        <TVGLGraph anomalyActive={security.rpmPattern === 'tamper' || security.mafLoadCorrelation === 'unusual'} />
      </div>

      {/* Technical Details */}
      <div className="text-[7px] text-muted-foreground mb-2 font-fira">
        📐 Sparse Inverse-Covariance Matrix<br/>
        Learning time-varying sensor dependencies
      </div>

      {/* Anomaly Status Panel */}
      <div className="mb-2">
        <div className="text-[9px] text-muted-foreground mb-1 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Anomaly Flags
        </div>
        
        <div className="space-y-1">
          <StatusRow 
            label="Sensor Dependencies" 
            status={security.sensorDependencies} 
            delay={1.2}
          />
          <StatusRow 
            label="Data Consistency" 
            status={security.dataConsistency} 
            delay={1.25}
          />
          <StatusRow 
            label="MAF-Load Correlation" 
            status={security.mafLoadCorrelation} 
            delay={1.3}
          />
          <StatusRow 
            label="RPM Pattern" 
            status={security.rpmPattern} 
            delay={1.35}
          />
        </div>
      </div>

      {/* Tamper-Evident Logs */}
      <motion.div
        className="flex-1 glass-card-orange p-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3 h-3 text-warning" />
          <span className="text-[8px] font-semibold text-warning">Tamper-Evident Logs</span>
        </div>
        
        <div className="space-y-1 mb-2">
          <LogCheck 
            icon={Lock} 
            label="Hash Chain Integrity" 
            checked={security.hashChainIntegrity} 
          />
          <LogCheck 
            icon={Link} 
            label="Blockchain Anchor" 
            checked={security.blockchainAnchor} 
          />
          <LogCheck 
            icon={Database} 
            label="Immutable Audit Trail" 
            checked={security.immutableAuditTrail} 
          />
        </div>

        {/* Log Entry Preview - Terminal Style */}
        <div className="bg-black/60 rounded p-1.5 font-fira text-[7px] border border-border/30">
          <div className="text-muted-foreground">&gt; {timestamp}</div>
          <div className="text-primary">&gt; Event: Data Window Logged</div>
          <div className="text-accent">&gt; Hash: {mockHash}</div>
          <div className="text-secondary">&gt; Status: Logged & Verified</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface StatusRowProps {
  label: string;
  status: 'normal' | 'verified' | 'unusual' | 'tamper';
  delay: number;
}

function StatusRow({ label, status, delay }: StatusRowProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex items-center justify-between px-1.5 py-1 rounded bg-muted/20"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <span className="text-[8px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color} ${status === 'tamper' ? 'animate-pulse' : ''}`} />
        <span className={`text-[7px] font-semibold ${config.color}`}>{config.label}</span>
      </div>
    </motion.div>
  );
}

interface LogCheckProps {
  icon: React.ElementType;
  label: string;
  checked: boolean;
}

function LogCheck({ icon: Icon, label, checked }: LogCheckProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-2.5 h-2.5 text-warning" />
      <span className="text-[7px] text-muted-foreground flex-1">{label}</span>
      <span className={`text-[8px] font-bold ${checked ? 'text-secondary' : 'text-destructive'}`}>
        {checked ? '✓' : '✗'}
      </span>
    </div>
  );
}
