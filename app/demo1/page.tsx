import { Demo1PageContent } from "@/components/demo1/Demo1PageContent";
import { resolveDemo1Locale } from "@/lib/demo1/locale";
import { getProperty } from "@/lib/demo1/property";

export default async function Demo1Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; motion?: string }>;
}) {
  const params = await searchParams;
  const property = getProperty();
  const initialLocale = resolveDemo1Locale(params.lang);

  return (
    <Demo1PageContent
      property={property}
      initialLocale={initialLocale}
      initialMotionQuery={params.motion ?? null}
    />
  );
}
