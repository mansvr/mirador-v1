"use client";

/**
 * ViewerControls — orbit / fly camera controls using drei OrbitControls.
 * Provides mouse drag, scroll zoom, and touch support out of the box.
 * 
 * In walk mode this component is disabled; WaypointCamera takes over.
 */

import { OrbitControls } from "@react-three/drei";
import { useViewerStore } from "@/lib/store";

export function ViewerControls() {
  const isWalkMode = useViewerStore((s) => s.isWalkMode);
  const isCameraTweening = useViewerStore((s) => s.isCameraTweening);

  if (isWalkMode) return null;

  return (
    <OrbitControls
      makeDefault
      enabled={!isCameraTweening}
      enableDamping
      dampingFactor={0.08}
      // Prevent going underground
      minPolarAngle={0}
      maxPolarAngle={Math.PI * 0.88}
      // Comfortable zoom range for interior spaces
      minDistance={0.3}
      maxDistance={30}
      // Invert y-axis drag (feels more natural in architectural walkthroughs)
      rotateSpeed={0.5}
      zoomSpeed={1.2}
    />
  );
}
