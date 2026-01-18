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
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function AnimatedPoster() {
  const data = useSimulatedData(2000);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  }, []);

  // Keyboard shortcut (F key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      // ESC is handled automatically by browser
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [toggleFullscreen]);

  return (
    <div className="w-screen h-screen bg-background overflow-hidden relative">
      {/* Fullscreen toggle button */}
      <motion.button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 glass-card hover:bg-primary/20 transition-colors group"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        title="Press F for fullscreen"
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5 text-primary group-hover:text-foreground transition-colors" />
        ) : (
          <Maximize2 className="w-5 h-5 text-primary group-hover:text-foreground transition-colors" />
        )}
      </motion.button>

      {/* Keyboard hint */}
      <motion.div
        className="absolute top-4 right-16 z-50 text-[10px] text-muted-foreground font-fira"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-primary">F</kbd> for fullscreen
      </motion.div>

      {/* Aspect ratio container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: '0.5%' }}
      >
        <div 
          className="relative w-full h-full overflow-hidden"
          style={{ 
            aspectRatio: '16/9',
            maxWidth: 'min(100%, calc((100vh - 1%) * 16 / 9))',
            maxHeight: 'min(100%, calc((100vw - 1%) * 9 / 16))',
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0">
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            
            {/* Radial gradient for depth */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, rgba(0,212,255,0.02) 0%, transparent 60%)',
              }}
            />

            {/* Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
              }}
            />
          </div>

          {/* Main content grid */}
          <div className="relative z-10 h-full flex flex-col p-3">
            
            {/* HEADER - 10% */}
            <Header className="h-[10%] flex-shrink-0" />
            
            {/* MAIN FLOW - 78% */}
            <main className="h-[78%] flex-1 flex gap-1 py-1">
              
              {/* Stage 1: Vehicle Data Collection - 14% */}
              <motion.section 
                className="w-[14%] flex flex-col"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-[9px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
                  🚗 Vehicle Data
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-[45%] glass-card overflow-hidden">
                    <Vehicle3D />
                  </div>
                  <SensorInputCard sensors={data.sensors} className="flex-1" />
                </div>
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#00D4FF" className="w-[1.5%]" />

              {/* Stage 2: ML Inference Engine - 17% */}
              <motion.section 
                className="w-[17%] flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-[9px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
                  🤖 ML Inference
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-[40%] glass-card-blue overflow-hidden">
                    <NeuralNetwork3D />
                  </div>
                  <MLOutputCard predictions={data.predictions} className="flex-1" />
                </div>
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#34B253" className="w-[1.5%]" />

              {/* Stage 3: Behavior Analysis - 26% (LARGEST) */}
              <motion.section 
                className="w-[26%] flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="text-[9px] font-rajdhani font-bold text-primary uppercase tracking-wider text-center mb-1">
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
              <DataFlowConnector color="#FFD60A" className="w-[1.5%]" />

              {/* Stage 4: Driver Coaching - 17% */}
              <motion.section 
                className="w-[17%] flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-[9px] font-rajdhani font-bold text-coaching uppercase tracking-wider text-center mb-1">
                  👤 Driver Coaching
                </div>
                <CoachingPanel 
                  coaching={data.coaching}
                  predictions={data.predictions}
                  className="flex-1"
                />
              </motion.section>

              {/* Connector */}
              <DataFlowConnector color="#9D4EDD" className="w-[1.5%]" />

              {/* Stage 5: Security & Anomaly - 17% */}
              <motion.section 
                className="w-[17%] flex flex-col"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="text-[9px] font-rajdhani font-bold text-accent uppercase tracking-wider text-center mb-1">
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
