"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { registerAuthorCameraCapture } from "@/lib/viewer-author-registry";

/** Registers live R3F camera reads for Author mode capture buttons. */
export function AuthorCameraBridge() {
  const { camera } = useThree();

  useEffect(() => {
    registerAuthorCameraCapture(() => {
      const cam = camera as THREE.PerspectiveCamera;
      return {
        pos: [camera.position.x, camera.position.y, camera.position.z],
        quat: [
          camera.quaternion.x,
          camera.quaternion.y,
          camera.quaternion.z,
          camera.quaternion.w,
        ],
        fov: cam.fov ?? 60,
      };
    });
    return () => registerAuthorCameraCapture(null);
  }, [camera]);

  return null;
}
