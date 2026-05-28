import { formatMessage } from "@/lib/demo1/messages";
import type { Demo1Locale } from "@/lib/demo1/locale";
import type { PropertyMicrosite } from "@/lib/demo1/types";

export type LocalizedProperty = PropertyMicrosite & {
  activeLocale: Demo1Locale;
  whatsappNavText: string;
  whatsappAgentText: string;
};

export function localizeProperty(
  property: PropertyMicrosite,
  locale: Demo1Locale,
): LocalizedProperty {
  const copy = property.copy[locale];
  const vars = {
    title: property.hero.title,
    agent: property.agent.name,
  };

  return {
    ...property,
    activeLocale: locale,
    locale,
    hero: {
      title: property.hero.title,
      eyebrow: copy.hero.eyebrow,
      description: copy.hero.description,
    },
    ctas: { ...copy.ctas },
    whatsappNavText: formatMessage(copy.whatsapp.nav, vars),
    whatsappAgentText: formatMessage(copy.whatsapp.agent, vars),
  };
}
