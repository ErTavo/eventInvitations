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
        Estimado/a
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

      {participant.companions > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs tracking-widest uppercase border"
          style={{ borderColor: dividerColor, color: headingColor }}>
          Mesa para {1 + participant.companions} personas
        </motion.div>
      )}

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.8 }}
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

// ─── Default export: HeroSection ──────────────────────────────────────────────
export default function HeroSection({ event, participant, theme, parentsConfig }: Props) {
  const isBotanical = theme.layoutVariant === "botanical";
  const hasCover    = !!event.cover_image;

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
