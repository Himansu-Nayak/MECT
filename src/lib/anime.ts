// motion: owner = Anime.js
import type { RefObject } from "react";
import { createScope, type Scope } from "animejs";

/**
 * Returns true when running in a browser and the user has not requested
 * reduced motion (`prefers-reduced-motion: reduce`).
 */
export function canAnimate(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Creates a scoped Anime.js v4 context bound to `ref` and returns a cleanup
 * function suitable for `useEffect`. Automatically skips animation when
 * `canAnimate()` is false or `ref.current` is null.
 */
export function withScope(
  ref: RefObject<HTMLElement | SVGElement | null>,
  fn: (scope: Scope) => void
): () => void {
  if (!canAnimate() || !ref.current) {
    return () => {};
  }

  const scope = createScope({ root: ref });
  scope.add((activeScope) => {
    if (activeScope) {
      fn(activeScope);
    }
  });

  return () => {
    scope.revert();
  };
}

