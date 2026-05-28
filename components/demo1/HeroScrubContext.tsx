"use client";

import { createContext, useContext } from "react";

export type HeroScrubState = {
  progress: number;
  show: boolean;
};

const HeroScrubContext = createContext<HeroScrubState | null>(null);

export function HeroScrubProvider({
  value,
  children,
}: {
  value: HeroScrubState;
  children: React.ReactNode;
}) {
  return <HeroScrubContext.Provider value={value}>{children}</HeroScrubContext.Provider>;
}

export function useHeroScrub(): HeroScrubState {
  const ctx = useContext(HeroScrubContext);
  return ctx ?? { progress: 0, show: false };
}
