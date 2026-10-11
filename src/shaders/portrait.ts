import { simplex3 } from './noise';

/** Portrait plane: noise-driven liquid distortion that follows the pointer on hover. */
export const portraitVertex = /* glsl */ `
varying vec2 vUv;
uniform float uHover;
uniform vec2 uMouse;
void main() {
  vUv = uv;
  vec3 pos = position;
  float d = distance(uv, uMouse);
  pos.z += (1.0 - smoothstep(0.0, 0.5, d)) * 0.15 * uHover;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const portraitFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
uniform vec2 uScale;
varying vec2 vUv;
${simplex3}
void main() {
  vec2 uv = vUv;
  float d = distance(uv, uMouse);
  float mask = (1.0 - smoothstep(0.0, 0.45, d)) * uHover;
  float n = snoise(vec3(uv * 4.0, uTime * 0.4));
  uv += vec2(n) * 0.04 * mask;
  vec2 c = (uv - 0.5) * uScale + 0.5;
  float r = texture2D(uTexture, c + vec2(0.006 * mask, 0.0)).r;
  float g = texture2D(uTexture, c).g;
  float b = texture2D(uTexture, c - vec2(0.006 * mask, 0.0)).b;
  vec3 col = vec3(r, g, b);
  col += vec3(0.48, 0.36, 1.0) * mask * 0.15;
  // rounded corners (radius in UV of the 4:5 plane, aspect-corrected)
  vec2 q = abs(vUv - 0.5) * vec2(0.8, 1.0);
  vec2 hb = vec2(0.4, 0.5) - 0.06;
  float sd = length(max(q - hb, 0.0)) - 0.06;
  float alpha = 1.0 - smoothstep(-0.002, 0.002, sd);
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
`;
