/** Mirador brand tokens — source: brand/tokens/colors.json */

export const MIRADOR_BRAND = {

  bg: "#F5F6F2",

  surface: "#E7E6DC",

  surfaceAlt: "#DFDFDE",

  text: "#5E5956",

  textMuted: "#85837B",

  accent: "#5E5956",

  accentHover: "#85837B",

  border: "#CCC3B7",

  chip: "#B1A699",

  viewerChrome: "#121212",

  viewerText: "#f5f5f5",

  ogBackground: "#121212",

} as const;



/** Default tenant accent when scene.json omits primary_color */

export const MIRADOR_DEFAULT_PRIMARY = MIRADOR_BRAND.accent;

