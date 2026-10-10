/**
 * Hero film strip: a 35mm-style ribbon whose frames show the project posters
 * (from a 3x3 atlas). Sprocket holes are cut out, the edges glow AE-violet,
 * and the whole strip flows along its length like film running through a gate.
 */
export const filmStripVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const filmStripFragment = /* glsl */ `
uniform sampler2D uAtlas;
uniform float uFrames;   // frames along the whole loop
uniform float uFlow;     // running offset (in frames)
uniform float uCells;    // used cells in the 3x3 atlas
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;

const vec3 BASE = vec3(0.035, 0.032, 0.045);
const vec3 VIOLET = vec3(0.48, 0.36, 1.0);
const vec3 EMBER = vec3(1.0, 0.42, 0.24);

void main() {
  float u = vUv.x * uFrames + uFlow;
  float idx = floor(u);
  float fx = fract(u);
  float y = vUv.y;
  vec3 col = BASE;

  // sprocket bands
  float band = step(y, 0.15) + step(0.85, y);
  if (band > 0.5) {
    float hx = fract(fx * 4.0);
    float hy = y < 0.5 ? y : 1.0 - y;
    vec2 d = abs(vec2(hx - 0.5, (hy - 0.075) * 2.2));
    float hole = step(max(d.x - 0.18, d.y - 0.07), 0.0);
    if (hole > 0.5) discard;
    // tiny edge-print ticks, like key numbers on real stock
    float tick = step(0.97, fract(fx * 8.0)) * step(abs(hy - 0.135), 0.006);
    col += EMBER * tick * 0.8;
  } else {
    // picture area with a thin frame line between frames
    float fu = (fx - 0.035) / 0.93;
    float fv = (y - 0.17) / 0.66;
    if (fu > 0.0 && fu < 1.0 && fv > 0.0 && fv < 1.0) {
      float cell = mod(idx, uCells);
      float cx = mod(cell, 3.0);
      float cy = floor(cell / 3.0);
      vec2 auv = vec2((cx + fu) / 3.0, 1.0 - (cy + (1.0 - fv)) / 3.0);
      vec3 img = texture2D(uAtlas, auv).rgb;
      // soft gate vignette per frame
      vec2 q = vec2(fu, fv) - 0.5;
      img *= 1.0 - dot(q, q) * 0.9;
      col = img * 1.05;
    }
  }

  // glowing violet edges (picked up by bloom)
  float edge = 1.0 - smoothstep(0.0, 0.012, min(y, 1.0 - y));
  col += VIOLET * edge * 2.5;

  // acetate sheen
  float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.0);
  col += vec3(0.75, 0.72, 1.0) * fres * 0.35;

  if (!gl_FrontFacing) col *= 0.55;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
