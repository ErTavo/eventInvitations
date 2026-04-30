"use client";

import { motion } from "framer-motion";
import type { Event, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";
import { formatDate } from "@/lib/utils";

interface ParentsConfig {
  sectionTitle?: string;
  brideParentsLabel?: string;
  brideParentNames?: string[];
  groomParentsLabel?: string;
  groomParentNames?: string[];
  godfathersLabel?: string;
  godfatherNames?: string[];
}

interface Props {
  event: Event;
  participant: Participant;
  theme: ThemeConfig;
  parentsConfig?: ParentsConfig;
}

// ─── Watercolor splashes ───────────────────────────────────────────────────────
function WatercolorSplashes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="wca"><feGaussianBlur stdDeviation="28"/></filter>
          <filter id="wcb"><feGaussianBlur stdDeviation="18"/></filter>
          <filter id="wcc"><feGaussianBlur stdDeviation="12"/></filter>
        </defs>
        <ellipse cx="8%"  cy="88%" rx="16%" ry="10%" fill="#9eb3ac" opacity="0.13" filter="url(#wca)"/>
        <ellipse cx="14%" cy="82%" rx="10%" ry="7%"  fill="#8fa49d" opacity="0.10" filter="url(#wcb)"/>
        <ellipse cx="6%"  cy="78%" rx="7%"  ry="5%"  fill="#b0c4bc" opacity="0.08" filter="url(#wcb)"/>
        <ellipse cx="28%" cy="10%" rx="11%" ry="7%"  fill="#9eb3ac" opacity="0.09" filter="url(#wca)"/>
        <ellipse cx="22%" cy="15%" rx="7%"  ry="4%"  fill="#8fa49d" opacity="0.07" filter="url(#wcc)"/>
        <ellipse cx="72%" cy="7%"  rx="9%"  ry="5%"  fill="#9eb3ac" opacity="0.08" filter="url(#wcb)"/>
        <ellipse cx="80%" cy="12%" rx="5%"  ry="3%"  fill="#b0c4bc" opacity="0.06" filter="url(#wcc)"/>
        <ellipse cx="45%" cy="92%" rx="8%"  ry="4%"  fill="#9eb3ac" opacity="0.07" filter="url(#wcb)"/>
        <ellipse cx="90%" cy="60%" rx="5%"  ry="7%"  fill="#8fa49d" opacity="0.06" filter="url(#wcb)"/>
      </svg>
    </div>
  );
}

// ─── Large eucalyptus-style leaf cluster ───────────────────────────────────────
function LeafCluster({ corner }: { corner: "top-right" | "bottom-left" }) {
  const isTopRight = corner === "top-right";
  return (
    <div className="absolute pointer-events-none"
      style={{
        top: isTopRight ? 0 : undefined, bottom: isTopRight ? undefined : 0,
        right: isTopRight ? 0 : undefined, left: isTopRight ? undefined : 0,
        zIndex: 3,
        transform: isTopRight ? undefined : "rotate(180deg)",
        transformOrigin: isTopRight ? "top right" : "bottom left",
      }}
    >
      <svg width="200" height="220" viewBox="0 0 200 220" fill="none">
        <path d="M185 8 C155 28 110 55 72 88 C45 110 22 132 12 158" stroke="#6b8f71" strokeWidth="2" strokeLinecap="round"/>
        <path d="M175 4 C148 24 115 48 88 78 C65 104 48 128 42 162" stroke="#6b8f71" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <path d="M165 12 C145 32 125 52 108 72 C90 95 78 118 72 148" stroke="#7a9e7e" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <ellipse cx="128" cy="40"  rx="24" ry="15" fill="#7a9e7e" opacity="0.70" transform="rotate(-22 128 40)"/>
        <ellipse cx="100" cy="62"  rx="26" ry="16" fill="#8fac8f" opacity="0.65" transform="rotate(-30 100 62)"/>
        <ellipse cx="148" cy="24"  rx="20" ry="13" fill="#6b8f71" opacity="0.60" transform="rotate(-12 148 24)"/>
        <ellipse cx="78"  cy="86"  rx="24" ry="15" fill="#7a9e7e" opacity="0.62" transform="rotate(-38 78 86)"/>
        <ellipse cx="115" cy="52"  rx="18" ry="12" fill="#9fbc9f" opacity="0.55" transform="rotate(-18 115 52)"/>
        <ellipse cx="58"  cy="108" rx="22" ry="13" fill="#8fac8f" opacity="0.58" transform="rotate(-42 58 108)"/>
        <ellipse cx="88"  cy="74"  rx="16" ry="10" fill="#6b8f71" opacity="0.50" transform="rotate(-25 88 74)"/>
        <ellipse cx="168" cy="16"  rx="17" ry="11" fill="#7a9e7e" opacity="0.55" transform="rotate(-8 168 16)"/>
        <ellipse cx="140" cy="34"  rx="15" ry="9"  fill="#9fbc9f" opacity="0.42" transform="rotate(-28 140 34)"/>
        <ellipse cx="68"  cy="98"  rx="18" ry="11" fill="#8fac8f" opacity="0.40" transform="rotate(-48 68 98)"/>
        <ellipse cx="48"  cy="122" rx="14" ry="8"  fill="#7a9e7e" opacity="0.35" transform="rotate(-50 48 122)"/>
      </svg>
    </div>
  );
}

