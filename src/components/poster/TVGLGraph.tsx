import { useRef, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TVGLNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface TVGLEdge {
  source: string;
  target: string;
  strength: number;
  anomaly: boolean;
}

const nodes: TVGLNode[] = [
  { id: 'speed', label: 'Speed', x: 0.5, y: 0.15, color: '#00D4FF' },
  { id: 'rpm', label: 'RPM', x: 0.85, y: 0.35, color: '#00FF41' },
  { id: 'maf', label: 'MAF', x: 0.85, y: 0.65, color: '#FF6B35' },
  { id: 'load', label: 'Load', x: 0.5, y: 0.85, color: '#9D4EDD' },
  { id: 'ac', label: 'AC', x: 0.15, y: 0.65, color: '#FFD60A' },
  { id: 'temp', label: 'Temp', x: 0.15, y: 0.35, color: '#00D4FF' },
];

interface TVGLGraphProps {
  anomalyActive?: boolean;
  className?: string;
}

export default function TVGLGraph({ anomalyActive = false, className }: TVGLGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [edges, setEdges] = useState<TVGLEdge[]>([]);
  const timeRef = useRef(0);

  // Generate dynamic edges
  useEffect(() => {
    const generateEdges = () => {
      const newEdges: TVGLEdge[] = [];
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.3) {
            const isAnomaly = anomalyActive && Math.random() > 0.8;
            newEdges.push({
              source: nodes[i].id,
              target: nodes[j].id,
              strength: 0.3 + Math.random() * 0.7,
              anomaly: isAnomaly,
            });
          }
        }
      }
      
      setEdges(newEdges);
    };

    generateEdges();
    const interval = setInterval(generateEdges, 4000);
    return () => clearInterval(interval);
  }, [anomalyActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.016;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      edges.forEach((edge, index) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return;

        const x1 = sourceNode.x * width;
        const y1 = sourceNode.y * height;
        const x2 = targetNode.x * width;
        const y2 = targetNode.y * height;

        // Animated opacity
        const pulse = Math.sin(timeRef.current * 2 + index * 0.5) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        if (edge.anomaly) {
          // Anomaly edge - red pulsing
          const anomalyPulse = Math.sin(timeRef.current * 5) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(255, 56, 56, ${0.5 + anomalyPulse * 0.5})`;
          ctx.lineWidth = 2 + anomalyPulse * 2;
        } else {
          ctx.strokeStyle = `rgba(0, 212, 255, ${edge.strength * pulse * 0.6})`;
          ctx.lineWidth = edge.strength * 2;
        }
        
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const x = node.x * width;
        const y = node.y * height;
        const pulse = Math.sin(timeRef.current * 2 + index * 0.8) * 0.3 + 0.7;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, 15 + pulse * 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Core node
        ctx.beginPath();
        ctx.arc(x, y, 6 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.font = '10px Inter';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y + 25);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [edges]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <motion.div 
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay label */}
      <div className="absolute top-2 left-2 text-[10px] font-fira text-muted-foreground">
        Time-Varying Graphical Lasso
      </div>
    </motion.div>
  );
}
