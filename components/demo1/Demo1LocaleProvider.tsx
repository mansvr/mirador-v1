"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEMO1_DEFAULT_LOCALE,
  resolveDemo1Locale,
  type Demo1Locale,
} from "@/lib/demo1/locale";
import { demo1Messages, type Demo1Messages } from "@/lib/demo1/messages";
import { localizeProperty, type LocalizedProperty } from "@/lib/demo1/localize-property";
import type { PropertyMicrosite } from "@/lib/demo1/types";

type Demo1LocaleContextValue = {
  locale: Demo1Locale;
  messages: Demo1Messages;
  property: LocalizedProperty;
  setLocale: (locale: Demo1Locale) => void;
};

const Demo1LocaleContext = createContext<Demo1LocaleContextValue | null>(null);

export function Demo1LocaleProvider({
  property,
  initialLocale,
  children,
}: {
  property: PropertyMicrosite;
  initialLocale: Demo1Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const locale = resolveDemo1Locale(langParam ?? initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Demo1Locale) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEMO1_DEFAULT_LOCALE) {
        params.delete("lang");
      } else {
        params.set("lang", next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const value = useMemo(
    () => ({
      locale,
      messages: demo1Messages(locale),
      property: localizeProperty(property, locale),
      setLocale,
    }),
    [locale, property, setLocale],
  );

  return (
    <Demo1LocaleContext.Provider value={value}>{children}</Demo1LocaleContext.Provider>
  );
}

export function useDemo1Locale(): Demo1LocaleContextValue {
  const ctx = useContext(Demo1LocaleContext);
  if (!ctx) {
    throw new Error("useDemo1Locale must be used within Demo1LocaleProvider");
  }
  return ctx;
}
