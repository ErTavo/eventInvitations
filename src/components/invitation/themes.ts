import type { EventStyle, ThemeId } from "@/lib/supabase/types";

export interface ThemeConfig {
  id: ThemeId;
  layoutVariant?: "botanical"; // signals special rendering (elegant template)
  bgClass: string;
  sectionClass: string;
  headingClass: string;
  textClass: string;
  mutedClass: string;
  accentClass: string;
  buttonClass: string;
  dividerClass: string;
  cardClass: string;
  primary: string;
  secondary: string;
  accent: string;
  // Only set for custom theme — used as inline CSS vars on the root div
  cssVars?: React.CSSProperties;
}

export const themeConfig: Record<Exclude<ThemeId, "custom">, ThemeConfig> = {
  vintage: {
    id: "vintage",
    bgClass: "bg-[#fdf6ec]",
    sectionClass: "bg-[#fdf6ec]",
    headingClass: "text-[#3d2b1f]",
    textClass: "text-[#5a4030]",
    mutedClass: "text-[#8b6c42]",
    accentClass: "text-[#8b6c42]",
    buttonClass: "bg-[#8b6c42] hover:bg-[#7a5c35] text-white",
    dividerClass: "border-[#c9a96e]",
    cardClass: "bg-[#fef9f2] border border-[#e8d5b7]",
    primary: "#8b6c42",
    secondary: "#fdf6ec",
    accent: "#c9a96e",
  },
  // ── Elegante — plantilla botánica inspirada en papelería verde oscura ───────
  elegant: {
    id: "elegant",
    layoutVariant: "botanical",
    // Fondo: pergamino con textura de papel (bg-color + noise overlay via CSS)
    bgClass: "bg-[#f5f0e8] paper-texture",
    // Secciones transparentes para que la textura del padre se vea continua
    sectionClass: "bg-transparent",
    headingClass: "text-[#1e3314]",
    textClass: "text-[#2c2c2c]",
    mutedClass: "text-[#5a7a4a]",
    accentClass: "text-[#c9a96e]",
    buttonClass: "bg-[#2d4a22] hover:bg-[#1e3314] text-white",
    dividerClass: "border-[#c9a96e]",
    cardClass: "bg-[#faf6ee] border border-[#c9a96e]",
    primary: "#2d4a22",   // verde bosque
    secondary: "#f5f0e8", // pergamino
    accent: "#c9a96e",    // dorado
  },
  modern: {
    id: "modern",
    bgClass: "bg-white",
    sectionClass: "bg-white",
    headingClass: "text-[#1a1a2e]",
    textClass: "text-[#2d2d45]",
    mutedClass: "text-[#6b6b8a]",
    accentClass: "text-[#9b5de5]",
    buttonClass: "bg-[#9b5de5] hover:bg-[#8040d0] text-white",
    dividerClass: "border-[#e0d0f5]",
    cardClass: "bg-[#f8f5ff] border border-[#e8d8f8]",
    primary: "#9b5de5",
    secondary: "#ffffff",
    accent: "#c490f5",
  },
  floral: {
    id: "floral",
    bgClass: "bg-[#fff9fb]",
    sectionClass: "bg-[#fff9fb]",
    headingClass: "text-[#3d1a2a]",
    textClass: "text-[#5a2a3d]",
    mutedClass: "text-[#c2547a]",
    accentClass: "text-[#c2547a]",
    buttonClass: "bg-[#c2547a] hover:bg-[#a84068] text-white",
    dividerClass: "border-[#f4a5be]",
    cardClass: "bg-[#fff0f5] border border-[#ffd0e0]",
    primary: "#c2547a",
    secondary: "#fff9fb",
    accent: "#f4a5be",
  },
  minimal: {
    id: "minimal",
    bgClass: "bg-white",
    sectionClass: "bg-white",
    headingClass: "text-[#2d2d2d]",
    textClass: "text-[#444444]",
    mutedClass: "text-[#888888]",
    accentClass: "text-[#2d2d2d]",
    buttonClass: "bg-[#2d2d2d] hover:bg-[#111] text-white",
    dividerClass: "border-[#e0e0e0]",
    cardClass: "bg-[#f8f8f8] border border-[#e8e8e8]",
    primary: "#2d2d2d",
    secondary: "#ffffff",
    accent: "#888888",
  },
};

// Custom theme: all classes reference CSS variables set on the root div.
// Tailwind v4 supports arbitrary CSS-var references: bg-[var(--x)], text-[var(--x)]
function buildCustomTheme(style: EventStyle): ThemeConfig {
  const { primaryColor, secondaryColor, accentColor, textColor } = style;

  // Lighten the bg slightly for cards/sections (mix with white)
  return {
    id: "custom",
    bgClass: "bg-[var(--inv-bg)]",
    sectionClass: "bg-[var(--inv-bg)]",
    headingClass: "text-[var(--inv-primary)]",
    textClass: "text-[var(--inv-text)]",
    mutedClass: "text-[var(--inv-accent)]",
    accentClass: "text-[var(--inv-accent)]",
    buttonClass: "bg-[var(--inv-primary)] text-white hover:opacity-90",
    dividerClass: "border-[var(--inv-accent)]",
    cardClass: "bg-[var(--inv-card)] border border-[var(--inv-accent)]",
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    cssVars: {
      "--inv-primary": primaryColor,
      "--inv-bg":      secondaryColor,
      "--inv-accent":  accentColor,
      "--inv-text":    textColor,
      "--inv-card":    secondaryColor,
    } as React.CSSProperties,
  };
}

export function buildThemeConfig(style: EventStyle): ThemeConfig {
  if (style.theme === "custom") return buildCustomTheme(style);
  return themeConfig[style.theme] ?? themeConfig.elegant;
}
