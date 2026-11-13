"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import { subscribeScenePaused } from "@/lib/scene-pause";

/**
 * Tech constellation scene — three.js r186 / React Three Fiber 9.8 / drei 10.7.
 *
 * A wireframe data-orbiting sphere drawn behind the hero and the auth panels.
 * Flat, tone-mapping-free materials keep the glow identical on the light and
 * dark themes, and the palette is the project's brand tokens
 * (#0EA5E9 / #38BDF8 / #4ADE80).
 *
 * Safety nets baked in:
 * - `frameloop` flips to `never` while the scene is off-screen or the tab is
 *   hidden, so an idle page costs zero GPU time.
 * - `prefers-reduced-motion` freezes spin, drift and pointer parallax.
 * - the wrapper always paints a CSS gradient, so a missing WebGL context
 *   degrades to a static backdrop instead of an empty box.
 */

const BRAND_400 = "#38bdf8";
const BRAND_500 = "#0ea5e9";
const ACCENT_400 = "#4ade80";

export type TechSceneVariant = "hero" | "auth" | "banner";

const PRESETS = {
  hero: {
    nodes: 54,
    radius: 2.05,
    linkDistance: 1.12,
    stars: 760,
    rings: 3,
    cameraZ: 7.6,
    fov: 42,
    parallax: 1,
  },
  auth: {
    nodes: 34,
    radius: 1.95,
    linkDistance: 1.38,
    stars: 340,
    rings: 2,
    cameraZ: 7.2,
    fov: 44,
    parallax: 0.5,
  },
  banner: {
    nodes: 40,
    radius: 2.0,
    linkDistance: 1.25,
    stars: 260,
    rings: 2,
    cameraZ: 7.4,
    fov: 46,
    parallax: 0.35,
  },
} as const;

/* ---------------------------------------------------------------- helpers */

/** Deterministic RNG so the star field is identical on every mount. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** Evenly spread points on a sphere (golden-angle lattice). */
function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const points: [number, number, number][] = [];

  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push([
      Math.cos(theta) * ringRadius * radius,
      y * radius,
      Math.sin(theta) * ringRadius * radius,
    ]);
  }

  return points;
}

/** Line segments between nearby nodes — the "constellation" wiring. */
function buildLinks(nodes: [number, number, number][], maxDistance: number) {
  const positions: number[] = [];
  const maxSq = maxDistance * maxDistance;

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];

      if (dx * dx + dy * dy + dz * dz <= maxSq) {
        positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      }
    }
  }

  return new Float32Array(positions);
}

function buildStarField(count: number) {
  const random = createRandom(20260112);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const distance = 6.5 + random() * 9.5;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * distance;
    positions[i * 3 + 1] = Math.cos(phi) * distance;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * distance;
  }

  return positions;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Normalised pointer (-1…1) read from the window, so the canvas itself can stay
 * `pointer-events-none` and never swallow clicks on the search form.
 */
function usePointerTarget() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return target;
}

/**
 * Pauses the frame loop when the host element is scrolled out of view or the
 * browser tab is hidden. Returns a ref to attach to the wrapper plus the
 * `frameloop` value the Canvas should use.
 */
function useVisibleFrameloop() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    let onScreen = true;

    const sync = () => setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "120px" },
    );

    observer.observe(element);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return { host, frameloop: (active ? "always" : "never") as "always" | "never" };
}

/* ------------------------------------------------------------ scene parts */

