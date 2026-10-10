'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor, Sparkles, useTexture } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { projects } from '@/data/projects';
import { lightRayFragment, lightRayVertex } from '@/shaders/lightRay';

type Quality = 'high' | 'low';
const CA_OFFSET = new THREE.Vector2(0.0008, 0.0005);
const SPECTRUM = ['#FF3D3D', '#FF6B3D', '#FFB13D', '#00E0B8', '#3D8BFF', '#7B5CFF', '#C45CFF'];
/** Where the white beam enters and the colours leave (prism-local space). */
const EXIT = new THREE.Vector3(0.35, 0.05, 0);
const ENTRY = new THREE.Vector3(-0.55, 0.2, 0);

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

function rayMaterial(color: string, phase: number, speed: number) {
  return new THREE.ShaderMaterial({
    vertexShader: lightRayVertex,
    fragmentShader: lightRayFragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uPhase: { value: phase },
      uIntensity: { value: 1 },
    },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    toneMapped: false,
  });
}

// unit-length cylinder lying along +X, starting at the origin, so scale.x = length
const RAY_GEO = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true).rotateZ(-Math.PI / 2).translate(0.5, 0, 0);
const PRISM_GEO = new THREE.CylinderGeometry(1.2, 1.2, 1.7, 3).rotateX(Math.PI / 2);
const PRISM_EDGES = new THREE.EdgesGeometry(PRISM_GEO);
const FRAME_GEO = new THREE.PlaneGeometry(1.4, 0.7875);
const RIM_GEO = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.46, 0.8475));

/** Point a ray from `from` toward angle `a`, `len` long. */
function placeRay(m: THREE.Object3D, from: THREE.Vector3, a: number, len: number, thick: number) {
  m.position.copy(from);
  m.rotation.set(0, 0, a);
  m.scale.set(len, thick, thick);
}

/**
 * Colour grading made physical: raw white light goes into a glass prism and
 * comes out as a spectrum, each colour landing on a finished piece of work.
 */
