'use client'

import { Html, useProgress } from '@react-three/drei'
import { PacmanLoader } from 'react-spinners'

const Loader = () => {
  const { progress } = useProgress()

  return (
    <Html>
      <div
        style={{
          // position: 'fixed',
          // top: 0,
          // left: 0,
          // width: '100vw',
          // height: '100vh',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 400,
          textAlign: 'center',
        }}
      >
        <PacmanLoader size={20} color='white' />
        <div>{progress.toFixed(0)}% Loaded</div>
      </div>
    </Html>
  )
}

export default Loader
