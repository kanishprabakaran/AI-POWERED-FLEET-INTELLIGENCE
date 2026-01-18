import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface NeuralNodeData {
  position: [number, number, number];
  layer: 'input' | 'hidden' | 'output';
  color: string;
}

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Define network structure
  const inputNodes = 6;
  const hiddenNodes = 8;
  const outputNodes = 4;
  
  const nodes: NeuralNodeData[] = useMemo(() => {
    const result: NeuralNodeData[] = [];
    
    // Input layer
    for (let i = 0; i < inputNodes; i++) {
      const y = (i - (inputNodes - 1) / 2) * 0.35;
      result.push({ position: [-1.2, y, 0], layer: 'input', color: '#00D4FF' });
    }
    
    // Hidden layer
    for (let i = 0; i < hiddenNodes; i++) {
      const y = (i - (hiddenNodes - 1) / 2) * 0.3;
      result.push({ position: [0, y, 0], layer: 'hidden', color: '#9D4EDD' });
    }
    
    // Output layer
    for (let i = 0; i < outputNodes; i++) {
      const y = (i - (outputNodes - 1) / 2) * 0.4;
      result.push({ position: [1.2, y, 0], layer: 'output', color: '#34B253' });
    }
    
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <NetworkConnections nodes={nodes} inputNodes={inputNodes} hiddenNodes={hiddenNodes} outputNodes={outputNodes} />
      
      {/* Nodes */}
      {nodes.map((node, index) => (
        <NeuralNode key={index} node={node} index={index} />
      ))}
    </group>
  );
}

function NeuralNode({ node, index }: { node: NeuralNodeData; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + index * 0.5) * 0.5 + 0.5;
      const firingChance = Math.sin(state.clock.elapsedTime * 0.5 + index) > 0.7;
      
      const scale = firingChance ? 1.2 + pulse * 0.3 : 0.8 + pulse * 0.2;
      meshRef.current.scale.setScalar(scale);
      glowRef.current.scale.setScalar(scale * 2);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = firingChance ? 0.4 + pulse * 0.3 : 0.1 + pulse * 0.1;
    }
  });

  return (
    <group position={node.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={node.color} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function NetworkConnections({ 
  nodes, 
  inputNodes, 
  hiddenNodes, 
  outputNodes 
}: { 
  nodes: NeuralNodeData[]; 
  inputNodes: number; 
  hiddenNodes: number;
  outputNodes: number;
}) {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    
    // Input to hidden connections
    for (let i = 0; i < inputNodes; i++) {
      for (let j = 0; j < hiddenNodes; j++) {
        if (Math.random() > 0.3) { // Sparse connections for visual clarity
          result.push({
            start: nodes[i].position,
            end: nodes[inputNodes + j].position,
            color: '#00D4FF',
          });
        }
      }
    }
    
    // Hidden to output connections
    for (let i = 0; i < hiddenNodes; i++) {
      for (let j = 0; j < outputNodes; j++) {
        if (Math.random() > 0.4) {
          result.push({
            start: nodes[inputNodes + i].position,
            end: nodes[inputNodes + hiddenNodes + j].position,
            color: '#9D4EDD',
          });
        }
      }
    }
    
    return result;
  }, [nodes, inputNodes, hiddenNodes, outputNodes]);

  return (
    <group ref={linesRef}>
      {connections.map((conn, index) => (
        <AnimatedConnection key={index} connection={conn} index={index} />
      ))}
    </group>
  );
}

function AnimatedConnection({ 
  connection, 
  index 
}: { 
  connection: { start: [number, number, number]; end: [number, number, number]; color: string };
  index: number;
}) {
  const lineRef = useRef<THREE.Line | null>(null);

  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...connection.start),
      new THREE.Vector3(...connection.end),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [connection]);

  useFrame((state) => {
    if (lineRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index * 0.3) * 0.5 + 0.5;
      const firing = Math.sin(state.clock.elapsedTime * 0.8 + index * 0.5) > 0.6;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = firing ? 0.5 + pulse * 0.4 : 0.1 + pulse * 0.1;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: connection.color, transparent: true, opacity: 0.2 }))} />
  );
}

// Flowing data particles through the network
function DataFlow() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 30;

  const { positions, colors, progress } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const progress = new Float32Array(particleCount);
    
    const color = new THREE.Color('#00D4FF');
    
    for (let i = 0; i < particleCount; i++) {
      progress[i] = Math.random();
      
      // Start position (will be updated in animation)
      positions[i * 3] = -1.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = 0;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors, progress };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colArray = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        progress[i] += 0.008;
        if (progress[i] > 1) {
          progress[i] = 0;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 2;
        }
        
        // Move from left to right
        posArray[i * 3] = -1.2 + progress[i] * 2.4;
        
        // Slight wave motion
        posArray[i * 3 + 2] = Math.sin(progress[i] * Math.PI * 2 + state.clock.elapsedTime) * 0.1;
        
        // Color transition: blue -> purple -> green
        if (progress[i] < 0.5) {
          const t = progress[i] * 2;
          colArray[i * 3] = 0 + t * 0.62; // R
          colArray[i * 3 + 1] = 0.83 - t * 0.52; // G
          colArray[i * 3 + 2] = 1 - t * 0.13; // B
        } else {
          const t = (progress[i] - 0.5) * 2;
          colArray[i * 3] = 0.62 - t * 0.62; // R
          colArray[i * 3 + 1] = 0.31 + t * 0.69; // G
          colArray[i * 3 + 2] = 0.87 - t * 0.62; // B
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
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

interface NeuralNetwork3DProps {
  className?: string;
}

export default function NeuralNetwork3D({ className }: NeuralNetwork3DProps) {
  return (
    <motion.div 
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[-3, 2, 2]} color="#00D4FF" intensity={0.4} />
        <pointLight position={[3, -2, 2]} color="#34B253" intensity={0.3} />
        
        <NeuralNetwork />
        <DataFlow />
      </Canvas>
    </motion.div>
  );
}
