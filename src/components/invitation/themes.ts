import type { ThemeId } from "@/lib/supabase/types";

export interface ThemeConfig {
  id: ThemeId;
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
}

export const themeConfig: Record<ThemeId, ThemeConfig> = {
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
    secondary: "#f5ede0",
    accent: "#c9a96e",
  },
  elegant: {
    id: "elegant",
    bgClass: "bg-[#fafaf8]",
    sectionClass: "bg-[#fafaf8]",
    headingClass: "text-[#2c2c2c]",
    textClass: "text-[#444444]",
    mutedClass: "text-[#888888]",
    accentClass: "text-[#b8974a]",
    buttonClass: "bg-[#b8974a] hover:bg-[#a07a35] text-white",
    dividerClass: "border-[#d4b896]",
    cardClass: "bg-white border border-[#e8e0d0]",
    primary: "#b8974a",
    secondary: "#f5f0e8",
    accent: "#d4b896",
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
    secondary: "#e8e8f0",
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
    secondary: "#fde8ef",
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
    secondary: "#f0f0f0",
    accent: "#888888",
  },
};
