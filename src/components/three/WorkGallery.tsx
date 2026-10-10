'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Project } from '@/data/types';
import { setCursorLabel } from '@/lib/cursor';
import { videoPlaneFragment, videoPlaneVertex } from '@/shaders/videoPlane';

const RADIUS = 7;
const CARD_W = 3.6;
const CARD_H = CARD_W * (9 / 16);
const STEP = (CARD_W + 0.5) / RADIUS; // angle between cards

export interface GalleryControls {
  /** Fractional index of the card at the front, driven by scroll + drag. */
  index: MutableRefObject<number>;
  /** Click vs drag guard. */
  dragged: MutableRefObject<boolean>;
}

interface Props extends GalleryControls {
  projects: Project[];
  visible: Set<string>;
  active: boolean;
  mobile: boolean;
  onOpen: (slug: string) => void;
  onFocus: (slug: string) => void;
}

function Card({
  project,
  posterTex,
  slot,
  shown,
  index,
  dragged,
  onOpen,
  touch,
}: {
  touch: boolean;
  project: Project;
  posterTex: THREE.Texture;
  slot: number;
  shown: boolean;
  index: MutableRefObject<number>;
  dragged: MutableRefObject<boolean>;
  onOpen: (slug: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTex = useRef<THREE.VideoTexture | null>(null);
  const angle = useRef(slot * STEP);
  const lift = useRef(shown ? 0 : -3);
  const prevIndex = useRef(0);
  const autoPlaying = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: posterTex },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uBend: { value: 1 / (2 * RADIUS) },
      uVelocity: { value: 0 },
      uOpacity: { value: 1 },
      uFocus: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
    }),
    [posterTex],
  );

  useEffect(
    () => () => {
      videoRef.current?.pause();
      videoRef.current?.removeAttribute('src');
      videoTex.current?.dispose();
    },
    [],
  );

  // Lazy-create the preview video the first time the card is hovered.
  const playPreview = () => {
    if (!videoRef.current) {
      const v = document.createElement('video');
      v.src = project.preview;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.crossOrigin = 'anonymous';
      v.preload = 'auto';
      v.addEventListener('playing', () => {
        if (!videoTex.current) {
          videoTex.current = new THREE.VideoTexture(v);
          videoTex.current.colorSpace = THREE.SRGBColorSpace;
        }
        if (hovered.current) uniforms.uTexture.value = videoTex.current;
      });
      videoRef.current = v;
    }
    if (videoTex.current) uniforms.uTexture.value = videoTex.current;
    void videoRef.current.play().catch(() => {});
  };

  const stopPreview = () => {
    videoRef.current?.pause();
    uniforms.uTexture.value = posterTex;
  };

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const i = index.current;
    // Every visible card sits at its slot; the whole ring rotates by the front index.
    angle.current = THREE.MathUtils.damp(angle.current, (slot - i) * STEP, 6, delta);
    lift.current = THREE.MathUtils.damp(lift.current, shown ? 0 : -3.5, 5, delta);
    const a = angle.current;
    m.position.set(Math.sin(a) * RADIUS, lift.current, Math.cos(a) * RADIUS - RADIUS);
    m.rotation.y = a;

    const focus = Math.max(0, 1 - Math.abs(slot - i) * 1.4);
    // Touch screens can't hover: the card in front plays its preview and ripples on its own.
    if (touch) {
      const front = shown && Math.abs(slot - i) < 0.35;
      if (front && !autoPlaying.current) {
        autoPlaying.current = true;
        hovered.current = true;
        playPreview();
      } else if (!front && autoPlaying.current) {
        autoPlaying.current = false;
        hovered.current = false;
        stopPreview();
      }
      if (front) uniforms.uMouse.value.set(0.5 + Math.sin(state.clock.elapsedTime * 0.7) * 0.3, 0.5 + Math.cos(state.clock.elapsedTime * 0.5) * 0.25);
    }
    hover.current = THREE.MathUtils.damp(hover.current, hovered.current ? 1 : 0, 6, delta);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uHover.value = hover.current;
    uniforms.uFocus.value = THREE.MathUtils.damp(uniforms.uFocus.value, shown ? focus : 0, 6, delta);
    uniforms.uOpacity.value = THREE.MathUtils.damp(uniforms.uOpacity.value, shown && Math.abs(a) < 1.6 ? 1 : 0, 6, delta);
    uniforms.uVelocity.value = THREE.MathUtils.damp(uniforms.uVelocity.value, (i - prevIndex.current) / Math.max(delta, 0.001) * 0.05, 8, delta);
    prevIndex.current = i;
    const s = 1 + hover.current * 0.04;
    m.scale.set(s, s, s);
    m.visible = uniforms.uOpacity.value > 0.01;

    // cover-fit the texture to the 16:9 card
    const img = uniforms.uTexture.value.image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number } | undefined;
    const w = img?.videoWidth || img?.width || 16;
    const h = img?.videoHeight || img?.height || 9;
    const texAspect = w / h;
    const cardAspect = CARD_W / CARD_H;
    uniforms.uScale.value.set(texAspect > cardAspect ? cardAspect / texAspect : 1, texAspect > cardAspect ? 1 : texAspect / cardAspect);
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) uniforms.uMouse.value.copy(e.uv);
  };

  return (
    <mesh
      ref={mesh}
      onPointerOver={(e) => {
        if (!shown || touch) return;
        e.stopPropagation();
        hovered.current = true;
        setCursorLabel('PLAY');
        playPreview();
      }}
      onPointerOut={() => {
        if (touch) return;
        hovered.current = false;
        setCursorLabel(null);
        stopPreview();
      }}
      onPointerMove={handleMove}
      onClick={(e) => {
        e.stopPropagation();
        if (dragged.current || !shown) return;
        setCursorLabel(null);
        onOpen(project.slug);
      }}
    >
      <planeGeometry args={[CARD_W, CARD_H, 48, 24]} />
      <shaderMaterial
        vertexShader={videoPlaneVertex}
        fragmentShader={videoPlaneFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Ring({ projects, visible, index, dragged, onOpen, onFocus, mobile }: Omit<Props, 'active'>) {
  const posters = useTexture(projects.map((p) => p.poster));
  posters.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const shownList = projects.filter((p) => visible.has(p.slug));
  const lastFocus = useRef('');
  const { camera, size } = useThree();

  // pull the camera back on portrait screens so a full card fits
  useEffect(() => {
    const aspect = size.width / size.height;
    // distance at which the front card (plus a margin) fills the width on narrow screens
    const fit = (CARD_W * 1.4) / (2 * Math.tan(THREE.MathUtils.degToRad(20)) * aspect);
    camera.position.z = Math.max(6.5, fit);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(() => {
    const n = shownList.length;
    if (!n) return;
    const f = shownList[Math.min(n - 1, Math.max(0, Math.round(index.current)))];
    if (f && f.slug !== lastFocus.current) {
      lastFocus.current = f.slug;
      onFocus(f.slug);
    }
  });

  return (
    <group>
      {projects.map((p, i) => {
        const slot = shownList.indexOf(p);
        return (
          <Card
            key={p.slug}
            project={p}
            posterTex={posters[i]}
            slot={slot === -1 ? i : slot}
            shown={slot !== -1}
            index={index}
            dragged={dragged}
            onOpen={onOpen}
            touch={mobile}
          />
        );
      })}
    </group>
  );
}

export default function WorkGallery(props: Props) {
  const { active, mobile } = props;
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.75);
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <AdaptiveDpr pixelated={false} />
      <Ring {...props} />
    </Canvas>
  );
}
