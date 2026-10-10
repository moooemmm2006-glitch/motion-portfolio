/**
 * Tiny pub/sub so both DOM elements (via data-cursor) and 3D meshes
 * can change the custom cursor label.
 */
type Listener = (label: string | null) => void;
const listeners = new Set<Listener>();

export const setCursorLabel = (label: string | null) => listeners.forEach((l) => l(label));
export const onCursorLabel = (l: Listener) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
