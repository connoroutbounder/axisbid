'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface PartViewerProps {
  fileName?: string
  geometry?: {
    boundingBox: { x: number; y: number; z: number }
    volume: number
    surfaceArea: number
    faces: number
    edges: number
  }
}

export default function PartViewer({ fileName, geometry }: PartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf4f6f8)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 150

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(100, 100, 100)
    scene.add(directionalLight)

    // Create a placeholder machined bracket part
    const geometry = new THREE.Group()

    // Main body (rectangular block)
    const bodyGeom = new THREE.BoxGeometry(100, 60, 40)
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    geometry.add(body)

    // Mounting holes (cylinders)
    const holeGeom = new THREE.CylinderGeometry(8, 8, 50, 32)
    const holeMat = new THREE.MeshPhongMaterial({ color: 0x333333 })

    // Top-left hole
    const hole1 = new THREE.Mesh(holeGeom, holeMat)
    hole1.position.set(-35, 20, 0)
    hole1.rotation.z = Math.PI / 2
    geometry.add(hole1)

    // Top-right hole
    const hole2 = new THREE.Mesh(holeGeom, holeMat)
    hole2.position.set(35, 20, 0)
    hole2.rotation.z = Math.PI / 2
    geometry.add(hole2)

    // Mounting flange
    const flangeGeom = new THREE.BoxGeometry(120, 8, 40)
    const flangeMat = new THREE.MeshPhongMaterial({ color: 0x9b8368 })
    const flange = new THREE.Mesh(flangeGeom, flangeMat)
    flange.position.set(0, -35, 0)
    geometry.add(flange)

    scene.add(geometry)

    // Animation
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      geometry.rotation.x += 0.003
      geometry.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-card p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {fileName ? 'Part Preview' : '3D Part Viewer'}
      </h3>
      <div
        ref={containerRef}
        className="w-full h-96 bg-brand-light-bg rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      {geometry && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-xs font-medium">X Dimension</p>
            <p className="text-brand-dark-blue font-semibold">{geometry.boundingBox.x.toFixed(1)} mm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-xs font-medium">Y Dimension</p>
            <p className="text-brand-dark-blue font-semibold">{geometry.boundingBox.y.toFixed(1)} mm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-xs font-medium">Z Dimension</p>
            <p className="text-brand-dark-blue font-semibold">{geometry.boundingBox.z.toFixed(1)} mm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-xs font-medium">Volume</p>
            <p className="text-brand-dark-blue font-semibold">{(geometry.volume / 1000).toFixed(0)} cm³</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-xs font-medium">Surface Area</p>
            <p className="text-brand-dark-blue font-semibold">{(geometry.surfaceArea / 100).toFixed(0)} cm²</p>
          </div>
        </div>
      )}
    </div>
  )
}
