"use client";

import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  demo1MotionActive,
  resolveDemo1Motion,
  type Demo1MotionFlags,
} from "@/lib/demo1/motion-mode";

type Demo1MotionContextValue = {
  motion: Demo1MotionFlags;
  motionPreview: boolean;
};

const Demo1MotionContext = createContext<Demo1MotionContextValue | null>(null);

export function Demo1MotionProvider({
  initialMotionQuery,
  children,
}: {
  initialMotionQuery?: string | null;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const motionQuery = searchParams.get("motion") ?? initialMotionQuery ?? null;

  const value = useMemo(() => {
    const motion = resolveDemo1Motion(motionQuery);
    return { motion, motionPreview: demo1MotionActive(motion) };
  }, [motionQuery]);

  return (
    <Demo1MotionContext.Provider value={value}>{children}</Demo1MotionContext.Provider>
  );
}

export function useDemo1Motion(): Demo1MotionContextValue {
  const ctx = useContext(Demo1MotionContext);
  if (!ctx) {
    throw new Error("useDemo1Motion must be used within Demo1MotionProvider");
  }
  return ctx;
}
