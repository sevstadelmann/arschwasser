import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Standard Khronos Rubber Duck GLB
const DUCK_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

// Preload to ensure it's ready for the animation
useGLTF.preload(DUCK_URL);

function DuckModel() {
  const { scene } = useGLTF(DUCK_URL);
  const clone = useMemo(() => scene.clone(), [scene]);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 4; 
    }
  });

  return (
    <group ref={ref}>
       <Center>
          <primitive object={clone} scale={2.5} /> 
       </Center>
    </group>
  );
}

export const Loader: React.FC = () => {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // When progress hits 100%, fade out with requested 300ms delay
    if (progress === 100) {
       const timer = setTimeout(() => {
         setShow(false);
       }, 300);
       return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="w-48 h-48 md:w-64 md:h-64 relative">
                <Canvas camera={{ position: [0, 1, 5], fov: 50 }} style={{ background: 'transparent' }}>
                    <ambientLight intensity={2} />
                    <Environment preset="studio" />
                    <Suspense fallback={null}>
                        <DuckModel />
                    </Suspense>
                </Canvas>
            </div>
            <div className="absolute bottom-10 text-white font-bold tracking-widest animate-pulse">
                LOADING...
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};