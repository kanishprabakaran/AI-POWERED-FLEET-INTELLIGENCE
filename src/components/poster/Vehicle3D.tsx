import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Simplified car with better visual impact
function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    // Rotate wheels
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.x += 0.05;
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Car body - sleek design */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.4, 0.35, 0.6]} />
        <meshStandardMaterial 
          color="#0a1628" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00D4FF"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Car cabin */}
      <mesh position={[0.05, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.5]} />
        <meshStandardMaterial 
          color="#051020" 
          metalness={0.95} 
          roughness={0.05}
          transparent
          opacity={0.9}
          emissive="#00D4FF"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Hood slope */}
      <mesh position={[0.5, 0.22, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.4, 0.1, 0.55]} />
        <meshStandardMaterial 
          color="#0a1628" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00D4FF"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Wheels with glow */}
      {[[-0.4, -0.05, 0.35], [-0.4, -0.05, -0.35], [0.4, -0.05, 0.35], [0.4, -0.05, -0.35]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh 
            ref={(el) => { if (el) wheelsRef.current[i] = el; }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Wheel rim glow */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.015, 8, 16]} />
            <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[0.7, 0.15, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh position={[0.7, 0.15, -0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      
      {/* Headlight glow */}
      <pointLight position={[0.8, 0.15, 0.2]} color="#00D4FF" intensity={0.8} distance={1.5} />
      <pointLight position={[0.8, 0.15, -0.2]} color="#00D4FF" intensity={0.8} distance={1.5} />

      {/* Taillights */}
      <mesh position={[-0.7, 0.15, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FF3838" />
      </mesh>
      <mesh position={[-0.7, 0.15, -0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FF3838" />
      </mesh>

      {/* Data emission points */}
      <DataEmissionPoints />
    </group>
  );
}

function DataEmissionPoints() {
  const pointsRef = useRef<THREE.Group>(null);

  const emissionPoints = [
    { pos: [0, 0.55, 0], color: '#00D4FF' }, // Top sensor
    { pos: [0.6, 0.15, 0], color: '#34B253' }, // Front sensor
    { pos: [-0.6, 0.15, 0], color: '#FF6B35' }, // Rear sensor
  ];

  return (
    <group ref={pointsRef}>
      {emissionPoints.map((point, i) => (
        <EmissionPoint key={i} position={point.pos as [number, number, number]} color={point.color} delay={i * 0.3} />
      ))}
    </group>
  );
}

function EmissionPoint({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current && coreRef.current) {
      const pulse = (Math.sin(state.clock.elapsedTime * 3 + delay * 5) + 1) / 2;
      ringRef.current.scale.setScalar(1 + pulse * 0.5);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 - pulse * 0.2;
      coreRef.current.scale.setScalar(0.8 + pulse * 0.3);
    }
  });

  return (
    <group position={position}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.01, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Streaming data particles
function StreamingData() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 30;

  const { positions, colors, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    const colorPalette = [
      new THREE.Color('#00D4FF'),
      new THREE.Color('#34B253'),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Start near the car
      positions[i * 3] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = Math.random() * 0.3 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      
      velocities[i] = 0.02 + Math.random() * 0.02;
      lifetimes[i] = Math.random();
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors, velocities, lifetimes };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        lifetimes[i] += 0.01;
        
        // Move right (data flowing out)
        posArray[i * 3] += velocities[i];
        posArray[i * 3 + 1] += Math.sin(lifetimes[i] * 5) * 0.002;
        
        // Reset when off screen
        if (posArray[i * 3] > 1.5) {
          posArray[i * 3] = (Math.random() - 0.5) * 0.3;
          posArray[i * 3 + 1] = Math.random() * 0.3 + 0.2;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
          lifetimes[i] = 0;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

interface Vehicle3DProps {
  className?: string;
}

export default function Vehicle3D({ className }: Vehicle3DProps) {
  return (
    <motion.div 
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Canvas
        camera={{ position: [2, 1.2, 2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />
        <pointLight position={[-2, 1, 1]} color="#00D4FF" intensity={0.4} />
        <pointLight position={[2, 1, -1]} color="#9D4EDD" intensity={0.3} />
        
        <CarModel />
        <StreamingData />
      </Canvas>
    </motion.div>
  );
}
