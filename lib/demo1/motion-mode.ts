/** Demo1 motion: loading + hero on by default; section reveals opt-in via `?motion=reveal`. */

export type Demo1MotionFlags = {
  loading: boolean;
  hero: boolean;
  reveal: boolean;
};

const OFF: Demo1MotionFlags = { loading: false, hero: false, reveal: false };

/** Shipped default for `/demo1` (no query param). */
export const DEMO1_DEFAULT_MOTION: Demo1MotionFlags = {
  loading: true,
  hero: true,
  reveal: false,
};

export function resolveDemo1Motion(
  query: string | null | undefined,
): Demo1MotionFlags {
  if (!query?.trim()) return DEMO1_DEFAULT_MOTION;

  const token = query.trim().toLowerCase();

  if (token === "off" || token === "none" || token === "0") {
    return OFF;
  }

  if (token === "all" || token === "reveal") {
    return { ...DEMO1_DEFAULT_MOTION, reveal: true };
  }

  // Isolated preview (single bundle, no other motion).
  if (token === "loading") {
    return { loading: true, hero: false, reveal: false };
  }
  if (token === "hero") {
    return { loading: false, hero: true, reveal: false };
  }

  return DEMO1_DEFAULT_MOTION;
}

export function demo1MotionActive(flags: Demo1MotionFlags): boolean {
  return flags.loading || flags.hero || flags.reveal;
}
