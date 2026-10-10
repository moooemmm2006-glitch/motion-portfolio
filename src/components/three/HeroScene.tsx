'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, Sparkles } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';

type Quality = 'high' | 'low';
const CA_OFFSET = new THREE.Vector2(0.0008, 0.0005);

interface Props {
  /** 0 at top of page, 1 when the hero has scrolled away. */
  progress: MutableRefObject<number>;
  active: boolean;
  mobile: boolean;
}

/** Phone tilt as -1..1 (Android gives it freely; iOS needs a permission tap, so it stays 0 there). */
function useDeviceTilt(enabled: boolean) {
  const tilt = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      tilt.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [enabled]);
  return tilt;
}

/** Hero look: soft violet glass washed with an Instagram-style gradient. */
const LOOK = {
  gradient: ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'],
  glassOpacity: 0.42,
  edge: '#C9A8FF',
  inner: ['rgba(214,41,118,0.45)', 'rgba(150,47,191,0.14)'],
  halo: ['rgba(150,47,191,0.5)', 'rgba(214,41,118,0.14)'],
};

/** Diagonal gradient (bottom-left warm → top-right violet) mapped across the button. */
function gradientTexture(stops: string[]) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createLinearGradient(0, 256, 256, 0);
  stops.forEach((col, i) => gr.addColorStop(i / (stops.length - 1), col));
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Soft radial glow drawn once to a canvas. */
function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, inner);
  gr.addColorStop(0.5, outer);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** The ▶ icon with rounded corners, extruded and bevelled into a glass slab. */
function playGeometry() {
  const r = 1.5;
  const k = 0.14;
  const pts: [number, number][] = [
    [-r * 0.55, r],
    [r * 0.95, 0],
    [-r * 0.55, -r],
  ];
  const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const shape = new THREE.Shape();
  pts.forEach((a, i) => {
    const next = pts[(i + 1) % 3];
    const prev = pts[(i + 2) % 3];
    const s0 = lerp(a, prev, k);
    const e0 = lerp(a, next, k);
    if (i === 0) shape.moveTo(...s0);
    else shape.lineTo(...s0);
    shape.quadraticCurveTo(a[0], a[1], ...e0);
  });
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 8, curveSegments: 24 });
  geo.center();
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 3.2 + 0.5, pos.getY(i) / 3.2 + 0.5);
  return geo;
}

/**
 * A single glass play button: the simplest possible sign for "video", lit from
 * inside, with a playhead orbiting it like a timeline wrapped into a loop.
 */
function PlayButton({ progress, mobile }: { progress: MutableRefObject<number>; mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const button = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const innerGlow = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();
  const small = viewport.width < 7;
  const tilt = useDeviceTilt(small);

  const geo = useMemo(playGeometry, []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 20), [geo]);
  const gradTex = useMemo(() => gradientTexture(LOOK.gradient), []);
  const innerTex = useMemo(() => glowTexture(LOOK.inner[0], LOOK.inner[1]), []);
  const haloTex = useMemo(() => glowTexture(LOOK.halo[0], LOOK.halo[1]), []);
  const edgeColor = useMemo(() => new THREE.Color(LOOK.edge).multiplyScalar(1.6), []);
  const dotColor = useMemo(() => new THREE.Color('#FA7E1E').multiplyScalar(3), []);
  const ringColor = useMemo(() => new THREE.Color('#C9A8FF').multiplyScalar(1.3), []);

  const scale = small ? Math.min(0.5, viewport.width / 6) : Math.min(0.78, viewport.width / 12.5);
  const baseX = small ? 0 : viewport.width * 0.29;
  const baseY = small ? viewport.height * 0.27 : 0;

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const px = small ? Math.sin(t * 0.45) * 0.6 + tilt.current.x : pointer.x;
    const py = small ? Math.cos(t * 0.35) * 0.5 + tilt.current.y : pointer.y;

    g.position.x = THREE.MathUtils.damp(g.position.x, baseX + px * 0.15, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + Math.sin(t * 0.8) * 0.06 + p * 0.8, 3, delta);
    // scroll: the button flies toward the camera like you're pressing play
    g.position.z = THREE.MathUtils.damp(g.position.z, p * 3.5, 4, delta);

    if (button.current) {
      const b = button.current;
      b.rotation.y = THREE.MathUtils.damp(b.rotation.y, (small ? -0.25 : -0.45) + px * 0.45 + Math.sin(t * 0.4) * 0.12 + p * 1.6, 2.5, delta);
      b.rotation.x = THREE.MathUtils.damp(b.rotation.x, 0.1 - py * 0.3, 2.5, delta);
    }
    // the playhead runs around faster as you scroll
    if (orbit.current) orbit.current.rotation.z -= delta * (0.5 + p * 4);
    if (innerGlow.current) innerGlow.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
  });

  return (
    <group ref={root} position={[baseX, baseY, 0]} scale={scale}>
      <mesh position={[0, 0, -2.5]}>
        <planeGeometry args={[9, 9]} />
        <meshBasicMaterial map={haloTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <group ref={button}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial
            map={gradTex}
            roughness={0.08}
            metalness={0}
            transparent
            opacity={LOOK.glassOpacity}
            clearcoat={1}
            iridescence={0.5}
            iridescenceIOR={1.5}
            envMapIntensity={1.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={edgeColor} toneMapped={false} />
        </lineSegments>
        <mesh ref={innerGlow} position={[0.05, 0, 0]}>
          <planeGeometry args={[2.4, 2.4]} />
          <meshBasicMaterial map={innerTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>

      {/* timeline ring with a playhead */}
      <group rotation={[1.2, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[2.4, 0.008, 8, 200]} />
          <meshBasicMaterial color={ringColor} toneMapped={false} />
        </mesh>
        <group ref={orbit}>
          <mesh position={[2.4, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={dotColor} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {!mobile && <pointLight position={[-2, 2, 3]} color="#D62976" intensity={20} />}
    </group>
  );
}

function Rig() {
  useFrame(({ camera }) => camera.lookAt(0, 0, 0));
  return null;
}

export default function HeroScene({ progress, active, mobile }: Props) {
  const [quality, setQuality] = useState<Quality>(mobile ? 'low' : 'high');

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.75] : [1, 2]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => !mobile && setQuality('high')} />
      <AdaptiveDpr pixelated={false} />
      <Rig />
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 3]} color="#9999FF" intensity={30} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 3, 2]} scale={[6, 1, 1]} />
        <Lightformer form="rect" intensity={2} color="#7B5CFF" position={[-4, 0, 1]} scale={[1, 5, 1]} />
        <Lightformer form="rect" intensity={2} color="#FF6B3D" position={[4, -1, 1]} scale={[1, 4, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <PlayButton progress={progress} mobile={mobile} />
      </Suspense>

      <Sparkles count={mobile ? 90 : 160} scale={[14, 8, 6]} size={mobile ? 2.5 : 3} speed={0.25} opacity={0.5} color="#bdb3ff" />
      <Sparkles count={mobile ? 20 : 30} scale={[16, 9, 4]} position={[0, 0, -3]} size={12} speed={0.1} opacity={0.15} color="#FF6B3D" />

      {quality === 'high' && !mobile ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.7} luminanceSmoothing={0.2} />
          <ChromaticAberration offset={CA_OFFSET} radialModulation={false} modulationOffset={0} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1} luminanceThreshold={0.7} />
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
