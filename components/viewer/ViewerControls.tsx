"use client";

/**
 * Author mode: full OrbitControls for framing captures.
 * Tour mode: inert OrbitControls shell (makeDefault + target sync); TourOrbitLeash drives input.
 */

import { OrbitControls } from "@react-three/drei";
import { useNavigationMode } from "@/lib/navigation-mode";
import { tourFootprintRadius } from "@/lib/orbit-leash";
import { useViewerStore } from "@/lib/store";

export function ViewerControls() {
  const mode = useNavigationMode();
  const isWalkMode = useViewerStore((s) => s.isWalkMode);
  const isCameraTweening = useViewerStore((s) => s.isCameraTweening);
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const hasOpening = useViewerStore((s) => Boolean(s.scene?.camera_default));
  const scene = useViewerStore((s) => s.scene);

  if (isWalkMode) return null;

  const orbitEnabled =
    !isCameraTweening && (!hasOpening || isLoaded);

  if (mode === "author") {
    const footprint = tourFootprintRadius(scene);
    const maxDist = Math.max(3, footprint * 1.5);

    return (
      <OrbitControls
        makeDefault
        enabled={orbitEnabled}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.88}
        minDistance={0.3}
        maxDistance={maxDist}
        rotateSpeed={0.5}
        zoomSpeed={1.2}
      />
    );
  }

  return (
    <OrbitControls
      makeDefault
      enabled={false}
      enableRotate={false}
      enablePan={false}
      enableZoom={false}
    />
  );
}