// ─── Dried golden branch accent ────────────────────────────────────────────────
function GoldenBranch({ position }: { position: "left" | "bottom-right" }) {
  const isLeft = position === "left";
  return (
    <div className="absolute pointer-events-none"
      style={{
        top: isLeft ? "38%" : undefined, bottom: isLeft ? undefined : "8%",
        left: isLeft ? 0 : undefined, right: isLeft ? undefined : 0,
        zIndex: 3,
        transform: isLeft ? "rotate(12deg)" : "scaleX(-1) rotate(8deg)",
        transformOrigin: isLeft ? "top left" : "bottom right",
      }}
    >
      <svg width="90" height="140" viewBox="0 0 90 140" fill="none">
        <path d="M45 138 C42 108 38 78 34 50 C30 30 28 16 32 4" stroke="#c9a96e" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M34 50 C22 44 12 48 6 56"  stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" opacity="0.65"/>
        <path d="M36 70 C24 64 14 68 8 76"  stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" opacity="0.60"/>
        <path d="M38 90 C26 84 16 88 10 96" stroke="#c9a96e" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
        <path d="M32 28 C20 22 12 26 8 34"  stroke="#c9a96e" strokeWidth="0.9" strokeLinecap="round" opacity="0.60"/>
        <ellipse cx="28" cy="48"  rx="11" ry="6" fill="#c9a96e" opacity="0.62" transform="rotate(-35 28 48)"/>
        <ellipse cx="22" cy="68"  rx="10" ry="6" fill="#d4a870" opacity="0.58" transform="rotate(-40 22 68)"/>
        <ellipse cx="20" cy="88"  rx="9"  ry="5" fill="#c9a96e" opacity="0.54" transform="rotate(-42 20 88)"/>
        <ellipse cx="26" cy="26"  rx="10" ry="5" fill="#d4a870" opacity="0.58" transform="rotate(-28 26 26)"/>
        <ellipse cx="34" cy="14"  rx="9"  ry="5" fill="#c9a96e" opacity="0.52" transform="rotate(-15 34 14)"/>
      </svg>
    </div>
  );
}

// ─── Golden arch frame ─────────────────────────────────────────────────────────
function GoldenArch({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-xs mx-auto px-6 pt-10 pb-8"
      style={{
        border: `1.5px solid ${color}`,
        borderBottom: "none",
        borderTopLeftRadius: "50% 18%",
        borderTopRightRadius: "50% 18%",
      }}
    >
      {children}
    </div>
  );
}

