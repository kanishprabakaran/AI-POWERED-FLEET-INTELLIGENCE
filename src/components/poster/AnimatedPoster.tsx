import { useSimulatedData } from '@/hooks/useSimulatedData';
import Header from './Header';
import Vehicle3D from './Vehicle3D';
import SensorInputCard from './SensorInputCard';
import NeuralNetwork3D from './NeuralNetwork3D';
import MLOutputCard from './MLOutputCard';
import BehaviorDashboard from './BehaviorDashboard';
import CoachingPanel from './CoachingPanel';
import SecurityMonitor from './SecurityMonitor';
import FooterMetrics from './FooterMetrics';
import DataFlowConnector from './DataFlowConnector';
import FloatingBadges from './FloatingBadges';
import { motion } from 'framer-motion';

export default function AnimatedPoster() {
  const data = useSimulatedData(2000);

  return (
    <div className="w-screen h-screen bg-background overflow-hidden relative">
      {/* Aspect ratio container - scales to fit viewport */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: '1%' }}
      >
        <div 
          className="relative w-full h-full max-w-[1920px] max-h-[1080px] overflow-hidden"
          style={{ 
            aspectRatio: '16/9',
            maxWidth: 'min(100%, calc((100vh - 2%) * 16 / 9))',
            maxHeight: 'min(100%, calc((100vw - 2%) * 9 / 16))',
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 scanlines vignette">
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
            
            {/* Radial gradient for depth */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.03) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Floating decorative badges */}
          <FloatingBadges />

          {/* Main content grid */}
          <div className="relative z-10 h-full flex flex-col p-4">
            
            {/* HEADER - 12% */}
            <Header className="h-[12%] flex-shrink-0" />
            
            {/* MAIN FLOW - 76% */}
            <main className="h-[76%] flex-1 flex gap-2 py-2">
              
              {/* Stage 1: Vehicle Data Collection - 15% */}
              <motion.section 
                className="w-[15%] flex flex-col gap-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-[10px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
                  🚗 Vehicle Data
                </div>
                <div className="flex-1 relative">
                  <Vehicle3D className="h-1/2" />
                  <SensorInputCard sensors={data.sensors} className="h-1/2" />
                </div>
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#00D4FF" className="w-[2%]" />

              {/* Stage 2: ML Inference Engine - 18% */}
              <motion.section 
                className="w-[18%] flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-[10px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
                  🤖 ML Inference
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-2/5">
                    <NeuralNetwork3D />
                  </div>
                  <MLOutputCard predictions={data.predictions} className="flex-1" />
                </div>
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#00FF41" className="w-[2%]" />

              {/* Stage 3: Behavior Analysis - 25% (LARGEST) */}
              <motion.section 
                className="w-[25%] flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="text-[10px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
                  📊 Behavior Analysis
                </div>
                <BehaviorDashboard 
                  behavior={data.behavior} 
                  scores={data.scores}
                  context={data.context}
                  className="flex-1"
                />
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#FFD60A" className="w-[2%]" />

              {/* Stage 4: Driver Coaching - 18% */}
              <motion.section 
                className="w-[18%] flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-[10px] font-rajdhani font-bold text-coaching uppercase tracking-wider text-center mb-1">
                  👤 Driver Coaching
                </div>
                <CoachingPanel 
                  coaching={data.coaching}
                  predictions={data.predictions}
                  className="flex-1"
                />
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#9D4EDD" className="w-[2%]" />

              {/* Stage 5: Security & Anomaly - 18% */}
              <motion.section 
                className="w-[18%] flex flex-col"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="text-[10px] font-rajdhani font-bold text-accent uppercase tracking-wider text-center mb-1">
                  🔒 Security Layer
                </div>
                <SecurityMonitor 
                  security={data.security}
                  className="flex-1"
                />
              </motion.section>
            </main>

            {/* FOOTER - 12% */}
            <FooterMetrics 
              fleet={data.fleet}
              system={data.system}
              className="h-[12%] flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
