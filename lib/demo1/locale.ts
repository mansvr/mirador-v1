export type Demo1Locale = "es" | "en";

export const DEMO1_DEFAULT_LOCALE: Demo1Locale = "es";

/** `?lang=en` for local preview; default Spanish in production. */
export function resolveDemo1Locale(
  queryOverride: string | null | undefined,
): Demo1Locale {
  if (queryOverride === "en" || queryOverride === "es") {
    return queryOverride;
  }
  const env = process.env.NEXT_PUBLIC_DEMO1_LOCALE;
  if (env === "en" || env === "es") return env;
  return DEMO1_DEFAULT_LOCALE;
}
