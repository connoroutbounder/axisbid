'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

function SamplePart() {
  return (
    <group>
      {/* Simple bracket shape */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1, 0.5]} />
        <meshStandardMaterial color="#2E86C1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Vertical support */}
      <mesh position={[0.5, -0.75, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#2E86C1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Additional detail */}
      <mesh position={[-0.5, -0.75, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#2E86C1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hole simulation (using a cylinder cutout) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 32]} />
        <meshStandardMaterial color="#1B3A5C" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export function PartViewer() {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, 10]} intensity={0.5} />

          <Grid
            args={[10, 10]}
            cellSize={0.5}
            cellColor="#444444"
            sectionSize={5}
            sectionColor="#888888"
            fadeDistance={30}
            fadeStrength={1}
            infiniteGrid
          />

          <SamplePart />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
