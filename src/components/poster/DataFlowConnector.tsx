import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DataFlowConnectorProps {
  children?: ReactNode;
  className?: string;
  color?: string;
  direction?: 'right' | 'down';
}

export default function DataFlowConnector({ 
  children, 
  className, 
  color = '#00D4FF',
  direction = 'right'
}: DataFlowConnectorProps) {
  const isHorizontal = direction === 'right';
  
  return (
    <div className={`relative flex ${isHorizontal ? 'flex-col items-center justify-center' : 'flex-row items-center justify-center'} ${className}`}>
      {/* Connection line */}
      <svg 
        className={`${isHorizontal ? 'w-full h-4' : 'h-full w-4'} overflow-visible`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`flow-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Main line */}
        {isHorizontal ? (
          <line 
            x1="0" 
            y1="8" 
            x2="100%" 
            y2="8" 
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        ) : (
          <line 
            x1="8" 
            y1="0" 
            x2="8" 
            y2="100%" 
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        )}
      </svg>

      {/* Animated particles */}
      <div className={`absolute ${isHorizontal ? 'inset-x-0 top-1/2 -translate-y-1/2 h-2' : 'inset-y-0 left-1/2 -translate-x-1/2 w-2'} overflow-hidden`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              background: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            }}
            animate={isHorizontal ? {
              x: ['-10%', '110%'],
              opacity: [0, 1, 1, 0],
            } : {
              y: ['-10%', '110%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Arrow head */}
      <div 
        className={`absolute ${isHorizontal ? 'right-0 top-1/2 -translate-y-1/2' : 'bottom-0 left-1/2 -translate-x-1/2'}`}
        style={{ color }}
      >
        {isHorizontal ? (
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
            <path d="M0 0L8 6L0 12V0Z" />
          </svg>
        ) : (
          <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
            <path d="M0 0L6 8L12 0H0Z" />
          </svg>
        )}
      </div>

      {children}
    </div>
  );
}

// Stage labels that appear along the flow
interface StageIndicatorProps {
  stage: number;
  label: string;
  icon: string;
  color: string;
  className?: string;
}

export function StageIndicator({ stage, label, icon, color, className }: StageIndicatorProps) {
  return (
    <motion.div 
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 + stage * 0.1 }}
    >
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-lg mb-1"
        style={{ 
          background: `${color}20`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 15px ${color}40`
        }}
      >
        {icon}
      </div>
      <span className="text-[8px] text-muted-foreground text-center leading-tight max-w-[60px]">
        {label}
      </span>
    </motion.div>
  );
}
