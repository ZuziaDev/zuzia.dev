'use client'

/**
 * Hero WebGL scene: one cloud of particles that holds four shapes and morphs between them as the
 * page scrolls — the Zuzia mark, a neural sphere, a burner ring with a live flame, then open dust.
 * Colour comes from the active flame pair (--primary / --heat), so it follows the settings panel.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { useTheme } from '@/lib/theme-context'
import { LOGO_URL } from '@/lib/site'

const vertexShader = /* glsl */ `
  attribute vec3 aLogo;
  attribute vec3 aSphere;
  attribute vec3 aRing;
  attribute vec3 aScatter;
  attribute float aSeed;

  uniform float uTime;
  uniform float uProgress;   // 0 logo, 1 sphere, 2 ring, 3 dust
  uniform float uSize;
  uniform float uIntro;      // 0..1 assemble on load
  uniform vec2 uPointer;

  varying float vHeat;
  varying float vAlpha;

  float stage(float edge, float seed) {
    // each particle leaves a little earlier or later than its neighbours
    float t = clamp((uProgress - edge - seed * 0.45) / 0.55, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float s1 = stage(0.0, aSeed);
    float s2 = stage(1.0, aSeed);
    float s3 = stage(2.0, aSeed);

    vec3 p = mix(aLogo, aSphere, s1);
    p = mix(p, aRing, s2);
    p = mix(p, aScatter, s3);

    // assemble from dust on first paint
    p = mix(aScatter * 1.4, p, uIntro);

    // the sphere breathes
    float sphereAmt = s1 * (1.0 - s2);
    p += normalize(aSphere + 0.0001) * sin(uTime * 0.9 + aSeed * 31.0) * 0.045 * sphereAmt;

    // the ring burns: particles lick upward and fall back
    float ringAmt = s2 * (1.0 - s3);
    float lick = fract(uTime * (0.35 + aSeed * 0.5) + aSeed * 7.0);
    p.y += ringAmt * lick * (0.25 + aSeed * 0.95);
    p.xz *= 1.0 - ringAmt * lick * 0.32;

    // constant low drift so nothing is ever perfectly still
    p += 0.02 * vec3(
      sin(uTime * 0.7 + aSeed * 40.0),
      cos(uTime * 0.6 + aSeed * 52.0),
      sin(uTime * 0.5 + aSeed * 23.0)
    );

    // pointer pushes nearby particles away
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec2 toPointer = mv.xy - uPointer * vec2(3.2, 2.0);
    float push = smoothstep(0.9, 0.0, length(toPointer));
    mv.xy += normalize(toPointer + 0.0001) * push * 0.22;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed * 0.9) / max(-mv.z, 0.1);

    // heat: base mix by seed, hotter at the top of the flame
    vHeat = clamp(aSeed * 0.55 + ringAmt * lick * 0.9 + s1 * (1.0 - s2) * 0.15, 0.0, 1.0);
    vAlpha = mix(1.0, 0.45, s3) * (1.0 - ringAmt * lick * 0.55) * uIntro;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying float vHeat;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.12, d);
    if (disc < 0.01) discard;
    vec3 color = mix(uColorA, uColorB, vHeat);
    gl_FragColor = vec4(color, disc * vAlpha * uOpacity);
  }
`

function fibonacciSphere(count: number, radius: number, rand: () => number) {
  const out = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    // two shells: a dense surface and a loose inner core, so it reads as a volume
    const shell = rand() < 0.78 ? 1 : 0.35 + rand() * 0.5
    out[i * 3] = Math.cos(theta) * r * radius * shell
    out[i * 3 + 1] = y * radius * shell
    out[i * 3 + 2] = Math.sin(theta) * r * radius * shell
  }
  return out
}

function burnerRing(count: number, radius: number, rand: () => number) {
  const out = new Float32Array(count * 3)
  const jets = 28
  for (let i = 0; i < count; i++) {
    // particles cluster into discrete gas jets around the ring
    const jet = Math.floor(rand() * jets)
    const angle = (jet / jets) * Math.PI * 2 + (rand() - 0.5) * 0.07
    const r = radius + (rand() - 0.5) * 0.09
    out[i * 3] = Math.cos(angle) * r
    out[i * 3 + 1] = -0.55 + (rand() - 0.5) * 0.04
    out[i * 3 + 2] = Math.sin(angle) * r
  }
  return out
}

function scatter(count: number, rand: () => number) {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 11
    out[i * 3 + 1] = (rand() - 0.5) * 6.5
    out[i * 3 + 2] = (rand() - 0.5) * 5 - 1
  }
  return out
}

/** Deterministic PRNG so the cloud is identical on every visit. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Sample opaque pixels of the logo into particle positions. Resolves null if the image can't be read. */
function sampleLogo(count: number, size: number, rand: () => number): Promise<Float32Array | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const res = 160
        const canvas = document.createElement('canvas')
        canvas.width = res
        canvas.height = res
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return resolve(null)
        const scale = Math.min(res / img.width, res / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (res - w) / 2, (res - h) / 2, w, h)
        const data = ctx.getImageData(0, 0, res, res).data
        const hits: number[] = []
        for (let y = 0; y < res; y++) {
          for (let x = 0; x < res; x++) {
            if (data[(y * res + x) * 4 + 3] > 96) hits.push(x, y)
          }
        }
        if (hits.length < 200) return resolve(null)
        const out = new Float32Array(count * 3)
        const n = hits.length / 2
        for (let i = 0; i < count; i++) {
          const k = Math.floor(rand() * n) * 2
          out[i * 3] = ((hits[k] + rand()) / res - 0.5) * size
          out[i * 3 + 1] = -((hits[k + 1] + rand()) / res - 0.5) * size
          out[i * 3 + 2] = (rand() - 0.5) * 0.12
        }
        resolve(out)
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = LOGO_URL
  })
}

function readColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new THREE.Color(value || fallback)
}

function Cloud({
  progress,
  count,
  active,
  reduced,
}: {
  progress: MotionValue<number>
  count: number
  active: boolean
  reduced: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const { mode, colorTheme } = useTheme()
  const { viewport, gl, invalidate } = useThree()
  const pointer = useRef(new THREE.Vector2(0, 0))
  const pointerTarget = useRef(new THREE.Vector2(0, 0))
  const intro = useRef(reduced ? 1 : 0)
  const introStart = useRef(0)

  const geometry = useMemo(() => {
    const rand = mulberry32(20260110)
    const g = new THREE.BufferGeometry()
    const sphere = fibonacciSphere(count, 1.35, rand)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) seeds[i] = rand()
    // `position` is only used for bounds; the shader reads the four shape attributes
    g.setAttribute('position', new THREE.BufferAttribute(sphere.slice(), 3))
    g.setAttribute('aLogo', new THREE.BufferAttribute(sphere.slice(), 3))
    g.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3))
    g.setAttribute('aRing', new THREE.BufferAttribute(burnerRing(count, 1.45, rand), 3))
    g.setAttribute('aScatter', new THREE.BufferAttribute(scatter(count, rand), 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 30 },
      uIntro: { value: reduced ? 1 : 0 },
      uOpacity: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#5b9bff') },
      uColorB: { value: new THREE.Color('#ff8a3d') },
    }),
    [reduced],
  )

  // logo shape arrives asynchronously; until then the cloud opens on the sphere
  useEffect(() => {
    let alive = true
    sampleLogo(count, 3.1, mulberry32(77)).then((positions) => {
      if (!alive || !positions) return
      const attr = geometry.getAttribute('aLogo') as THREE.BufferAttribute
      attr.array.set(positions)
      attr.needsUpdate = true
      invalidate()
    })
    return () => {
      alive = false
    }
  }, [count, geometry, invalidate])

  // follow the active flame pair and surface
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const mat = material.current
      if (!mat) return
      mat.uniforms.uColorA.value.copy(readColor('--primary', '#5b9bff'))
      mat.uniforms.uColorB.value.copy(readColor('--heat', '#ff8a3d'))
      // light adds up on a dark surface; on a light surface particles must sit on top as ink
      mat.blending = mode === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending
      mat.uniforms.uOpacity.value = mode === 'dark' ? 0.9 : 0.8
      mat.needsUpdate = true
      invalidate()
    })
    return () => cancelAnimationFrame(id)
  }, [mode, colorTheme, invalidate])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointerTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    const unsub = progress.on('change', () => invalidate())
    return unsub
  }, [progress, invalidate])

  // restart the render loop when the hero scrolls back into view
  useEffect(() => {
    if (active) invalidate()
  }, [active, invalidate])

  useFrame((state, delta) => {
    const mat = material.current
    const g = group.current
    if (!mat || !g) return
    const dt = Math.min(delta, 0.05)
    if (!reduced) mat.uniforms.uTime.value += dt

    // wall-clock, so the cloud still assembles on time when frames are throttled
    if (introStart.current === 0) introStart.current = performance.now()
    intro.current = reduced ? 1 : Math.min(1, (performance.now() - introStart.current) / 1600)
    const eased = 1 - Math.pow(1 - intro.current, 4)
    mat.uniforms.uIntro.value = eased

    const p = progress.get()
    mat.uniforms.uProgress.value = THREE.MathUtils.damp(mat.uniforms.uProgress.value, p * 3, 6, dt)
    mat.uniforms.uSize.value = gl.getPixelRatio() * (viewport.width < 6 ? 22 : 30)

    pointer.current.lerp(pointerTarget.current, 1 - Math.exp(-dt * 5))
    mat.uniforms.uPointer.value.copy(pointer.current)

    // the mark faces the visitor, then the object starts to turn as it becomes a volume
    const turn = THREE.MathUtils.smoothstep(mat.uniforms.uProgress.value, 0.2, 1.2)
    const spin = reduced ? 0 : mat.uniforms.uTime.value * 0.12 * turn
    const ringTilt = THREE.MathUtils.smoothstep(mat.uniforms.uProgress.value, 1.2, 2.0)
    g.rotation.y = spin + pointer.current.x * 0.25
    g.rotation.x = -pointer.current.y * 0.15 + ringTilt * 0.42

    // sit to the right of the headline on wide screens, above it on narrow ones
    const wide = state.size.width >= 1024
    g.position.x = wide ? viewport.width * 0.22 : 0
    g.position.y = wide ? 0.1 : viewport.height * 0.2
    const fit = wide ? Math.min(1, viewport.width / 6.2) : Math.min(1, viewport.width / 4.4)
    g.scale.setScalar(fit)

    if (active && !reduced) state.invalidate()
  })

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function ParticleField({
  progress,
  className,
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [config] = useState(() => {
    const small = typeof window !== 'undefined' && window.innerWidth < 768
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return { count: small ? 4200 : 11000, reduced, dpr: small ? 1.5 : 2 }
  })

  // stop rendering once the hero has scrolled away
  useEffect(() => {
    const node = wrap.current
    if (!node) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, config.dpr]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Cloud progress={progress} count={config.count} active={active} reduced={config.reduced} />
      </Canvas>
    </div>
  )
}
