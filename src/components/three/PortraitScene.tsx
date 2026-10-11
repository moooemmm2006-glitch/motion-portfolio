'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { portraitFragment, portraitVertex } from '@/shaders/portrait';

function Plane({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: tex },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScale: { value: new THREE.Vector2(1, 1) },
    }),
    [tex],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, hovered.current ? 1 : 0, 4, delta);
    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, state.pointer.x * 0.18, 3, delta);
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -state.pointer.y * 0.12, 3, delta);
    }
    // cover-fit the 4:5 plane
    const img = tex.image as { width: number; height: number };
    const ta = img.width / img.height;
    const pa = 4 / 5;
    uniforms.uScale.value.set(ta > pa ? pa / ta : 1, ta > pa ? 1 : ta / pa);
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
      onPointerMove={(e) => e.uv && uniforms.uMouse.value.copy(e.uv)}
    >
      <planeGeometry args={[3.2, 4, 64, 64]} />
      <shaderMaterial vertexShader={portraitVertex} fragmentShader={portraitFragment} uniforms={uniforms} transparent />
    </mesh>
  );
}

export default function PortraitScene({ src, active }: { src: string; active: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 45 }} gl={{ alpha: true }} aria-hidden>
      <Plane src={src} />
    </Canvas>
  );
}
