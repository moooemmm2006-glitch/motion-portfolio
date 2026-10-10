import { simplex3 } from './noise';

/** Slow, moody shader gradient used behind the contact section. */
export const gradientVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const gradientFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;
${simplex3}
void main() {
  vec2 uv = vUv;
  vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0);
  float t = uTime * 0.05;
  float n1 = snoise(vec3(p * 0.8, t));
  float n2 = snoise(vec3(p * 1.6 + n1, t * 1.5 + 4.0));
  vec3 ink = vec3(0.039, 0.039, 0.043);
  vec3 violet = vec3(0.482, 0.361, 1.0);
  vec3 soft = vec3(0.6, 0.6, 1.0);
  vec3 ember = vec3(1.0, 0.42, 0.24);
  vec3 col = ink;
  col = mix(col, violet * 0.55, smoothstep(0.0, 0.9, n1 * 0.5 + 0.5) * 0.8);
  col = mix(col, ember * 0.5, smoothstep(0.55, 1.0, n2 * 0.5 + 0.5) * 0.6);
  col = mix(col, soft * 0.4, smoothstep(0.75, 1.0, n1) * 0.4);
  float glow = (1.0 - smoothstep(0.0, 0.6, distance(uv, uMouse)));
  col += violet * glow * 0.12;
  // fade into page background at top and bottom
  col = mix(ink, col, smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.65, 1.0, uv.y)));
  gl_FragColor = vec4(col, 1.0);
}
`;