// ─── Invitation text content (shared between card section and no-cover hero) ──
function InvitationContent({
  event, participant, theme,
  headingColor, subColor, mutedColor, dividerColor, parentsConfig,
}: {
  event: Event; participant: Participant; theme: ThemeConfig;
  headingColor: string; subColor: string; mutedColor: string; dividerColor: string;
  parentsConfig?: ParentsConfig;
}) {
  const isBotanical = theme.layoutVariant === "botanical";
  const brideNames     = parentsConfig?.brideParentNames  ?? [];
  const groomNames     = parentsConfig?.groomParentNames  ?? [];
  const godfatherNames = parentsConfig?.godfatherNames    ?? [];
  const hasParents     = brideNames.length > 0 || groomNames.length > 0;
  const hasGodparents  = godfatherNames.length > 0;
  const showParents    = !!parentsConfig && (hasParents || hasGodparents);

  return (
    <div className="space-y-4 w-full text-center">
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1 }}
        className="w-16 h-px mx-auto" style={{ backgroundColor: dividerColor }}/>

      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-2xl" style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
        {event.style.greetingText?.trim() || "Estimado/a"}
      </motion.p>

      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="text-3xl md:text-4xl font-light" style={{ color: headingColor }}>
        {participant.name}
      </motion.h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        {isBotanical ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8" style={{ backgroundColor: dividerColor, opacity: 0.6 }}/>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M10 1 C6 1 1 4 1 6 C1 8 6 11 10 11 C14 11 19 8 19 6 C19 4 14 1 10 1Z"
                    stroke={dividerColor} strokeWidth="0.9" fill="none" opacity="0.7"/>
              <circle cx="10" cy="6" r="1.5" fill={dividerColor} opacity="0.8"/>
            </svg>
            <div className="h-px w-8" style={{ backgroundColor: dividerColor, opacity: 0.6 }}/>
          </div>
        ) : (
          <div className="w-12 h-px mx-auto" style={{ backgroundColor: dividerColor }}/>
        )}
      </motion.div>

      {event.style.eventType === "wedding" && event.style.person1Name && event.style.person2Name ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="space-y-0 leading-none">
          <p className="text-3xl md:text-5xl" style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
            {event.style.person1Name}
          </p>
          <p className="text-xl md:text-2xl font-light py-1" style={{ color: dividerColor }}>&amp;</p>
          <p className="text-3xl md:text-5xl" style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
            {event.style.person2Name}
          </p>
        </motion.div>
      ) : (
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="text-3xl md:text-5xl font-light leading-tight" style={{ color: headingColor }}>
          {event.name}
        </motion.h1>
      )}

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="text-sm md:text-base tracking-widest uppercase" style={{ color: subColor }}>
        {formatDate(event.date)}
      </motion.p>

      {event.location && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="text-sm tracking-wide" style={{ color: mutedColor, opacity: 0.8 }}>
          {event.location}
        </motion.p>
      )}

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.6 }}
        className="w-16 h-px mx-auto" style={{ backgroundColor: dividerColor }}/>

      {/* Parents & godparents — inline in hero */}
      {showParents && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7 }}
          className="pt-2 space-y-4"
        >
          {hasParents && (
            <div className="grid grid-cols-2 gap-4">
              {brideNames.length > 0 && (
                <div className="space-y-1">
                  {parentsConfig?.brideParentsLabel && (
                    <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: subColor, opacity: 0.7 }}>
                      {parentsConfig.brideParentsLabel}
                    </p>
                  )}
                  {brideNames.map((n, i) => (
                    <p key={i} className="text-lg font-light leading-snug"
                       style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
                      {n}
                    </p>
                  ))}
                </div>
              )}
              {groomNames.length > 0 && (
                <div className="space-y-1">
                  {parentsConfig?.groomParentsLabel && (
                    <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: subColor, opacity: 0.7 }}>
                      {parentsConfig.groomParentsLabel}
                    </p>
                  )}
                  {groomNames.map((n, i) => (
                    <p key={i} className="text-lg font-light leading-snug"
                       style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
                      {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasGodparents && (
            <div className="space-y-1">
              <div className="h-px w-10 mx-auto" style={{ backgroundColor: dividerColor, opacity: 0.35 }} />
              {parentsConfig?.godfathersLabel && (
                <p className="text-[10px] tracking-widest uppercase" style={{ color: subColor, opacity: 0.7 }}>
                  {parentsConfig.godfathersLabel}
                </p>
              )}
              {godfatherNames.map((n, i) => (
                <p key={i} className="text-lg font-light leading-snug"
                   style={{ fontFamily: "Great Vibes, cursive", color: headingColor }}>
                  {n}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── BotanicalInvitationCard ───────────────────────────────────────────────────
// Exported so InvitationPage can render it as a separate section after a cover photo.
export function BotanicalInvitationCard({ event, participant, theme, parentsConfig }: Props) {
  return (
    <section className={`relative py-16 overflow-hidden ${theme.sectionClass}`}>
      <WatercolorSplashes />
      <LeafCluster corner="top-right" />
      <LeafCluster corner="bottom-left" />
      <GoldenBranch position="left" />
      <GoldenBranch position="bottom-right" />
      <div className="relative flex justify-center px-4" style={{ zIndex: 10 }}>
        <GoldenArch color={theme.accent}>
          <InvitationContent
            event={event} participant={participant} theme={theme}
            headingColor={theme.primary} subColor={theme.accent}
            mutedColor={theme.primary} dividerColor={theme.accent}
            parentsConfig={parentsConfig}
          />
        </GoldenArch>
      </div>
    </section>
  );
}

// ─── Save the Date — shared date helpers ──────────────────────────────────────
const STD_DAYS   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const STD_MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function parseDateParts(dateStr: string) {
  const d     = new Date(dateStr);
  const h     = d.getHours();
  const mins  = String(d.getMinutes()).padStart(2, "0");
  const ampm  = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return {
    dayName : STD_DAYS[d.getDay()],
    dayNum  : d.getDate(),
    month   : STD_MONTHS[d.getMonth()],
    year    : d.getFullYear(),
    timeStr : `${hour12}:${mins} ${ampm}`,
  };
}

// ─── Style 1: CINEMATIC — full-bleed photo, script title, dark vignette ───────
function SaveTheDateCinematic({ event, theme }: { event: Event; theme: ThemeConfig }) {
  const hasCover = !!event.cover_image;
  const name1    = event.style.person1Name?.trim();
  const name2    = event.style.person2Name?.trim();
  const hasPair  = !!(name1 && name2);
  const { dayName, dayNum, month, year, timeStr } = parseDateParts(event.date);
  const fallback = `linear-gradient(160deg, ${theme.primary} 0%, ${theme.accent}cc 100%)`;

  return (
    <section className="relative h-screen flex flex-col items-center justify-between overflow-hidden">
      {hasCover ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: `url(${event.cover_image})` }}/>
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.06) 42%, rgba(0,0,0,0.06) 55%, rgba(0,0,0,0.65) 100%)" }}/>
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: fallback }}/>
      )}

      {/* "Save the Date" script — top */}
      <motion.div
        initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center pt-14 px-6 w-full"
      >
        <p style={{
          fontFamily: "Great Vibes, cursive",
          fontSize: "clamp(3rem, 14vw, 5.5rem)",
          color: "white", lineHeight: 1.15,
          textShadow: "0 2px 16px rgba(0,0,0,0.35)",
        }}>Save the Date</p>
      </motion.div>

      {/* Names + date row — bottom */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center pb-16 px-6 w-full"
      >
        <div className="mb-6">
          {hasPair ? (
            <h1 suppressHydrationWarning style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(2rem, 10vw, 4rem)", fontWeight: 700,
              color: "white", letterSpacing: "0.04em",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)", lineHeight: 1.1,
            }}>{name1} + {name2}</h1>
          ) : (
            <h1 style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(1.8rem, 9vw, 3.5rem)", fontWeight: 700,
              color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}>{event.name}</h1>
          )}
        </div>

        {/* Day/Time | DayNum | Month/Year */}
        <div className="flex items-center justify-center gap-4 md:gap-6 text-white">
          <div className="text-right" suppressHydrationWarning>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(0.85rem,3.5vw,1.05rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "capitalize" }}>{dayName}</p>
            <p style={{ fontSize: "clamp(0.72rem,2.8vw,0.85rem)", opacity: 0.75, letterSpacing: "0.05em" }}>{timeStr}</p>
          </div>
          <div style={{ width: 1, height: 48, backgroundColor: "rgba(255,255,255,0.45)" }}/>
          <div suppressHydrationWarning>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.8rem,12vw,5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>{dayNum}</p>
          </div>
          <div style={{ width: 1, height: 48, backgroundColor: "rgba(255,255,255,0.45)" }}/>
          <div className="text-left" suppressHydrationWarning>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(0.85rem,3.5vw,1.05rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "capitalize" }}>{month}</p>
            <p style={{ fontSize: "clamp(0.72rem,2.8vw,0.85rem)", opacity: 0.75, letterSpacing: "0.05em" }}>{year}</p>
          </div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-4 z-10 flex flex-col items-center gap-1">
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Ver invitación</p>
        <motion.div animate={{ y: [0,8,0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8" style={{ backgroundColor: "rgba(255,255,255,0.35)" }}/>
      </motion.div>
    </section>
  );
}

// ─── Style 2: EDITORIAL — newspaper layout, light bg, bold serif, framed photo ─
function SaveTheDateEditorial({ event }: { event: Event }) {
  const hasCover = !!event.cover_image;
  const name1    = event.style.person1Name?.trim();
  const name2    = event.style.person2Name?.trim();
  const hasPair  = !!(name1 && name2);
  const { dayName, dayNum, month, year } = parseDateParts(event.date);

  const BG   = "#f7f4ef";
  const INK  = "#111111";
  const RULE = "1.5px solid #111111";
  const FONT = "Cormorant Garamond, Georgia, serif";

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: BG }}>

      {/* ── TITLE BLOCK ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="px-8 pt-10 pb-0"
      >
        <div style={{ borderTop: RULE, paddingTop: 10 }}>
          <p style={{
            fontFamily: FONT,
            fontSize: "clamp(2rem, 9vw, 3.8rem)",
            fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.1em", color: INK,
            textAlign: "center", lineHeight: 1,
          }}>
            Save the Date
          </p>
        </div>
        <div style={{ borderBottom: RULE, marginTop: 10 }}/>
      </motion.div>

      {/* ── PHOTO ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-8 my-5 overflow-hidden flex-1"
        style={{ minHeight: "38vh", maxHeight: "52vh" }}
      >
        {hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.cover_image!} alt="" className="w-full h-full object-cover" style={{ display: "block" }}/>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2"
               style={{ backgroundColor: "#d8d5cf", minHeight: "38vh" }}>
            <p style={{ color: "#888", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Foto de portada
            </p>
          </div>
        )}
      </motion.div>

      {/* ── NAMES ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="px-8"
      >
        <h1 suppressHydrationWarning style={{
          fontFamily: FONT,
          fontSize: "clamp(2.2rem, 11vw, 5rem)",
          fontWeight: 900, textTransform: "uppercase",
          letterSpacing: "0.06em", color: INK,
          textAlign: "center", lineHeight: 1.05,
        }}>
          {hasPair ? `${name1} & ${name2}` : event.name}
        </h1>
      </motion.div>

      {/* ── DATE + LOCATION footer ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="px-8 pb-10 pt-4"
      >
        <div style={{ borderTop: "1px solid #111", marginBottom: 10 }}/>
        <div className="flex justify-between items-start gap-4">
          <p suppressHydrationWarning style={{
            fontFamily: FONT, fontSize: "clamp(0.6rem,2.8vw,0.82rem)",
            textTransform: "uppercase", letterSpacing: "0.14em", color: INK,
            lineHeight: 1.4,
          }}>
            {dayName} {month} {dayNum}, {year}
          </p>
          {event.location && (
            <p style={{
              fontFamily: FONT, fontSize: "clamp(0.6rem,2.8vw,0.82rem)",
              textTransform: "uppercase", letterSpacing: "0.14em", color: INK,
              lineHeight: 1.4, textAlign: "right",
            }}>
              {event.location}
            </p>
          )}
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <motion.div animate={{ y: [0,8,0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}/>
      </motion.div>
    </section>
  );
}

// ─── Dispatcher ────────────────────────────────────────────────────────────────
function SaveTheDateHero({ event, theme }: { event: Event; theme: ThemeConfig }) {
  return event.style.saveTheDateStyle === "editorial"
    ? <SaveTheDateEditorial event={event} />
    : <SaveTheDateCinematic event={event} theme={theme} />;
}

// ─── Default export: HeroSection ──────────────────────────────────────────────
export default function HeroSection({ event, participant, theme, parentsConfig }: Props) {
  const isBotanical   = theme.layoutVariant === "botanical";
  const hasCover      = !!event.cover_image;
  const isSaveTheDate = event.style.eventType === "save_the_date";

  // ── SAVE THE DATE: custom photo hero with script title + date layout ───────
  if (isSaveTheDate) {
    return <SaveTheDateHero event={event} theme={theme} />;
  }

  // ── WITH COVER: clean photo + event name only ──────────────────────────────
  if (hasCover) {
    return (
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Full-bleed photo */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${event.cover_image})` }}/>
        <div className="absolute inset-0 bg-black/35"/>

        {/* Event name — spaced uppercase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 text-center px-8 space-y-4"
        >
          <p className="text-[11px] tracking-[0.45em] uppercase text-white/65">
            {formatDate(event.date)}
          </p>
          <h1 className="text-3xl md:text-5xl tracking-[0.22em] font-light text-white uppercase leading-relaxed">
            {event.name}
          </h1>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        >
          <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase">Ver invitación</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-10"
            style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
          />
        </motion.div>
      </section>
    );
  }

  // ── WITHOUT COVER: botanical full card ────────────────────────────────────
  if (isBotanical) {
    return (
      <section className={`relative min-h-screen flex items-center overflow-hidden ${theme.sectionClass}`}>
        <WatercolorSplashes />
        <LeafCluster corner="top-right" />
        <LeafCluster corner="bottom-left" />
        <GoldenBranch position="left" />
        <GoldenBranch position="bottom-right" />
        <div className="relative w-full flex justify-center py-16 px-4" style={{ zIndex: 10 }}>
          <GoldenArch color={theme.accent}>
            <InvitationContent
              event={event} participant={participant} theme={theme}
              headingColor={theme.primary} subColor={theme.accent}
              mutedColor={theme.primary} dividerColor={theme.accent}
              parentsConfig={parentsConfig}
            />
          </GoldenArch>
        </div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-10 mx-auto" style={{ backgroundColor: theme.accent }}/>
        </motion.div>
      </section>
    );
  }

  // ── WITHOUT COVER: standard (non-botanical) layout ────────────────────────
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div className="max-w-lg mx-auto">
        <InvitationContent
          event={event} participant={participant} theme={theme}
          headingColor={theme.primary} subColor={theme.accent}
          mutedColor={theme.primary} dividerColor={theme.accent}
          parentsConfig={parentsConfig}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 mx-auto" style={{ backgroundColor: theme.accent }}/>
      </motion.div>
    </section>
  );
}
