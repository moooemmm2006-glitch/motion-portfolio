'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { gradientFragment, gradientVertex } from '@/shaders/gradient';

function GradientPlane() {
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );
  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uResolution.value.set(size.width, size.height);
    const target = new THREE.Vector2(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    uniforms.uMouse.value.lerp(target, 0.03);
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={gradientVertex} fragmentShader={gradientFragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

export default function ContactScene({ active }: { active: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={1} gl={{ antialias: false }} aria-hidden>
      <GradientPlane />
    </Canvas>
  );
}
