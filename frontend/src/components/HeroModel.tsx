import React, { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, Center, Text, useGLTF, OrbitControls } from '@react-three/drei';

// Augment JSX namespace to include R3F intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

// In some React+TS configurations (React 18+), JSX is looked up in React.JSX
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

// --- Error Boundary for Model Loading ---
class ModelErrorBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("Failed to load GLTF model:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- GLTF Model Component ---
function GLTFCan(props: any) {
  // Loading arschwasser.glb as requested
  const { scene } = useGLTF('./arschwasser.glb');
  
  return <primitive object={scene} {...props} scale={1} rotation={[0, 0, 0]} />;
}

// --- Procedural Fallback Component ---
function ProceduralCan(props: any) {
  return (
    <group {...props}>
      {/* Can Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 3.8, 64]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Label Area */}
      <mesh position={[0, 0, 0]}>
         <cylinderGeometry args={[1.01, 1.01, 2.8, 64]} />
         <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Rims */}
      <mesh position={[0, 1.91, 0]}>
         <cylinderGeometry args={[1, 1, 0.05, 64]} />
         <meshStandardMaterial color="#E0E0E0" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, -1.91, 0]}>
         <cylinderGeometry args={[1, 1, 0.05, 64]} />
         <meshStandardMaterial color="#E0E0E0" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Label Text */}
      <group position={[0, 0, 1.02]}>
         <Text
            font="https://fonts.gstatic.com/s/anton/v23/1Ptgg87LROyAm0K08i4.woff"
            fontSize={0.55}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.6, 0]}
         >
            LEMON
         </Text>
         <Text
            font="https://fonts.gstatic.com/s/anton/v23/1Ptgg87LROyAm0K08i4.woff"
            fontSize={0.75}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.2, 0]}
            outlineWidth={0.02}
            outlineColor="#000000"
         >
            DROP
         </Text>
      </group>
    </group>
  );
}

// --- Main Component ---
export const HeroModel: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 30 }} 
        style={{ background: 'transparent' }}
        shadows
        dpr={[1, 2]}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={1.5} />
        <spotLight 
            position={[10, 10, 10]} 
            angle={0.2} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            shadow-bias={-0.0001}
        />
        <spotLight position={[-10, 0, -5]} intensity={1} color="#23C4D8" />
        <spotLight position={[0, -10, 5]} intensity={1} color="#FFD700" />
        
        {/* Environment adds realistic reflections */}
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={1} 
            floatingRange={[-0.1, 0.1]}
          >
            <Center>
               <ModelErrorBoundary fallback={<ProceduralCan />}>
                  <GLTFCan />
               </ModelErrorBoundary>
            </Center>
          </Float>
        </Suspense>
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={4} 
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
};