function Prism({ progress, mobile }: { progress: MutableRefObject<number>; mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const prism = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const beamGlow = useRef<THREE.Mesh>(null);
  const rays = useRef<(THREE.Mesh | null)[]>([]);
  const glows = useRef<(THREE.Mesh | null)[]>([]);
  const frames = useRef<(THREE.Group | null)[]>([]);
  const core = useRef<THREE.PointLight>(null);
  const { pointer, viewport } = useThree();
  const small = viewport.width < 7;
  const tilt = useDeviceTilt(small);

  const posters = useMemo(() => projects.slice(0, SPECTRUM.length).map((p) => p.poster), []);
  const textures = useTexture(posters);
  useMemo(() => textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace)), [textures]);

  const beamMats = useMemo(() => [rayMaterial('#ffffff', 0, 0.9), rayMaterial('#ffffff', 0, 0.9)], []);
  const rayMats = useMemo(() => SPECTRUM.map((c, i) => rayMaterial(c, i * 0.137, 0.55)), []);
  const glowMats = useMemo(() => SPECTRUM.map((c, i) => rayMaterial(c, i * 0.137, 0.55)), []);
  useEffect(() => {
    beamMats[1].uniforms.uIntensity.value = 0.18;
    glowMats.forEach((m) => (m.uniforms.uIntensity.value = 0.16));
  }, [beamMats, glowMats]);

  // desktop: light travels left → right beside the headline; phone: top → down above it
  const scale = small ? Math.min(0.28, viewport.width / 7.6) : Math.min(0.56, viewport.width / 17);
  const baseX = small ? 0 : viewport.width * 0.2;
  const baseY = small ? viewport.height * 0.335 : -0.05;
  const baseRotZ = small ? -Math.PI / 2 : 0;
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const px = small ? Math.sin(t * 0.45) * 0.6 + tilt.current.x : pointer.x;
    const py = small ? Math.cos(t * 0.35) * 0.5 + tilt.current.y : pointer.y;

    // the whole rig leans toward the cursor; scrolling pulls it toward the camera
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.28 + px * 0.25 + p * 0.6, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 - py * 0.18, 2.5, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, baseRotZ, 2.5, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + p * 0.8, 3, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, p * 3.2, 4, delta);

    // the prism turns slowly; the cursor changes the refraction angle
    if (prism.current) {
      prism.current.rotation.z = Math.sin(t * 0.4) * 0.06 + py * 0.08;
      prism.current.rotation.y = Math.sin(t * 0.3) * 0.25 + px * 0.3;
    }

    // incoming white beam
    const beamLen = 4.8;
    const beamAngle = -0.12 + Math.sin(t * 0.5) * 0.02;
    tmp.set(ENTRY.x - Math.cos(beamAngle) * beamLen, ENTRY.y - Math.sin(beamAngle) * beamLen, 0);
    if (beam.current) placeRay(beam.current, tmp, beamAngle, beamLen, 0.028);
    if (beamGlow.current) placeRay(beamGlow.current, tmp, beamAngle, beamLen, 0.14);
    beamMats.forEach((m) => (m.uniforms.uTime.value = t));

    // the fan of colour: wider as you scroll, bent by the cursor
    const spread = 0.17 + p * 0.12 + Math.sin(t * 0.6) * 0.008;
    const centre = 0.02 + py * 0.08;
    const reach = 3.15 + p * 1.5;
    SPECTRUM.forEach((_, i) => {
      const a = centre + (3 - i) * spread;
      const end = tmp.set(EXIT.x + Math.cos(a) * reach, EXIT.y + Math.sin(a) * reach * 1.08, 0);
      const len = end.distanceTo(EXIT) - 0.78;
      const ray = rays.current[i];
      const glow = glows.current[i];
      const ang = Math.atan2(end.y - EXIT.y, end.x - EXIT.x);
      if (ray) placeRay(ray, EXIT, ang, len, 0.016);
      if (glow) placeRay(glow, EXIT, ang, len, 0.09);
      rayMats[i].uniforms.uTime.value = t;
      glowMats[i].uniforms.uTime.value = t;

      const f = frames.current[i];
      if (f) {
        const bob = Math.sin(t * 0.8 + i * 1.3) * 0.06;
        f.position.set(end.x, end.y + bob, Math.sin(t * 0.5 + i) * 0.12 + p * (i - 3) * 0.4);
        // counter the rig's rotation on phones so the work stays upright
        f.rotation.set(0, -0.35 + px * 0.15, -baseRotZ);
        f.scale.setScalar(1 + p * 0.25);
      }
    });

    if (core.current) core.current.intensity = (small ? 2.5 : 6) + Math.sin(t * 2.2) * 1.5;
  });

  return (
    <group ref={root} position={[baseX, baseY, 0]} rotation={[0, 0, baseRotZ]} scale={scale}>
      <mesh ref={beamGlow} geometry={RAY_GEO} material={beamMats[1]} />
      <mesh ref={beam} geometry={RAY_GEO} material={beamMats[0]} />

      <group ref={prism}>
        <mesh geometry={PRISM_GEO}>
          <meshPhysicalMaterial
            color="#d9d4ff"
            roughness={0.04}
            metalness={0}
            transparent
            opacity={small ? 0.18 : 0.32}
            clearcoat={1}
            iridescence={1}
            iridescenceIOR={1.6}
            envMapIntensity={small ? 0.8 : 1.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={PRISM_EDGES}>
          <lineBasicMaterial color={new THREE.Color('#ffffff').multiplyScalar(1.7)} toneMapped={false} />
        </lineSegments>
        {/* light dispersing inside the glass */}
        <pointLight ref={core} color="#bdb3ff" intensity={6} distance={4} />
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[small ? 0.11 : 0.16, 16, 16]} />
          <meshBasicMaterial color={new THREE.Color('#ffffff').multiplyScalar(small ? 1.5 : 2.2)} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      </group>

      {SPECTRUM.map((c, i) => (
        <group key={c}>
          <mesh ref={(m) => void (glows.current[i] = m)} geometry={RAY_GEO} material={glowMats[i]} />
          <mesh ref={(m) => void (rays.current[i] = m)} geometry={RAY_GEO} material={rayMats[i]} />
          <group ref={(m) => void (frames.current[i] = m)}>
            <mesh geometry={FRAME_GEO}>
              <meshBasicMaterial map={textures[i]} toneMapped={false} />
            </mesh>
            <lineSegments geometry={RIM_GEO}>
              <lineBasicMaterial color={new THREE.Color(c).multiplyScalar(2)} toneMapped={false} />
            </lineSegments>
          </group>
        </group>
      ))}
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
        <Prism progress={progress} mobile={mobile} />
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
