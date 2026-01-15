import { motion } from 'framer-motion';

const floatingBadges = [
  { label: '🌳 Random Forest Regressor', top: '15%', left: '5%', delay: 0.5 },
  { label: '📊 Behavioral Vector', top: '25%', right: '3%', delay: 0.7 },
  { label: '🧮 Z-Score Analysis', bottom: '20%', left: '2%', delay: 0.9 },
  { label: '🔗 TVGL Graph Learning', top: '35%', right: '5%', delay: 1.1 },
  { label: '🎯 Context Classification', bottom: '30%', right: '2%', delay: 1.3 },
  { label: '📈 Rolling Window KPL', top: '45%', left: '3%', delay: 1.5 },
  { label: '🚦 Stop-Go Index', bottom: '15%', right: '6%', delay: 0.6 },
  { label: '⚠️ Tamper Detection', top: '55%', right: '3%', delay: 0.8 },
  { label: '🏆 Fleet-Best Baseline', bottom: '25%', left: '4%', delay: 1.0 },
  { label: '💾 VED Training Data', top: '65%', left: '2%', delay: 1.2 },
  { label: '🔐 Crypto Verification', bottom: '35%', right: '4%', delay: 1.4 },
  { label: '📉 CO₂ Tracking', top: '75%', right: '2%', delay: 1.6 },
];

interface FloatingBadgesProps {
  className?: string;
}

export default function FloatingBadges({ className }: FloatingBadgesProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {floatingBadges.map((badge, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: badge.top,
            left: badge.left,
            right: badge.right,
            bottom: badge.bottom,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.8, 1, 1, 0.9],
            y: [0, -5, 5, 0],
          }}
          transition={{
            duration: 8,
            delay: badge.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 5,
          }}
        >
          <div className="tech-badge text-[8px] whitespace-nowrap backdrop-blur-sm">
            {badge.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
