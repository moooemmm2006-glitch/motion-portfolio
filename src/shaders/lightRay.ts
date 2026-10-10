/**
 * A beam of light: soft round core, a brighter pulse that travels along it,
 * and faded ends. Used additively, so overlapping rays mix like real light.
 */
export const lightRayVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lightRayFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    float along = vUv.y;
    // fade in at the source, fade out at the tip
    float ends = smoothstep(0.0, 0.08, along) * (1.0 - smoothstep(0.75, 1.0, along));
    // energy pulses travelling away from the prism
    float wave = fract(along * 1.5 - uTime * uSpeed + uPhase);
    float pulse = pow(1.0 - smoothstep(0.0, 0.18, abs(wave - 0.5)), 2.0);
    float shimmer = 0.85 + 0.15 * sin(uTime * 7.0 + along * 30.0 + uPhase * 6.0);
    vec3 col = uColor * (0.75 + pulse * 1.6) * shimmer * uIntensity;
    gl_FragColor = vec4(col * ends, 1.0);
  }
`;
