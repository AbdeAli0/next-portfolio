// import { useMemo } from 'react'
// import * as THREE from 'three'
// import { useThree } from '@react-three/fiber'

// const Ground = (props) => {
//   const size = 2.5

//   const texture = useMemo(() => {
//     const canvasSize = 512
//     const canvas = document.createElement('canvas')
//     canvas.width = canvas.height = canvasSize
//     const ctx = canvas.getContext('2d')

//     const gradient = ctx.createRadialGradient(
//       canvasSize / 2,
//       canvasSize / 2,
//       canvasSize / 4,
//       canvasSize / 2,
//       canvasSize / 2,
//       canvasSize / 2
//     )
//     gradient.addColorStop(0, 'rgba(1, 4, 13, 1)')
//     gradient.addColorStop(1, 'rgba(1, 4, 13, 0)')
//     ctx.fillStyle = gradient
//     ctx.fillRect(0, 0, canvasSize, canvasSize)

//     const tex = new THREE.CanvasTexture(canvas)
//     tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
//     return tex
//   }, [])

//   return (
//     <mesh
//       rotation={[-Math.PI / 2, 0, 0]}
//       scale={props.scale || 1}
//       position={props.position || [1.5, -0.8, 0]}
//       receiveShadow
//     >
//       <circleGeometry args={[size, 64]} />
//       <meshStandardMaterial
//         map={texture}
//         transparent
//         opacity={0.5}
//         depthWrite={true}
//       />
//     </mesh>
//   )
// }

// export default Ground

import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

const Ground = (props) => {
  const { viewport, camera } = useThree()
  const size = useMemo(() => {
    const distance = camera.position.y
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
    const width = height * viewport.aspect
    return Math.max(width, height) * 1.5
  }, [viewport, camera])

  const texture = useMemo(() => {
    const canvasSize = 512
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = canvasSize
    const ctx = canvas.getContext('2d')

    // Draw gradient
    const gradient = ctx.createRadialGradient(
      canvasSize / 2,
      canvasSize / 2,
      canvasSize / 4,
      canvasSize / 2,
      canvasSize / 2,
      canvasSize / 2
    )
    gradient.addColorStop(0, 'rgba(1, 4, 13, 1)')
    gradient.addColorStop(1, 'rgba(1, 4, 13, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Overlay checks
    const squareSize = 32
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)' // subtle white
    for (let y = 0; y < canvasSize; y += squareSize) {
      for (let x = 0; x < canvasSize; x += squareSize) {
        if ((x / squareSize + y / squareSize) % 2 === 0) {
          ctx.fillRect(x, y, squareSize, squareSize)
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={props.position || [0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={['15', '15']} />
      {/* <circleGeometry args={[size, 128]} /> */}
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={1}
        depthWrite={true}
      />
    </mesh>
  )
}

export default Ground
