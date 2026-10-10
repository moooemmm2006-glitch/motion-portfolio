'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Sparkles, useTexture } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { projects } from '@/data/projects';
import { filmStripFragment, filmStripVertex } from '@/shaders/filmStrip';

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

/** Infinity-shaped closed path the film runs along. */
const infinityPoint = (t: number, target: THREE.Vector3) => {
  const a = t * Math.PI * 2;
  return target.set(Math.sin(a) * 2.6, Math.sin(a) * Math.cos(a) * 1.5, Math.cos(a) * 1.1);
};

/** Build a flat ribbon along the curve with one full twist, UV.x along the loop, UV.y across. */
function useRibbon(segments: number, width: number) {
  return useMemo(() => {
    const ahead = new THREE.Vector3();
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const side = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      infinityPoint(t, p);
      tan.subVectors(infinityPoint(t + 0.0005, ahead), p).normalize();
      nrm.crossVectors(tan, up).normalize();
      side.crossVectors(nrm, tan).normalize();
      // one full twist so the loop closes seamlessly
      const twist = t * Math.PI * 2;
      const dir = side.clone().multiplyScalar(Math.cos(twist)).addScaledVector(nrm, Math.sin(twist));
      for (const s of [-0.5, 0.5]) {
        pos.push(p.x + dir.x * width * s, p.y + dir.y * width * s, p.z + dir.z * width * s);
        uv.push(t, s + 0.5);
      }
      if (i < segments) {
        const k = i * 2;
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, [segments, width]);
}

/** Packs up to 9 project posters into one 3x3 texture. */
function usePosterAtlas() {
  const posters = useMemo(() => projects.slice(0, 9).map((p) => p.poster), []);
  const images = useTexture(posters);
  return useMemo(() => {
    const cw = 512;
    const ch = 288;
    const canvas = document.createElement('canvas');
    canvas.width = cw * 3;
    canvas.height = ch * 3;
    const ctx = canvas.getContext('2d')!;
    images.forEach((tex, i) => {
      const img = tex.image as HTMLImageElement;
      const x = (i % 3) * cw;
      const y = Math.floor(i / 3) * ch;
      // cover-fit each poster into its cell
      const s = Math.max(cw / img.width, ch / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, x + (cw - w) / 2, y + (ch - h) / 2, w, h);
    });
    const atlas = new THREE.CanvasTexture(canvas);
    atlas.colorSpace = THREE.SRGBColorSpace;
    atlas.anisotropy = 4;
    return { atlas, cells: images.length };
  }, [images]);
}

/** The work itself, running as an endless strip of film: the editor's timeline made physical. */
function FilmLoop({ progress, mobile }: { progress: MutableRefObject<number>; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();
  const small = viewport.width < 7;
  const tilt = useDeviceTilt(small);
  const geometry = useRibbon(mobile ? 500 : 900, 0.95);
  const { atlas, cells } = usePosterAtlas();
  const uniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uFrames: { value: 22 },
      uFlow: { value: 0 },
      uCells: { value: cells },
      uTime: { value: 0 },
    }),
    [atlas, cells],
  );

  const scale = small ? Math.min(0.75, viewport.width / 6.2) : 0.78;
  const baseX = small ? 0 : viewport.width * 0.24;
  const baseY = small ? viewport.height * 0.24 : 0;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    // film runs forward; scrolling speeds it up like scrubbing the timeline
    uniforms.uFlow.value += delta * (0.55 + p * 6);
    uniforms.uTime.value = t;

    const px = small ? Math.sin(t * 0.5) * 0.5 + tilt.current.x : pointer.x;
    const py = small ? Math.cos(t * 0.4) * 0.35 + tilt.current.y : pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.5 + px * 0.5 + Math.sin(t * 0.15) * 0.15 + p * 1.2, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.35 - py * 0.3, 2.5, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.18 + Math.sin(t * 0.2) * 0.05, 2.5, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX + px * 0.2, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + p * 1.0, 3, delta);
    // scroll: the loop rushes toward the camera
    g.position.z = THREE.MathUtils.damp(g.position.z, p * 4.5, 4, delta);
  });

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
      <mesh geometry={geometry}>
        <shaderMaterial
          vertexShader={filmStripVertex}
          fragmentShader={filmStripFragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
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

      <Suspense fallback={null}>
        <FilmLoop progress={progress} mobile={mobile} />
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
