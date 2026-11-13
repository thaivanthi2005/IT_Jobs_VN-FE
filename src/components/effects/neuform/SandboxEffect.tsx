"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Sandboxed host for the Neuform effects copied from MengTo/threeui.
 *
 * The canonical HTML lives untouched in `public/effects/*.html` so its hash stays
 * auditable. This host fetches it once, applies a per-effect transform (theme,
 * palette, typography), injects the focus stylesheet plus the pointer-leave
 * bridge, and mounts the result in an `allow-scripts`-only iframe. Removing the
 * iframe releases its document, listeners, animation frames and 2D contexts
 * together.
 */

export type EffectMode = "light" | "dark";

export type SandboxEffectProps = {
  /** File name inside `public/effects`, without the extension. */
  source: string;
  /** Replaces the authored `#000` page background. */
  background: string;
  /** Runs on the raw HTML before the focus layer is appended. */
  transform?: (html: string) => string;
  mode?: EffectMode;
  /** Outer-frame grade, applied to the iframe element itself. */
  hue?: number;
  saturation?: number;
  brightness?: number;
  /** Posts a pointer-leave edge the sandboxed document cannot observe. */
  trackPointerHover?: boolean;
  /** Keeps the authored hover signal on so the ring orbits on its own. */
  autoHover?: boolean;
  /** Live controls posted into the document, never rebuilt into it. */
  runtime?: Readonly<Record<string, number | string>>;
  className?: string;
  title?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));

/** Only the authored canvas survives; the rest of the page is hidden. */
function focusStyle(background: string, mode: EffectMode) {
  return `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${background} !important; color-scheme: ${mode} !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; }
</style>`;
}

/** Keeps only the authored targets and dispatches the resize the source expects. */
function focusScript(selectors: string[]) {
  return `<script data-threeui-focus>(function(){
  var SELECTORS = ${JSON.stringify(selectors)};
  var done = false;
  function isolate(){
    if (done) return; done = true;
    var roots = [];
    SELECTORS.forEach(function(selector){
      Array.prototype.forEach.call(document.querySelectorAll(selector), function(element){
        if (roots.some(function(root){ return root.contains(element); })) return;
        roots.push(element);
      });
    });
    if (!roots.length) return;
    roots.forEach(function(root){
      root.setAttribute('data-threeui-role', 'background');
      document.body.appendChild(root);
    });
    Array.prototype.forEach.call(document.body.children, function(element){
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    });
    document.body.setAttribute('data-threeui-ready', '');
    requestAnimationFrame(function(){ window.dispatchEvent(new Event('resize')); });
  }
  function schedule(){ setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  window.addEventListener('load', isolate, { once: true });
})();</script>`;
}

export const buildFocusedDocument = (
  html: string,
  options: { background: string; mode: EffectMode; selectors: string[] },
) =>
  html
    .replace(/<\/head>/i, `${focusStyle(options.background, options.mode)}</head>`)
    .replace(/<\/body>/i, `${focusScript(options.selectors)}</body>`);

export const SandboxEffect = ({
  source,
  background,
  transform,
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
  trackPointerHover = false,
  autoHover = false,
  runtime,
  className = "",
  title = "Focused source effect",
}: SandboxEffectProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [raw, setRaw] = useState<string | null>(null);

  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 3);
  const safeBrightness = clamp(brightness, 0, 3);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/effects/${source}.html`, { signal: controller.signal })
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((text) => setRaw(text))
      .catch(() => undefined);

    return () => controller.abort();
  }, [source]);

  const focused = useMemo(() => {
    if (!raw) return null;
    const transformed = transform ? transform(raw) : raw;
    return buildFocusedDocument(transformed, {
      background,
      mode,
      selectors: ["#stage", "#glcanvas", "canvas"],
    });
  }, [raw, transform, background, mode]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !trackPointerHover) return;

    const post = (hover: number) => {
      try {
        frame.contentWindow?.postMessage({ threeuiRuntime: { hover } }, "*");
      } catch {
        /* a detached frame cannot take the message */
      }
    };

    /* The leave edge is a handshake. Pointer moves over an iframe never reach
       the host document, so the frame reports its own arrival; the host then
       watches for the first move that lands outside the frame's box, because a
       sandboxed cross-process frame is not guaranteed a pointerleave. */
    let inside = false;

    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow) return;
      if (event.data?.threeuiPointerOver) {
        inside = true;
        post(1);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!inside) return;
      const bounds = frame.getBoundingClientRect();
      const outside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (outside) {
        inside = false;
        post(0);
      }
    };

    const leave = () => {
      if (!inside) return;
      inside = false;
      post(0);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("pointermove", onPointerMove, true);
    frame.addEventListener("pointerleave", leave);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pointermove", onPointerMove, true);
      frame.removeEventListener("pointerleave", leave);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [trackPointerHover]);

  /* Ambient mode: the authored ring rests until a pointer arrives, which reads
     as a still image to anyone who never hovers it. Holding the hover signal on
     makes it orbit continuously without touching the renderer. */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !autoHover) return;

    let cancelled = false;
    const hold = () => {
      if (cancelled) return;
      try {
        frame.contentWindow?.postMessage({ threeuiRuntime: { hover: 1 } }, "*");
      } catch {
        /* the frame may have been swapped between retries */
      }
    };

    frame.addEventListener("load", hold);
    const first = window.setTimeout(hold, 400);
    const repeat = window.setInterval(hold, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(repeat);
      frame.removeEventListener("load", hold);
    };
  }, [autoHover, focused]);

  /* A srcDoc document cannot take a live prop, so continuous controls are posted
     into it instead of rebuilt into it — a rebuild restarts the animation and
     repaints every tile texture. Posted on mount and again on each frame load, so
     a late-arriving document still receives the current values. */
  const runtimeMessage = runtime ? JSON.stringify(runtime) : null;
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !runtimeMessage) return;

    const post = () => {
      try {
        frame.contentWindow?.postMessage({ threeuiRuntime: JSON.parse(runtimeMessage) }, "*");
      } catch {
        /* the frame may have been detached */
      }
    };

    post();
    frame.addEventListener("load", post);
    return () => frame.removeEventListener("load", post);
  }, [runtimeMessage, focused]);

  if (!focused) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ width: "100%", height: "100%", background }}
      />
    );
  }

  return (
    <iframe
      ref={frameRef}
      className={className}
      data-mode={mode}
      title={title}
      srcDoc={focused}
      sandbox="allow-scripts"
      loading="eager"
      allow="fullscreen"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background,
        filter,
        /* the documented ring only reacts while a pointer is over it, so the
           frame has to accept pointer events — a page-level `pointer-events:
           none` wrapper would make the whole effect inert */
        pointerEvents: trackPointerHover || autoHover ? "auto" : "none",
      }}
    />
  );
};
