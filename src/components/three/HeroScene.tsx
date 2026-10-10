'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  AdaptiveDpr,
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Sparkles,
  useTexture,
  useVideoTexture,
} from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';

type Quality = 'high' | 'low';
const CA_OFFSET = new THREE.Vector2(0.0009, 0.0006);

interface Props {
  /** 0 at top of page, 1 when the hero has scrolled away. */
  progress: MutableRefObject<number>;
  active: boolean;
  mobile: boolean;
}

/** Shows the poster immediately, then swaps to the playing showreel once it can play. */
function ShowreelMaterial() {
  const reel = site.showreel;
  const poster = useTexture(reel.poster ?? '/posters/showreel.jpg');
  poster.colorSpace = THREE.SRGBColorSpace;
  const posterMat = <meshBasicMaterial map={poster} toneMapped={false} />;
  if (reel.type !== 'file') return posterMat;
  return (
    <Suspense fallback={posterMat}>
      <VideoMat src={reel.src} />
    </Suspense>
  );
}

function VideoMat({ src }: { src: string }) {
  const texture = useVideoTexture(src, { muted: true, loop: true, start: true, playsInline: true, crossOrigin: 'anonymous' });
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

/** A stylized camera lens: metal barrel, glowing ring, the showreel inside and a glass front element. */
function Lens({ progress, quality }: { progress: MutableRefObject<number>; quality: Quality }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();
  const small = viewport.width < 7;
  // on narrow screens: shrink the lens and lift it above the headline
  const scale = small ? Math.min(0.8, viewport.width / 4.2) : 0.9;
  const baseY = small ? viewport.height * 0.27 : 0;
  const baseX = small ? 0 : viewport.width * 0.25;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    // mouse parallax + subtle rotation, eased like an AE Easy Ease
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.45 - 0.35 + p * 0.6, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.3 + 0.12, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX + pointer.x * 0.25, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + p * 1.2, 3, delta);
    // scroll: fly toward the camera
    g.position.z = THREE.MathUtils.damp(g.position.z, p * 4.5, 4, delta);
    if (ring.current) ring.current.rotation.z += delta * 0.4;
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, -p * 0.8, 3, delta);
  });

  return (
    <group ref={group} scale={scale} position={[baseX, baseY, 0]}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* Barrel */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.55]}>
          <cylinderGeometry args={[1.45, 1.55, 1.1, 96, 1, true]} />
          <meshStandardMaterial color="#121216" metalness={0.95} roughness={0.32} side={THREE.DoubleSide} />
        </mesh>
        {/* Grip grooves */}
        {[-0.95, -0.75, -0.55, -0.35].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[1.56, 0.035, 12, 96]} />
            <meshStandardMaterial color="#1c1c22" metalness={1} roughness={0.4} />
          </mesh>
        ))}
        {/* Front bezel */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.42, 0.11, 24, 128]} />
          <meshStandardMaterial color="#0d0d10" metalness={1} roughness={0.18} />
        </mesh>
        {/* Glowing AE-violet ring */}
        <mesh ref={ring} position={[0, 0, 0.06]}>
          <torusGeometry args={[1.28, 0.012, 8, 160]} />
          <meshBasicMaterial color={new THREE.Color('#7B5CFF').multiplyScalar(4)} toneMapped={false} />
        </mesh>
        {/* Showreel playing inside the lens */}
        <mesh position={[0, 0, -0.45]}>
          <circleGeometry args={[1.4, 96]} />
          <Suspense fallback={<meshBasicMaterial color="#1a1530" />}>
            <ShowreelMaterial />
          </Suspense>
        </mesh>
        {/* Glass front element (refracts the video behind it) */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1.36, 0.42, 1.36]}>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <MeshTransmissionMaterial
            backside={false}
            samples={quality === 'high' ? 8 : 3}
            resolution={quality === 'high' ? 768 : 256}
            thickness={0.5}
            roughness={0.04}
            ior={1.35}
            chromaticAberration={0.6}
            anisotropy={0.2}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.08}
            clearcoat={1}
            attenuationColor="#d9d4ff"
            attenuationDistance={6}
            color="#ffffff"
          />
        </mesh>
      </Float>
      {/* Orbiting glass ring for depth */}
      <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1}>
        <mesh position={[-1.4, -1.2, 0.8]} rotation={[0.6, 0.4, 0]}>
          <torusGeometry args={[0.45, 0.14, 32, 96]} />
          <MeshTransmissionMaterial samples={3} resolution={256} thickness={0.4} roughness={0.08} chromaticAberration={0.4} ior={1.4} color="#c9bfff" />
        </mesh>
      </Float>
    </group>
  );
}

function Rig() {
  // keep the camera looking at the center while it drifts
  useFrame(({ camera }) => camera.lookAt(0, 0, 0));
  return null;
}

export default function HeroScene({ progress, active, mobile }: Props) {
  const [quality, setQuality] = useState<Quality>(mobile ? 'low' : 'high');

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => !mobile && setQuality('high')} />
      <AdaptiveDpr pixelated={false} />
      <Rig />
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#FF6B3D" />
      <pointLight position={[4, 2, 1]} intensity={30} color="#7B5CFF" />

      <Suspense fallback={null}>
        <Lens progress={progress} quality={quality} />
        {/* Procedural studio lighting (no HDR download) */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={4} position={[-5, 0, 2]} scale={[2, 8, 1]} color="#9999FF" />
          <Lightformer form="rect" intensity={3} position={[5, -1, 2]} scale={[2, 6, 1]} color="#FF6B3D" />
          <Lightformer form="ring" intensity={2} position={[0, 0, 6]} scale={3} color="#ffffff" />
        </Environment>
      </Suspense>

      <Sparkles count={mobile ? 40 : 140} scale={[14, 8, 6]} size={mobile ? 2 : 3} speed={0.25} opacity={0.5} color="#bdb3ff" />
      <Sparkles count={mobile ? 10 : 30} scale={[16, 9, 4]} position={[0, 0, -3]} size={12} speed={0.1} opacity={0.15} color="#FF6B3D" />

      {!mobile && quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.2} />
          <ChromaticAberration offset={CA_OFFSET} radialModulation={false} modulationOffset={0} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
      {!mobile && quality === 'low' && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.7} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
