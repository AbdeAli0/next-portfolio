'use client'

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import * as THREE from 'three'

const jokes = [
  'Why don’t astronauts get hungry after being blasted into space? Because they’ve just had a big launch!',
  'I asked the astronaut if he wanted to hang out. He said he needed space.',
  'The moon broke up with Earth. She said he didn’t have enough space.',
  'Why did the drone bring toilet paper? It was doing a fly-by.',
  'That’s no moon… oh wait, yes it is.',
  'I was going to tell you a joke about space, but I forgot the punch line.',
  'This guy think he is smart...😎',
  'I am so tired of hanging in air i want some rest now',
  'I’ve been hovering like a budget drone on low battery—somebody land me before I auto-crash into existential crisis!',
  'I’m not lazy—I’m just in hover mode.',
  'I came, I flew, I crashed—classic.',
  'My battery’s not dead, it’s just emotionally drained.',
  'I take things to new heights… then forget where I left them.',
  'My life’s a constant struggle between altitude and attitude.',
  'I don’t have trust issues, I have signal issues.',
  "I wanted to be free, but GPS said 'return to home.'",
  'I’m basically a flying selfie stick with commitment issues.',
  "They said 'sky’s the limit'—so I hit a tree.",
  "I'm not lost, I'm just exploring restricted airspace.",
]

export function Drone(props) {
  const [a, b, c] = props.position ? [...props.position] : [1.5, 0.5, 0]

  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/buster_drone.glb')
  const { actions, names } = useAnimations(animations, group)
  const targetPosition = useRef(new THREE.Vector3(a, b, c))

  const [hovered, setHovered] = useState(false)
  const [randomJoke, setRandomJoke] = useState('')
  const showTimeout = useRef()
  const hideTimeout = useRef()

  const originalPositions = useRef(new Map())
  const [isScattered, setIsScattered] = useState(false)
  const scatteringStarted = useRef(false)

  useEffect(() => {
    if (!actions || names.length === 0) return
    const action = actions[names[0]]
    const mixer = action.getMixer()
    let direction = 1

    action.reset()
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.timeScale = direction
    action.play()

    const onFinished = () => {
      direction *= -1
      action.paused = false
      action.timeScale = direction
      if (direction === -1) {
        action.time = action.getClip().duration
      } else {
        action.reset()
      }
      action.play()
    }

    mixer.addEventListener('finished', onFinished)
    return () => mixer.removeEventListener('finished', onFinished)
  }, [actions, names])

  useLayoutEffect(() => {
    if (nodes.Env) nodes.Env.visible = false
  }, [nodes])

  useEffect(() => {
    if (!group.current) return

    if (!group.current || scatteringStarted.current) return
    scatteringStarted.current = true
    setIsScattered(true)

    group.current.traverse((child) => {
      // if (child.isMesh) {
      //   console.log(child)
      // }
      if (child.name === 'Drone_ILens_body_0') {
        const offset = new THREE.Vector3(0, 0, 1.2)
        child.position.add(offset)
      } else if (child.name === '1') {
        const offset = new THREE.Vector3(0, 0, -1.5)
        child.position.add(offset)
      }
    })

    group.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (!originalPositions.current.has(child.uuid)) {
          originalPositions.current.set(child.uuid, child.position.clone())
        }
      }
    })
  }, [])

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.transparent = false
      material.opacity = 1
      material.depthWrite = true
      material.alphaTest = 0.5
    })
  }, [materials])

  useEffect(() => {
    const interval = setInterval(() => {
      const newX = (Math.random() - 0.5) * 4
      const newZ = (Math.random() - 0.5) * 4
      targetPosition.current.set(newX, 0.5, newZ)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (!group.current) return
    group.current.position.lerp(targetPosition.current, 0.01)

    group.current.traverse((child) => {
      if (
        child.isMesh &&
        originalPositions.current.has(child.uuid) &&
        !isScattered
      ) {
        const original = originalPositions.current.get(child.uuid)
        child.position.lerp(original, 0.1)
      }
    })
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()

    showTimeout.current = setTimeout(() => {
      setRandomJoke(jokes[Math.floor(Math.random() * jokes.length)])
      setHovered(true)

      hideTimeout.current = setTimeout(() => {
        setHovered(false)
      }, 10000)
    }, 1000)
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    clearTimeout(showTimeout.current)
    clearTimeout(hideTimeout.current)
    setHovered(false)
  }

  const scatterParts = () => {
    if (!group.current || scatteringStarted.current) return
    scatteringStarted.current = true
    setIsScattered(true)

    group.current.traverse((child) => {
      // if (child.isMesh) {
      //   console.log(child)
      // }
      if (child.name === '1' || child.name === 'Drone_ILens_body_0') {
        const offset = new THREE.Vector3(0, 0, -2)
        child.position.add(offset)
      }
    })
  }

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={props.scale || 1}
      position={props.position || [1.5, 0.5, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={scatterParts}
    >
      <group name='Sketchfab_Scene'>
        <group
          name='Sketchfab_model'
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.013, 0.013, 0.013]}
        >
          <group name='BusterDronefbx' rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={nodes.Object_2} />
          </group>
        </group>
      </group>

      {hovered && (
        <Html distanceFactor={10}>
          <div
            className='backdrop-blur-lg text-neutral-400'
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '6px 12px',
              borderRadius: '8px',
              width: '200px',
              fontSize: '0.8rem',
            }}
          >
            {randomJoke}
          </div>
        </Html>
      )}
    </group>
  )
}

useGLTF.preload('/models/buster_drone.glb')
