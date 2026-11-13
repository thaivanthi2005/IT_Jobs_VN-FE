/**
 * Pause channel between a modal and the WebGL scenes.
 *
 * A modal that covers the page should stop the background render loop — not for
 * correctness, but because a spinning scene behind a dimmed backdrop is
 * distracting and burns GPU while the user reads. Scenes subscribe here; the
 * modal flips the flag in a mount/unmount effect so it always restores.
 *
 * A module-level pub/sub is used instead of React context because the scenes are
 * mounted by different route trees and a provider would have to wrap the whole
 * app just to carry one boolean.
 */

type Listener = (paused: boolean) => void;

let paused = 0;
const listeners = new Set<Listener>();

const emit = () => {
  const value = paused > 0;
  listeners.forEach((listener) => listener(value));
};

export const subscribeScenePaused = (listener: Listener) => {
  listeners.add(listener);
  listener(paused > 0);
  return () => {
    listeners.delete(listener);
  };
};

/** Reference counted, so two stacked overlays cannot unpause each other early. */
export const setScenePaused = (value: boolean) => {
  const wasPaused = paused > 0;
  const next = value ? paused + 1 : Math.max(0, paused - 1);
  paused = next;

  /* Only notify on a transition. A second overlay opening must not re-emit
     `true`, or every scene would restart its pause bookkeeping. */
  const isPaused = paused > 0;
  if (wasPaused !== isPaused) emit();
};

export const isScenePaused = () => paused > 0;
