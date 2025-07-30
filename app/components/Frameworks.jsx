'use client'

import { OrbitingCircles } from './OrbitingCircles'
import { IconCloud } from './IconCloud'

export function Frameworks() {
  const skills = [
    'auth0',
    'css3',
    'git',
    'html5',
    'javascript',
    'microsoft',
    'react',
    'tailwindcss',
    'vitejs',
    'nextjs',
    'azure',
    'stripe',
    'github',
    'threejs',
    'puppeteer',
    'shopify',
  ]

  const images = skills.map((skill, index) => `assets/logos/${skill}.svg`)
  console.log(images)

  return (
    <div className='relative flex h-[15rem] w-full flex-col items-center justify-center'>
      <IconCloud images={images} />
      {/* <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {skills.reverse().map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles> */}
    </div>
  )
}

const Icon = ({ src }) => (
  <img src={src} className='duration-200 rounded-sm hover:scale-110' />
)
