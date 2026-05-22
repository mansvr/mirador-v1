import * as THREE from "three";

/** Active pill home pose — tour leash rotates/zooms relative to this. */
export interface TourHomePose {
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  fov: number;
  target: THREE.Vector3;
  baseDistance: number;
}

export interface TourLeashOffset {
  yaw: number;
  pitch: number;
  zoomScale: number;
}

export const viewerNavRegistry = {
  home: null as TourHomePose | null,
  offset: { yaw: 0, pitch: 0, zoomScale: 1 } as TourLeashOffset,
};

export function clearTourLeashOffset() {
  viewerNavRegistry.offset.yaw = 0;
  viewerNavRegistry.offset.pitch = 0;
  viewerNavRegistry.offset.zoomScale = 1;
}

export function setTourHomePose(home: TourHomePose | null) {
  viewerNavRegistry.home = home;
}
