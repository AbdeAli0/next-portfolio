'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import HeroText from '../components/HeroText'
import ParallaxBackground from '../components/parallaxBackground'
import { Drone } from '../components/Drone'
import Ground from '../components/Ground'

import { Float, OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { easing } from 'maath'
import { Suspense, useState } from 'react'
import Loader from '../components/Loader'
import { Orbit } from 'next/font/google'

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 })
  const [enableOrbit, setEnableOrbit] = useState(false)

  return (
    <section className='flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space'>
      <HeroText />
      {/* <ParallaxBackground /> */}
      {!isMobile && (
        <div className='absolute top-20 right-8 z-50 text-white'>
          {/* <label className='flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded'>
          <input
            type='checkbox'
            checked={enableOrbit}
            onChange={() => setEnableOrbit(!enableOrbit)}
          />
          <span>Enable Orbit Controls</span>
        </label> */}

          <label className='inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              checked={enableOrbit}
              onChange={() => setEnableOrbit(!enableOrbit)}
              className='sr-only peer'
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-red-0 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-600"></div>
            <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
              Enable Orbit Controls
            </span>
          </label>
        </div>
      )}
      <figure
        className='absolute inset-0'
        style={{ width: '100vw', height: '100vh' }}
      >
        <Canvas shadows camera={{ position: [0, 1, 3] }}>
          {/* ✅ Add Lights Here */}
          <ambientLight intensity={2.5} />
          <directionalLight
            castShadow
            position={[0, 10, 0]} // directly above
            intensity={2.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          <hemisphereLight intensity={2.3} groundColor='black' />
          <pointLight position={[10, 10, 10]} intensity={2.8} />

          {/* <ambientLight intensity={0.8} />
          <pointLight position={[2, 5, 5]} intensity={3} /> */}
          <Suspense fallback={<Loader />}>
            <Float>
              <Drone scale={isMobile && 0.6} position={isMobile && [0, 0, 0]} />
            </Float>
            <Ground scale={isMobile && 0.6} position={isMobile && [0, -1, 0]} />
            {/* <Rig /> */}
            {enableOrbit && (
              <OrbitControls
                minDistance={4}
                maxDistance={8}
                // minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            )}
          </Suspense>
        </Canvas>
      </figure>
    </section>
  )
}

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    )
  })
}

export default Hero
