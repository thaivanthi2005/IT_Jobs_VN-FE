/**
 * Build guard.
 *
 * `next build` prerenders these routes with no backend running. Next prints the
 * fetch error to the build log even when the promise is caught, so the only way
 * to a clean log is to not make the request at all. `CI` and `NEXT_PHASE` are
 * both set during `next build`, and neither is set by `next start`.
 */
export const isBuild = () =>
  process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_BUILD === "1";