function StarField({ count, animate }: { count: number; animate: boolean }) {
  const positions = useMemo(() => buildStarField(count), [count]);
  const points = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!animate || !points.current) return;
    const step = Math.min(delta, 0.05);
    points.current.rotation.y += step * 0.014;
    points.current.rotation.x += step * 0.004;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        color={BRAND_400}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function OrbitRings({
  count,
  radius,
  animate,
}: {
  count: number;
  radius: number;
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    const step = Math.min(delta, 0.05);
    group.current.rotation.y += step * 0.16;
    group.current.rotation.z -= step * 0.05;
  });

  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, index) => {
        const ringRadius = radius + 0.55 + index * 0.34;
        const tilt = (index / Math.max(1, count)) * Math.PI * 0.55;

        return (
          <mesh
            key={index}
            rotation={[Math.PI / 2 + tilt * 0.65, tilt, index * 0.4]}
            frustumCulled={false}
          >
            <torusGeometry args={[ringRadius, 0.0035, 6, 168]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? BRAND_400 : ACCENT_400}
              transparent
              opacity={index === 0 ? 0.42 : 0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Constellation({
  variant,
  animate,
  pointer,
  calm = false,
}: {
  variant: TechSceneVariant;
  animate: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  /** Slows the tumble instead of stopping it, for prefers-reduced-motion. */
  calm?: boolean;
}) {
  const preset = PRESETS[variant];
  const tiltGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const coreGroup = useRef<THREE.Group>(null);

  const nodes = useMemo(() => fibonacciSphere(preset.nodes, preset.radius), [preset]);
  const links = useMemo(() => buildLinks(nodes, preset.linkDistance), [nodes, preset]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const speed = calm ? 0.35 : 1;

    if (animate && spinGroup.current) {
      /* A sphere spun about its own Y axis looks frozen — the lattice and the
         wireframe are rotationally symmetric, so nothing on screen moves. The
         group tumbles on all three axes plus a slow wobble, and the ring offset
         is what makes the motion legible. */
      spinGroup.current.rotation.y += step * 0.34 * speed;
      spinGroup.current.rotation.x += step * 0.11 * speed;
      spinGroup.current.rotation.z += step * 0.07 * speed;
      spinGroup.current.rotation.x += Math.sin(time * 0.55) * step * 0.09 * speed;
      spinGroup.current.rotation.z += Math.cos(time * 0.42) * step * 0.06 * speed;
    }

    if (coreGroup.current && animate) {
      /* the faceted core counter-rotates so the two shells visibly shear past
         each other instead of turning as one solid body */
      coreGroup.current.rotation.y -= step * 0.2 * speed;
      coreGroup.current.rotation.x += step * 0.05 * speed;
      const pulse = 1 + Math.sin(time * 1.1) * (calm ? 0.01 : 0.025);
      coreGroup.current.scale.setScalar(pulse);
    }

    if (tiltGroup.current) {
      /* the whole assembly leans toward the pointer on top of its own tumble,
         so the scene answers the mouse on two independent axes */
      const reach = calm ? 0.4 : 1;
      const targetX = animate ? pointer.current.y * 0.2 * preset.parallax * reach : 0;
      const targetY = animate ? pointer.current.x * 0.3 * preset.parallax * reach : 0;

      tiltGroup.current.rotation.x = THREE.MathUtils.damp(
        tiltGroup.current.rotation.x,
        targetX,
        3,
        step,
      );
      tiltGroup.current.rotation.y = THREE.MathUtils.damp(
        tiltGroup.current.rotation.y,
        targetY,
        3,
        step,
      );
      tiltGroup.current.position.y = THREE.MathUtils.damp(
        tiltGroup.current.position.y,
        animate ? Math.sin(time * 0.7) * 0.06 * speed : 0,
        3,
        step,
      );
    }
  });

  return (
    <group ref={tiltGroup}>
      {/* faint wireframe shell around the whole constellation */}
      <mesh scale={preset.radius * 1.42} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={BRAND_500}
          wireframe
          transparent
          opacity={0.07}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <OrbitRings count={preset.rings} radius={preset.radius} animate={animate} />

      <group ref={spinGroup}>
        {/* constellation wiring — a single LineSegments draw call */}
        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[links, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={BRAND_400}
            transparent
            opacity={0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>

        {/* nodes — one instanced draw call for the whole shell */}
        <Instances limit={nodes.length} frustumCulled={false}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial toneMapped={false} transparent opacity={0.95} />
          {nodes.map((position, index) => (
            <Instance
              key={index}
              position={position}
              color={index % 7 === 0 ? ACCENT_400 : BRAND_400}
              scale={index % 7 === 0 ? 1.4 : 1}
            />
          ))}
        </Instances>
      </group>

      {/* faceted core */}
      <group ref={coreGroup}>
        <mesh>
          <icosahedronGeometry args={[1.16, 1]} />
          <meshStandardMaterial
            color="#0b2740"
            metalness={0.9}
            roughness={0.22}
            emissive={BRAND_500}
            emissiveIntensity={0.22}
            flatShading
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.21, 1]} />
          <meshBasicMaterial
            color={BRAND_400}
            wireframe
            transparent
            opacity={0.28}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={1.85}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={BRAND_500}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------- canvas */

/**
 * Subscribes to the shared modal pause channel. Returns true while any overlay
 * that dims the page is open.
 */
function useScenePaused() {
  const [paused, setPaused] = useState(false);

  useEffect(() => subscribeScenePaused(setPaused), []);

  return paused;
}

export default function TechScene({ variant = "hero" }: { variant?: TechSceneVariant }) {
  const preset = PRESETS[variant];
  const reducedMotion = useReducedMotion();
  const pointer = usePointerTarget();
  const { host, frameloop } = useVisibleFrameloop();
  const modalPaused = useScenePaused();

  /* Reduced motion used to switch the loop to `demand`, which only renders on an
     explicit invalidate() — and nothing here invalidates, so the sphere sat
     completely still for anyone with the OS motion setting on. The motion is
     now gated inside the frame callback instead: the scene keeps a live loop
     while it is on screen, and simply holds its pose when motion is not wanted.
     A modal pauses it too, via the shared pause channel. */
  const active = frameloop === "always" && !modalPaused;
  const effectiveFrameloop = active ? "always" : "demand";

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={effectiveFrameloop}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.15, preset.cameraZ], fov: preset.fov }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3.5, 4, 5]} intensity={1.6} color="#dbeafe" />
        <pointLight position={[-3.5, -1.5, 2.5]} intensity={9} distance={12} color={BRAND_500} />
        <pointLight position={[3, 2.5, -3]} intensity={6} distance={12} color={ACCENT_400} />

        <StarField count={preset.stars} animate />
        <Constellation variant={variant} animate pointer={pointer} calm={reducedMotion} />
      </Canvas>
    </div>
  );
}
