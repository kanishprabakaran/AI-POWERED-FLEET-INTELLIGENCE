import { motion } from 'framer-motion';
import { Cpu, Radio } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <motion.header 
      className={`flex items-center justify-between px-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary-foreground" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary blur-lg opacity-50 -z-10" />
        </div>
        <div>
          <div className="text-sm font-rajdhani font-bold text-foreground">FLEET<span className="text-primary">AI</span></div>
          <div className="text-[8px] text-muted-foreground tracking-wider">INTELLIGENCE PLATFORM</div>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-2xl md:text-3xl font-rajdhani font-bold tracking-wide gradient-text-primary">
          AI-POWERED FLEET INTELLIGENCE & DRIVER COACHING SYSTEM
        </h1>
        <motion.p 
          className="text-xs text-muted-foreground mt-1 tracking-wider font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Real-Time ML Inference • Behavioral Analytics • Tamper Detection
        </motion.p>
      </motion.div>

      {/* Status Indicator */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 glass-card px-3 py-1.5">
          <Radio className="w-3 h-3 text-secondary animate-pulse" />
          <span className="text-[10px] font-orbitron text-secondary">LIVE</span>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-muted-foreground">Data Window</div>
          <div className="text-xs font-orbitron text-primary">60s</div>
        </div>
      </motion.div>
    </motion.header>
  );
}
