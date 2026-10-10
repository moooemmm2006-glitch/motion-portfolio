/**
 * Project card shader: bends the plane, adds a hover ripple from the pointer
 * and an RGB split that grows with hover and scroll velocity.
 */
export const videoPlaneVertex = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
uniform float uBend;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 pos = position;
  // cylinder-like bend along x
  pos.z -= pow(pos.x, 2.0) * uBend;
  // ripple pushed out from the pointer
  float d = distance(uv, uMouse);
  pos.z += sin(d * 18.0 - uTime * 6.0) * 0.04 * uHover * (1.0 - smoothstep(0.0, 0.6, d));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const videoPlaneFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform float uVelocity;
uniform float uOpacity;
uniform float uFocus;
uniform vec2 uMouse;
uniform vec2 uScale; // texture cover scale
varying vec2 vUv;

vec2 cover(vec2 uv) { return (uv - 0.5) * uScale + 0.5; }

void main() {
  vec2 uv = vUv;
  float d = distance(uv, uMouse);
  float ripple = sin(d * 30.0 - uTime * 5.0) * 0.006 * uHover * (1.0 - smoothstep(0.0, 0.5, d));
  uv += normalize(uv - uMouse + 0.0001) * ripple;
  float split = 0.004 * uHover + abs(uVelocity) * 0.02;
  vec2 dir = vec2(split, 0.0);
  float r = texture2D(uTexture, cover(uv + dir)).r;
  float g = texture2D(uTexture, cover(uv)).g;
  float b = texture2D(uTexture, cover(uv - dir)).b;
  vec3 col = vec3(r, g, b);
  // desaturate & dim cards that are not in focus
  float gray = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(gray) * 0.55, col, clamp(uFocus + uHover, 0.0, 1.0));
  // soft rounded vignette edge
  vec2 e = smoothstep(0.0, 0.02, vUv) * smoothstep(0.0, 0.02, 1.0 - vUv);
  gl_FragColor = vec4(col, uOpacity * e.x * e.y);
  #include <colorspace_fragment>
}
`;
