import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface SensorPoint {
  position: [number, number, number];
  label: string;
  color: string;
}

const sensorPoints: SensorPoint[] = [
  { position: [0, 0.3, 0.8], label: 'OBD-II', color: '#00D4FF' },
  { position: [-0.5, 0, 0.5], label: 'Speed', color: '#00FF41' },
  { position: [0.5, 0, 0.5], label: 'RPM', color: '#FF6B35' },
  { position: [-0.6, -0.1, 0], label: 'MAF', color: '#9D4EDD' },
  { position: [0.6, -0.1, 0], label: 'Load', color: '#FFD60A' },
  { position: [0, 0.2, -0.5], label: 'Temp', color: '#00D4FF' },
  { position: [0, -0.2, -0.6], label: 'Diag', color: '#00FF41' },
];

function CarModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Car body - simplified low-poly style */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#00D4FF"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Car cabin */}
      <mesh position={[0.1, 0.35, 0]}>
        <boxGeometry args={[0.9, 0.35, 0.7]} />
        <meshStandardMaterial 
          color="#0a0a15" 
          metalness={0.9} 
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wheels */}
      {[[-0.55, -0.25, 0.4], [-0.55, -0.25, -0.4], [0.55, -0.25, 0.4], [0.55, -0.25, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Headlights */}
      <pointLight position={[0.9, 0, 0.25]} color="#00D4FF" intensity={0.5} distance={2} />
      <pointLight position={[0.9, 0, -0.25]} color="#00D4FF" intensity={0.5} distance={2} />
    </group>
  );
}

function SensorPoints() {
  const pointsRef = useRef<THREE.Group>(null);

  return (
    <group ref={pointsRef}>
      {sensorPoints.map((sensor, index) => (
        <GlowingSensorPoint key={index} sensor={sensor} delay={index * 0.2} />
      ))}
    </group>
  );
}

function GlowingSensorPoint({ sensor, delay }: { sensor: SensorPoint; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + delay * 5) * 0.5 + 0.5;
      meshRef.current.scale.setScalar(0.8 + pulse * 0.4);
      glowRef.current.scale.setScalar(1.5 + pulse * 0.5);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + pulse * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <group position={sensor.position}>
        {/* Core point */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={sensor.color} />
        </mesh>
        
        {/* Glow effect */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial 
            color={sensor.color} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;

  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    const colorPalette = [
      new THREE.Color('#00D4FF'),
      new THREE.Color('#00FF41'),
      new THREE.Color('#FF6B35'),
      new THREE.Color('#9D4EDD'),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Start from random sensor point
      const sensorIndex = Math.floor(Math.random() * sensorPoints.length);
      const sensor = sensorPoints[sensorIndex];
      
      positions[i * 3] = sensor.position[0] + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = sensor.position[1] + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = sensor.position[2] + (Math.random() - 0.5) * 0.2;
      
      // Velocity pointing outward (to the right)
      velocities[i * 3] = 0.02 + Math.random() * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors, velocities };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Reset particle when it goes too far
        if (posArray[i * 3] > 2) {
          const sensorIndex = Math.floor(Math.random() * sensorPoints.length);
          const sensor = sensorPoints[sensorIndex];
          posArray[i * 3] = sensor.position[0];
          posArray[i * 3 + 1] = sensor.position[1];
          posArray[i * 3 + 2] = sensor.position[2];
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
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
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
      transition={{ duration: 1, delay: 0.2 }}
    >
      <Canvas
        camera={{ position: [2.5, 1.5, 2.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-2, 2, 2]} color="#00D4FF" intensity={0.3} />
        <pointLight position={[2, -2, -2]} color="#9D4EDD" intensity={0.2} />
        
        <CarModel />
        <SensorPoints />
        <DataParticles />
      </Canvas>
    </motion.div>
  );
}
