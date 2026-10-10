/**
 * Easing curves modeled on After Effects keyframe interpolation.
 * `easyEase` = F9 Easy Ease (33% influence). The others mimic common
 * graph-editor shapes: long tail ease-out and a strong S-curve.
 */
export const easyEase = [0.33, 0, 0.67, 1] as const;
export const expoOut = [0.16, 1, 0.3, 1] as const;
export const cineInOut = [0.83, 0, 0.17, 1] as const;
export const softOut = [0.22, 1, 0.36, 1] as const;

export const gsapEase = {
  easyEase: 'power2.inOut',
  out: 'expo.out',
  inOut: 'expo.inOut',
};
