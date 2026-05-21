export interface AuthorCameraSnapshot {
  pos: [number, number, number];
  quat: [number, number, number, number];
  fov: number;
}

type CaptureFn = () => AuthorCameraSnapshot | null;

export const viewerAuthorRegistry = {
  uiVisible: false,
  captureCamera: null as CaptureFn | null,
};

export function registerAuthorCameraCapture(fn: CaptureFn | null) {
  viewerAuthorRegistry.captureCamera = fn;
}

export function readAuthorCamera(): AuthorCameraSnapshot | null {
  return viewerAuthorRegistry.captureCamera?.() ?? null;
}
