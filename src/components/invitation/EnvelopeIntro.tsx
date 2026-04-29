"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Event, Participant } from "@/lib/supabase/types";
import type { ThemeConfig } from "./themes";

interface Props {
  event: Event;
  participant: Participant;
  theme: ThemeConfig;
  onOpen: () => void;
}

type Phase = "idle" | "shaking" | "opening" | "rising" | "revealing" | "done";

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ─── Desk decorations ──────────────────────────────────────────────────────────

function QuillPen({ color }: { color: string }) {
  return (
    <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
      {/* Quill shaft */}
      <path d="M8 40 Q40 28 80 18 Q100 13 114 8"
            stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      {/* Barbs left */}
      <path d="M40 30 Q36 24 30 26" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M55 26 Q50 19 44 21" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M70 22 Q65 15 59 17" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M85 18 Q80 11 74 13" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      {/* Barbs right */}
      <path d="M40 30 Q44 36 50 34" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M55 26 Q60 32 66 30" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      <path d="M70 22 Q76 28 82 26" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
      {/* Nib */}
      <path d="M114 8 L118 6 L116 10 Z" fill={color} opacity="0.8"/>
      {/* Ink tip */}
      <circle cx="117" cy="8" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  );
}

function FloralSprig({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
      {/* Main stem */}
      <path d="M40 98 C38 80 34 60 30 40 C26 22 22 10 28 2"
            stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.65"/>
      {/* Branch left */}
      <path d="M34 55 C24 50 16 54 14 62" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      {/* Branch right */}
      <path d="M31 38 C42 34 50 38 52 46" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
      {/* Small branch */}
      <path d="M29 22 C20 18 14 22 12 28" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.45"/>
      {/* Leaf cluster left */}
      <ellipse cx="20" cy="56" rx="10" ry="6" fill={color} opacity="0.55" transform="rotate(-20 20 56)"/>
      <ellipse cx="16" cy="62" rx="8" ry="5" fill={color} opacity="0.42" transform="rotate(-10 16 62)"/>
      {/* Leaf cluster right */}
      <ellipse cx="46" cy="40" rx="9" ry="5.5" fill={color} opacity="0.52" transform="rotate(15 46 40)"/>
      <ellipse cx="50" cy="46" rx="7" ry="4" fill={color} opacity="0.4" transform="rotate(20 50 46)"/>
      {/* Top leaf */}
      <ellipse cx="26" cy="14" rx="8" ry="5" fill={color} opacity="0.5" transform="rotate(-35 26 14)"/>
      {/* Berries */}
      <circle cx="16" cy="50" r="3.5" fill={accent} opacity="0.75"/>
      <circle cx="22" cy="46" r="2.5" fill={accent} opacity="0.65"/>
      <circle cx="48" cy="36" r="3"   fill={accent} opacity="0.70"/>
      <circle cx="12" cy="26" r="2.5" fill={accent} opacity="0.60"/>
    </svg>
  );
}

function WaxKit({ color }: { color: string }) {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
      {/* Candle body */}
      <rect x="18" y="28" width="20" height="38" rx="3" fill={color} opacity="0.35"
            stroke={color} strokeWidth="1"/>
      {/* Wax drips */}
      <path d="M18 32 Q14 36 16 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M38 34 Q42 38 40 45" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>
      {/* Wick */}
      <path d="M28 28 L28 20" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      {/* Flame */}
      <path d="M28 20 C26 16 24 12 28 8 C32 12 30 16 28 20Z"
            fill={color} opacity="0.65"/>
      <ellipse cx="28" cy="18" rx="3" ry="4" fill={color} opacity="0.25"/>
      {/* Wax pool glow */}
      <ellipse cx="28" cy="28" rx="12" ry="4" fill={color} opacity="0.18"/>
      {/* Stamp seal (below candle) */}
      <circle cx="28" cy="60" r="8" fill={color} opacity="0.22" stroke={color} strokeWidth="0.8"/>
      <text x="28" y="64" textAnchor="middle" fontSize="8" fill={color} opacity="0.6"
            fontFamily="serif">✦</text>
    </svg>
  );
}

function EnvelopeBranch({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M6 44 Q14 30 24 20 Q32 12 40 6"
            stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 20 Q33 24 36 16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
      <path d="M32 12 Q38 18 43 14" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wax seal SVG — realistic dripped-wax look
// ─────────────────────────────────────────────────────────────────────────────

function WaxSealSvg({ bg, fg, initials, size = 56 }: {
  bg: string; fg: string; initials: string; size?: number;
}) {
  const c = size / 2;
  const outerR = c - 2;

  // Bumpy outer edge (alternating slightly larger bumps simulating wax drips)
  function bumpyPath(r: number, bump: number, n = 20): string {
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r + bump;
      pts.push(`${(c + rad * Math.cos(angle)).toFixed(2)},${(c + rad * Math.sin(angle)).toFixed(2)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  }

  // Radial tick marks inside the ring (like a stamp impression)
  const ticks = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * 2 * Math.PI;
    const r1 = outerR - 6;
    const r2 = outerR - 10;
    return {
      x1: c + r1 * Math.cos(angle), y1: c + r1 * Math.sin(angle),
      x2: c + r2 * Math.cos(angle), y2: c + r2 * Math.sin(angle),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
         style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.40))" }}>

      {/* Outer wax blob with bumpy edge */}
      <path d={bumpyPath(outerR, 2.8)} fill={bg} opacity="0.97"/>

      {/* Subtle inner depth shadow */}
      <circle cx={c+1} cy={c+2} r={outerR - 5} fill="black" opacity="0.1"/>

      {/* Pressed impression area (slightly lighter) */}
      <circle cx={c} cy={c} r={outerR - 5} fill={bg} opacity="0.35"/>

      {/* Outer decorative ring */}
      <circle cx={c} cy={c} r={outerR - 5} stroke={fg} strokeWidth="0.9" opacity="0.35" fill="none"/>

      {/* Radial tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={fg} strokeWidth="0.8" opacity="0.22"/>
      ))}

      {/* Inner ring */}
      <circle cx={c} cy={c} r={outerR - 11} stroke={fg} strokeWidth="0.7" opacity="0.2" fill="none"/>

      {/* Initials or star */}
      {initials ? (
        <text x={c} y={c + size * 0.18} textAnchor="middle"
              fill={fg} opacity="0.92"
              style={{ fontFamily: "Great Vibes, cursive", fontSize: `${size * 0.36}px` }}>
          {initials}
        </text>
      ) : (
        <>
          {/* Decorative star + inner dots when no initials */}
          <text x={c} y={c + size * 0.16} textAnchor="middle"
                fill={fg} opacity="0.8"
                style={{ fontSize: `${size * 0.38}px` }}>✦</text>
          {/* 4 small dots at cardinal positions */}
          {[0, 90, 180, 270].map((deg, i) => {
            const a = deg * Math.PI / 180;
            const dr = outerR - 16;
            return <circle key={i} cx={c + dr * Math.cos(a)} cy={c + dr * Math.sin(a)}
                           r="1.5" fill={fg} opacity="0.25"/>;
          })}
        </>
      )}

      {/* Top highlight for wax convexity */}
      <ellipse cx={c - size*0.08} cy={c - size*0.18} rx={size*0.22} ry={size*0.1}
               fill="white" opacity="0.18"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Seal crack overlay — SVG lines that appear when the seal starts to break
// ─────────────────────────────────────────────────────────────────────────────

function SealCracks({ size }: { size: number }) {
  const c = size / 2;
  const cracks = [
    { d: `M${c},${c} L${c*0.15},${c*0.12}` },  // up-left
    { d: `M${c},${c} L${c*1.85},${c*0.18}` },  // up-right
    { d: `M${c},${c} L${c*0.08},${c*1.7}`  },  // left-down
    { d: `M${c},${c} L${c*1.9},${c*1.85}`  },  // down-right
    { d: `M${c},${c} L${c*1.0},${c*0.05}`  },  // straight up
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
         className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {cracks.map((crack, i) => (
        <motion.path
          key={i}
          d={crack.d}
          stroke="rgba(0,0,0,0.75)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.9, 0.6] }}
          transition={{ duration: 0.22, delay: i * 0.04 }}
        />
      ))}
    </svg>
  );
}

// Wax fragments that fly apart when the seal breaks
function SealFragments({ size, color }: { size: number; color: string }) {
  const c = size / 2;
  const fragments = [
    { dx: -50, dy: -45, rotate: -140, scale: 0.4, clip: "polygon(0 0,55% 0,30% 55%,0 50%)"  },
    { dx:  55, dy: -50, rotate:  120, scale: 0.35, clip: "polygon(45% 0,100% 0,100% 45%,60% 30%)" },
    { dx: -48, dy:  50, rotate: -110, scale: 0.38, clip: "polygon(0 50%,35% 35%,20% 100%,0 100%)" },
    { dx:  52, dy:  52, rotate:  130, scale: 0.33, clip: "polygon(60% 40%,100% 55%,100% 100%,50% 100%)" },
  ];
  return (
    <>
      {fragments.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, width: size, height: size, zIndex: 2 }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
          animate={{ x: f.dx, y: f.dy, rotate: f.rotate, opacity: 0, scale: f.scale }}
          transition={{ duration: 0.55, delay: 0.18 + i * 0.04, ease: [0.2, 0, 0.8, 1] }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
               style={{ clipPath: f.clip }}>
            {/* Fragment has the full seal appearance */}
            <circle cx={c} cy={c} r={c-1} fill={color} opacity="0.95"/>
            <circle cx={c} cy={c} r={c-6} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" fill="none"/>
          </svg>
        </motion.div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ribbon designs — 6 styles, all sharing (color, width) props
// SVG height and top offset vary per design.
// ─────────────────────────────────────────────────────────────────────────────

type RibbonStyle = "classic" | "crossed" | "minimal" | "floral" | "romantic" | "luxury";

// 1. CLASSIC — realistic gift bow using clean 2-bezier loop geometry
function RibbonClassic({ color, width }: { color: string; width: number }) {
  const cx = width / 2;          // 150
  const bt = 58; const bb = 73;  // band top / bottom  in SVG
  const bm = (bt + bb) / 2;      // 65.5 — band mid

  // Loop tips (outer extremes)
  const LX = cx - 118;  // 32  — left tip x
  const LY = 28;         // left tip y
  const RX = cx + 118;  // 268 — right tip x
  const RY = 28;         // right tip y

  return (
    <svg width={width} height="148" viewBox={`0 0 ${width} 148`} fill="none"
         className="absolute pointer-events-none" style={{ top: 40, left: 0, zIndex: 5 }}>

      {/* ── TAILS — V-cut, rendered behind loops ── */}
      {/* Left tail: 12 px wide, curves left, ends in a V */}
      <path d={`M${cx-16} ${bb} C${cx-22} 96 ${cx-38} 124 ${cx-26} 144 C${cx-20} 148 ${cx-12} 148 ${cx-8} 140 C${cx-4} 130 ${cx-4} 96 ${cx-4} ${bb}Z`}
            fill={color} opacity="0.82"/>
      <path d={`M${cx-15} ${bb+2} C${cx-20} 98 ${cx-34} 122 ${cx-24} 142`}
            stroke="white" strokeWidth="1.5" opacity="0.18" fill="none" strokeLinecap="round"/>
      {/* Right tail */}
      <path d={`M${cx+4} ${bb} C${cx+4} 96 ${cx+4} 130 ${cx+8} 140 C${cx+12} 148 ${cx+20} 148 ${cx+26} 144 C${cx+38} 124 ${cx+22} 96 ${cx+16} ${bb}Z`}
            fill={color} opacity="0.82"/>
      <path d={`M${cx+15} ${bb+2} C${cx+20} 98 ${cx+34} 122 ${cx+24} 142`}
            stroke="white" strokeWidth="1.5" opacity="0.18" fill="none" strokeLinecap="round"/>

      {/* ── LEFT LOOP ──
           Two cubic beziers: top arc sweeps up-left to LX,LY then bottom arc returns.
           This produces a clean, symmetrical rounded bow loop. ── */}
      <path d={`M${cx-20} ${bt} C${cx-40} 10 ${cx-96} 4 ${LX} ${LY} C${cx-132} 46 ${cx-88} 78 ${cx-20} ${bb}Z`}
            fill={color} opacity="0.87"/>
      {/* Inner shadow — inset concave fill simulating the inside of the loop */}
      <path d={`M${cx-20} ${bt+4} C${cx-42} 18 ${cx-90} 12 ${LX+10} ${LY+6} C${cx-118} 50 ${cx-82} 74 ${cx-20} ${bb-4}Z`}
            fill="black" opacity="0.11"/>
      {/* Outer highlight along the top arc */}
      <path d={`M${cx-42} 14 C${cx-72} 4 ${cx-104} 8 ${cx-122} ${LY}`}
            stroke="white" strokeWidth="3" opacity="0.28" strokeLinecap="round" fill="none"/>
      <path d={`M${cx-38} 24 C${cx-66} 14 ${cx-98} 14 ${cx-118} 32`}
            stroke="white" strokeWidth="1.2" opacity="0.14" strokeLinecap="round" fill="none"/>
      {/* Bottom-inner edge crease shadow */}
      <path d={`M${cx-20} ${bt+6} C${cx-42} 22 ${cx-86} 14 ${LX+12} ${LY+10}`}
            stroke="black" strokeWidth="2" opacity="0.08" fill="none"/>

      {/* ── RIGHT LOOP — exact mirror ── */}
      <path d={`M${cx+20} ${bt} C${cx+40} 10 ${cx+96} 4 ${RX} ${RY} C${cx+132} 46 ${cx+88} 78 ${cx+20} ${bb}Z`}
            fill={color} opacity="0.87"/>
      <path d={`M${cx+20} ${bt+4} C${cx+42} 18 ${cx+90} 12 ${RX-10} ${RY+6} C${cx+118} 50 ${cx+82} 74 ${cx+20} ${bb-4}Z`}
            fill="black" opacity="0.11"/>
      <path d={`M${cx+42} 14 C${cx+72} 4 ${cx+104} 8 ${cx+122} ${RY}`}
            stroke="white" strokeWidth="3" opacity="0.28" strokeLinecap="round" fill="none"/>
      <path d={`M${cx+38} 24 C${cx+66} 14 ${cx+98} 14 ${cx+118} 32`}
            stroke="white" strokeWidth="1.2" opacity="0.14" strokeLinecap="round" fill="none"/>
      <path d={`M${cx+20} ${bt+6} C${cx+42} 22 ${cx+86} 14 ${RX-12} ${RY+10}`}
            stroke="black" strokeWidth="2" opacity="0.08" fill="none"/>

      {/* ── HORIZONTAL BAND ── */}
      <rect x="0" y={bt} width={width} height={bb-bt} fill={color} opacity="0.85" rx="1"/>
      <rect x="0" y={bt}   width={width} height="5" fill="white" opacity="0.25" rx="1"/>
      <rect x="0" y={bb-4} width={width} height="4" fill="black" opacity="0.07"/>

      {/* ── CENTER KNOT — wrapped-ribbon with pinch gather marks ── */}
      <ellipse cx={cx} cy={bm} rx="22" ry="9" fill={color} opacity="0.97"/>
      {/* Central pinch shadow (vertical compression) */}
      <ellipse cx={cx} cy={bm} rx="5" ry="8" fill="black" opacity="0.13"/>
      {/* Gather wrinkle lines */}
      <path d={`M${cx-8}  ${bt+2} Q${cx-12} ${bm} ${cx-8}  ${bb-2}`} stroke="black" strokeWidth="1.0" opacity="0.16" fill="none"/>
      <path d={`M${cx+8}  ${bt+2} Q${cx+12} ${bm} ${cx+8}  ${bb-2}`} stroke="black" strokeWidth="1.0" opacity="0.14" fill="none"/>
      <path d={`M${cx-16} ${bt+3} Q${cx-19} ${bm} ${cx-16} ${bb-3}`} stroke="black" strokeWidth="0.7" opacity="0.09" fill="none"/>
      <path d={`M${cx+16} ${bt+3} Q${cx+19} ${bm} ${cx+16} ${bb-3}`} stroke="black" strokeWidth="0.7" opacity="0.08" fill="none"/>
      {/* Knot highlight (light from upper-left) */}
      <ellipse cx={cx-6} cy={bm-3} rx="10" ry="4.5" fill="white" opacity="0.26"/>
    </svg>
  );
}

// 2. CROSSED — two diagonal ribbons with satin sheen, crossing depth, gathered knot
function RibbonCrossed({ color, width }: { color: string; width: number }) {
  const cx = width / 2; const h = 210; const cy = h / 2;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none"
         className="absolute pointer-events-none" style={{ top: 0, left: 0, zIndex: 5 }}>

      {/* ── BAND 1: top-left → bottom-right (underneath) ── */}
      <path d={`M-10 0 L${width*0.38} ${h} L${width*0.48} ${h} L10 0Z`}
            fill={color} opacity="0.68"/>
      {/* Band 1 left-edge highlight (top surface catches light) */}
      <path d={`M-8 0 L${width*0.40} ${h}`}
            stroke="white" strokeWidth="3" opacity="0.22" strokeLinecap="round"/>
      {/* Band 1 center satin sheen */}
      <path d={`M0 0 L${width*0.43} ${h}`}
            stroke="white" strokeWidth="6" opacity="0.07"/>
      {/* Band 1 right-edge shadow */}
      <path d={`M8 0 L${width*0.47} ${h}`}
            stroke="black" strokeWidth="2" opacity="0.10"/>

      {/* ── BAND 2: top-right → bottom-left (on top) ── */}
      <path d={`M${width+10} 0 L${width*0.62} ${h} L${width*0.52} ${h} L${width-10} 0Z`}
            fill={color} opacity="0.68"/>
      {/* Band 2 left-edge highlight */}
      <path d={`M${width+8} 0 L${width*0.60} ${h}`}
            stroke="white" strokeWidth="3" opacity="0.22" strokeLinecap="round"/>
      {/* Band 2 center satin sheen */}
      <path d={`M${width} 0 L${width*0.57} ${h}`}
            stroke="white" strokeWidth="6" opacity="0.07"/>
      {/* Band 2 right-edge shadow */}
      <path d={`M${width-8} 0 L${width*0.54} ${h}`}
            stroke="black" strokeWidth="2" opacity="0.10"/>

      {/* ── Depth shadow at crossing — band 2 casts shadow on band 1 ── */}
      <ellipse cx={cx} cy={cy} rx="28" ry="22"
               fill="black" opacity="0.08" transform={`rotate(-34, ${cx}, ${cy})`}/>

      {/* ── CENTER KNOT — gathered ribbon at cross ── */}
      <ellipse cx={cx} cy={cy} rx="20" ry="15" fill={color} opacity="0.96"/>
      {/* Pinch shadow */}
      <line x1={cx} y1={cy-10} x2={cx} y2={cy+10}
            stroke="black" strokeWidth="6" opacity="0.10" strokeLinecap="round"/>
      {/* Fabric fold lines */}
      <path d={`M${cx-5} ${cy-9}  Q${cx}   ${cy} ${cx-5} ${cy+9}`}  stroke="black" strokeWidth="0.9" opacity="0.14" fill="none"/>
      <path d={`M${cx+5} ${cy-9}  Q${cx}   ${cy} ${cx+5} ${cy+9}`}  stroke="black" strokeWidth="0.9" opacity="0.12" fill="none"/>
      <path d={`M${cx-9} ${cy-6}  Q${cx-3} ${cy} ${cx-9} ${cy+6}`}  stroke="black" strokeWidth="0.6" opacity="0.08" fill="none"/>
      <path d={`M${cx+9} ${cy-6}  Q${cx+3} ${cy} ${cx+9} ${cy+6}`}  stroke="black" strokeWidth="0.6" opacity="0.07" fill="none"/>
      {/* Knot highlight */}
      <ellipse cx={cx-5} cy={cy-4} rx="8" ry="5" fill="white" opacity="0.30"/>
    </svg>
  );
}

// 3. MINIMAL — single thin band with small side bows at both ends
function RibbonMinimal({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  return (
    <svg width={width} height="70" viewBox={`0 0 ${width} 70`} fill="none"
         className="absolute pointer-events-none" style={{ top: 70, left: 0, zIndex: 5 }}>
      {/* Thin band */}
      <rect x="0" y="30" width={width} height="10" fill={color} opacity="0.65" rx="5"/>
      <rect x="0" y="30" width={width} height="3"  fill="white" opacity="0.25" rx="5"/>
      {/* Left small bow */}
      <path d={`M18 35 C10 20 0 18 4 30 C6 38 14 40 18 35Z`} fill={color} opacity="0.8"/>
      <path d={`M18 35 C10 50 0 52 4 40 C6 32 14 30 18 35Z`} fill={color} opacity="0.7"/>
      <ellipse cx="18" cy="35" rx="5" ry="4" fill={color} opacity="0.95"/>
      <ellipse cx="16" cy="33" rx="2" ry="1.5" fill="white" opacity="0.35"/>
      {/* Right small bow (mirror) */}
      <path d={`M${width-18} 35 C${width-10} 20 ${width} 18 ${width-4} 30 C${width-6} 38 ${width-14} 40 ${width-18} 35Z`} fill={color} opacity="0.8"/>
      <path d={`M${width-18} 35 C${width-10} 50 ${width} 52 ${width-4} 40 C${width-6} 32 ${width-14} 30 ${width-18} 35Z`} fill={color} opacity="0.7"/>
      <ellipse cx={width-18} cy="35" rx="5" ry="4" fill={color} opacity="0.95"/>
      <ellipse cx={width-16} cy="33" rx="2" ry="1.5" fill="white" opacity="0.35"/>
      {/* Center accent */}
      <circle cx={cx} cy="35" r="5" fill={color} opacity="1"/>
      <circle cx={cx} cy="35" r="2.5" fill="white" opacity="0.35"/>
    </svg>
  );
}

// 4. FLORAL — satin band with layered roses (petal depth via multiple ellipse passes)
function RibbonFloral({ color, width }: { color: string; width: number }) {
  const cx = width / 2;

  function Rose({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
    const petals5 = [0, 72, 144, 216, 288];
    const n4 = (v: number) => Math.round(v * 10000) / 10000;
    return (
      <g>
        {/* Back petal layer — slightly larger, darker (shadow side) */}
        {petals5.map((deg, i) => {
          const rad = deg * Math.PI / 180;
          const px = n4(x + Math.cos(rad) * r * 0.56);
          const py = n4(y + Math.sin(rad) * r * 0.56);
          return (
            <ellipse key={`b${i}`}
              cx={px} cy={py} rx={n4(r*0.56)} ry={n4(r*0.34)}
              fill={color} opacity={0.60}
              transform={`rotate(${deg} ${px} ${py})`}/>
          );
        })}
        {/* Shadow overlay on each back petal */}
        {petals5.map((deg, i) => {
          const rad = deg * Math.PI / 180;
          const px = n4(x + Math.cos(rad) * r * 0.60);
          const py = n4(y + Math.sin(rad) * r * 0.60);
          return (
            <ellipse key={`bs${i}`}
              cx={px} cy={py} rx={n4(r*0.30)} ry={n4(r*0.18)}
              fill="black" opacity="0.07"
              transform={`rotate(${deg+10} ${px} ${py})`}/>
          );
        })}
        {/* Front petal layer — slightly offset inward, brighter */}
        {petals5.map((deg, i) => {
          const rad = (deg + 36) * Math.PI / 180;
          const px = n4(x + Math.cos(rad) * r * 0.30);
          const py = n4(y + Math.sin(rad) * r * 0.30);
          return (
            <ellipse key={`f${i}`}
              cx={px} cy={py} rx={n4(r*0.36)} ry={n4(r*0.22)}
              fill={color} opacity={0.88}
              transform={`rotate(${deg+36} ${px} ${py})`}/>
          );
        })}
        {/* Center disc */}
        <circle cx={x} cy={y} r={n4(r*0.22)} fill={color} opacity="1"/>
        {/* Center highlight */}
        <circle cx={n4(x - r*0.07)} cy={n4(y - r*0.07)} r={n4(r*0.10)} fill="white" opacity="0.38"/>
        {/* Outer petal edge highlight on topmost petal */}
        {(() => {
          const hx = n4(x + Math.cos(-54*Math.PI/180)*r*0.56);
          const hy = n4(y + Math.sin(-54*Math.PI/180)*r*0.56);
          return (
            <ellipse cx={hx} cy={hy} rx={n4(r*0.20)} ry={n4(r*0.10)}
                     fill="white" opacity="0.22"
                     transform={`rotate(-54 ${hx} ${hy})`}/>
          );
        })()}
      </g>
    );
  }

  return (
    <svg width={width} height="90" viewBox={`0 0 ${width} 90`} fill="none"
         className="absolute pointer-events-none" style={{ top: 60, left: 0, zIndex: 5 }}>

      {/* ── SATIN BAND ── */}
      <rect x="0" y="38" width={width} height="14" fill={color} opacity="0.68" rx="1"/>
      <rect x="0" y="38" width={width} height="5"  fill="white" opacity="0.22" rx="1"/>
      <rect x="0" y="48" width={width} height="4"  fill="black" opacity="0.07"/>

      {/* ── LEAF SPRIGS left ── */}
      <path d={`M${cx-52} 45 C${cx-68} 32 ${cx-80} 29 ${cx-70} 37`}
            stroke={color} strokeWidth="1.5" opacity="0.55" fill="none"/>
      <ellipse cx={cx-73} cy="31" rx="9" ry="5" fill={color} opacity="0.48"
               transform={`rotate(-38 ${cx-73} 31)`}/>
      <path d={`M${cx-52} 45 C${cx-66} 56 ${cx-78} 58 ${cx-68} 50`}
            stroke={color} strokeWidth="1.5" opacity="0.48" fill="none"/>
      <ellipse cx={cx-71} cy="55" rx="8" ry="4.5" fill={color} opacity="0.42"
               transform={`rotate(33 ${cx-71} 55)`}/>
      {/* Extra twig */}
      <path d={`M${cx-60} 42 C${cx-74} 24 ${cx-86} 22 ${cx-78} 32`}
            stroke={color} strokeWidth="1.2" opacity="0.38" fill="none"/>
      <ellipse cx={cx-80} cy="24" rx="7" ry="4" fill={color} opacity="0.36"
               transform={`rotate(-50 ${cx-80} 24)`}/>

      {/* ── LEAF SPRIGS right (mirror) ── */}
      <path d={`M${cx+52} 45 C${cx+68} 32 ${cx+80} 29 ${cx+70} 37`}
            stroke={color} strokeWidth="1.5" opacity="0.55" fill="none"/>
      <ellipse cx={cx+73} cy="31" rx="9" ry="5" fill={color} opacity="0.48"
               transform={`rotate(38 ${cx+73} 31)`}/>
      <path d={`M${cx+52} 45 C${cx+66} 56 ${cx+78} 58 ${cx+68} 50`}
            stroke={color} strokeWidth="1.5" opacity="0.48" fill="none"/>
      <ellipse cx={cx+71} cy="55" rx="8" ry="4.5" fill={color} opacity="0.42"
               transform={`rotate(-33 ${cx+71} 55)`}/>
      <path d={`M${cx+60} 42 C${cx+74} 24 ${cx+86} 22 ${cx+78} 32`}
            stroke={color} strokeWidth="1.2" opacity="0.38" fill="none"/>
      <ellipse cx={cx+80} cy="24" rx="7" ry="4" fill={color} opacity="0.36"
               transform={`rotate(50 ${cx+80} 24)`}/>

      {/* ── ROSES — small side, large center ── */}
      <Rose x={cx-44} y={45} r={11}/>
      <Rose x={cx+44} y={45} r={11}/>
      <Rose x={cx}    y={45} r={14}/>
    </svg>
  );
}

// 5. ROMANTIC — elegant teardrop loops with inner/outer depth, heart knot, V-cut tails
function RibbonRomantic({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  const by = 46; const bh = 12; const bm = by + bh / 2;
  const heart = (hx: number, hy: number, hr: number) =>
    `M${hx} ${hy+hr*0.9} C${hx-hr*0.12} ${hy+hr*0.65},${hx-hr} ${hy+hr*0.45},${hx-hr} ${hy} `+
    `C${hx-hr} ${hy-hr*0.5},${hx-hr*0.42} ${hy-hr*0.72},${hx} ${hy-hr*0.28} `+
    `C${hx+hr*0.42} ${hy-hr*0.72},${hx+hr} ${hy-hr*0.5},${hx+hr} ${hy} `+
    `C${hx+hr} ${hy+hr*0.45},${hx+hr*0.12} ${hy+hr*0.65},${hx} ${hy+hr*0.9} Z`;

  return (
    <svg width={width} height="122" viewBox={`0 0 ${width} 122`} fill="none"
         className="absolute pointer-events-none" style={{ top: 52, left: 0, zIndex: 5 }}>

      {/* ── TAILS — narrow, V-cut ends ── */}
      <path d={`M${cx-12} ${bm+2} C${cx-14} 72 ${cx-18} 96 ${cx-10} 114 C${cx-7} 120 ${cx-4} 120 ${cx-3} 114 C${cx-3} 96 ${cx-5} 74 ${cx-5} ${bm+2}Z`}
            fill={color} opacity="0.78"/>
      <path d={`M${cx-11} ${bm+4} C${cx-13} 74 ${cx-16} 96 ${cx-9} 112`}
            stroke="white" strokeWidth="1.2" opacity="0.18" fill="none" strokeLinecap="round"/>
      <path d={`M${cx+5} ${bm+2} C${cx+5} 74 ${cx+3} 96 ${cx+3} 114 C${cx+4} 120 ${cx+7} 120 ${cx+10} 114 C${cx+18} 96 ${cx+14} 72 ${cx+12} ${bm+2}Z`}
            fill={color} opacity="0.78"/>
      <path d={`M${cx+11} ${bm+4} C${cx+13} 74 ${cx+16} 96 ${cx+9} 112`}
            stroke="white" strokeWidth="1.2" opacity="0.18" fill="none" strokeLinecap="round"/>

      {/* ── LEFT TEARDROP LOOP outer face ── */}
      <path d={`M${cx-12} ${bm+2} C${cx-14} 26 ${cx-34} 4 ${cx-50} 8 C${cx-70} 12 ${cx-74} 34 ${cx-60} 48 C${cx-50} 57 ${cx-28} 60 ${cx-12} ${bm-2}Z`}
            fill={color} opacity="0.86"/>
      {/* Left loop inner shadow (concave inside) */}
      <path d={`M${cx-12} ${bm} C${cx-15} 30 ${cx-32} 8 ${cx-47} 12 C${cx-64} 16 ${cx-67} 36 ${cx-56} 46`}
            stroke="black" strokeWidth="12" strokeLinecap="round" opacity="0.09" fill="none"/>
      {/* Left loop outer highlight */}
      <path d={`M${cx-16} 28 C${cx-26} 8 ${cx-44} 4 ${cx-56} 8`}
            stroke="white" strokeWidth="2.2" opacity="0.28" strokeLinecap="round" fill="none"/>
      <path d={`M${cx-14} 38 C${cx-28} 18 ${cx-46} 10 ${cx-60} 14`}
            stroke="white" strokeWidth="0.9" opacity="0.14" strokeLinecap="round" fill="none"/>

      {/* ── RIGHT TEARDROP LOOP outer face ── */}
      <path d={`M${cx+12} ${bm+2} C${cx+14} 26 ${cx+34} 4 ${cx+50} 8 C${cx+70} 12 ${cx+74} 34 ${cx+60} 48 C${cx+50} 57 ${cx+28} 60 ${cx+12} ${bm-2}Z`}
            fill={color} opacity="0.86"/>
      {/* Right loop inner shadow */}
      <path d={`M${cx+12} ${bm} C${cx+15} 30 ${cx+32} 8 ${cx+47} 12 C${cx+64} 16 ${cx+67} 36 ${cx+56} 46`}
            stroke="black" strokeWidth="12" strokeLinecap="round" opacity="0.09" fill="none"/>
      {/* Right loop outer highlight */}
      <path d={`M${cx+16} 28 C${cx+26} 8 ${cx+44} 4 ${cx+56} 8`}
            stroke="white" strokeWidth="2.2" opacity="0.28" strokeLinecap="round" fill="none"/>
      <path d={`M${cx+14} 38 C${cx+28} 18 ${cx+46} 10 ${cx+60} 14`}
            stroke="white" strokeWidth="0.9" opacity="0.14" strokeLinecap="round" fill="none"/>

      {/* ── BAND ── */}
      <rect x="0" y={by} width={width} height={bh} fill={color} opacity="0.80" rx="1"/>
      <rect x="0" y={by} width={width} height="4"  fill="white" opacity="0.22" rx="1"/>
      <rect x="0" y={by+bh-3} width={width} height="3" fill="black" opacity="0.07"/>

      {/* ── HEART KNOT ── */}
      <path d={heart(cx, bm, 15)} fill={color} opacity="1"/>
      {/* Heart depth shadow */}
      <path d={heart(cx+1, bm+2, 9)} fill="black" opacity="0.09"/>
      {/* Heart highlight — top-left lobe */}
      <ellipse cx={cx-5} cy={bm-6} rx="5" ry="3.5" fill="white" opacity="0.26"
               transform={`rotate(-20 ${cx-5} ${bm-6})`}/>
    </svg>
  );
}

// 6. LUXURY — curved fan bow with satin sheen per panel, elegant fabric knot
function RibbonLuxury({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  const cy = 105;
  const h  = 210;
  const lx = cx - 16; const rx = cx + 16;

  // Generate a curved fan panel path: from hinge point, curving to two outer points
  function fanPath(hx: number, hy: number, x1: number, y1: number, x2: number, y2: number) {
    const mx1 = (hx + x1) / 2; const my1 = (hy + y1) / 2;
    const mx2 = (hx + x2) / 2; const my2 = (hy + y2) / 2;
    return `M${hx} ${hy} Q${mx1*0.7+x1*0.3} ${my1*0.7+y1*0.3} ${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2} ${x2} ${y2} Q${mx2*0.7+x2*0.3} ${my2*0.7+y2*0.3} ${hx} ${hy} Z`;
  }

  // Left fan — 5 panels radiating top and bottom
  const lTopPts = [[4,2],[28,14],[54,30],[82,48],[cx-16,cy-11]] as [number,number][];
  const lBotPts = [[4,h-2],[28,h-14],[54,h-30],[82,h-48],[cx-16,cy+11]] as [number,number][];
  const panelOpacity = [0.88, 0.75, 0.62, 0.50, 0.38];

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none"
         className="absolute pointer-events-none" style={{ top: 0, left: 0, zIndex: 5 }}>

      {/* ── LEFT fan panels — top ── */}
      {lTopPts.slice(0,-1).map(([x1,y1], i) => {
        const [x2,y2] = lTopPts[i+1];
        return (
          <g key={`lt${i}`}>
            <path d={fanPath(lx, cy, x1, y1, x2, y2)} fill={color} opacity={panelOpacity[i]}/>
            {/* Sheen line on outer edge */}
            <line x1={lx} y1={cy} x2={x1} y2={y1}
                  stroke="white" strokeWidth={1.8 - i*0.3} opacity={0.22 - i*0.04}/>
          </g>
        );
      })}
      {/* ── LEFT fan panels — bottom ── */}
      {lBotPts.slice(0,-1).map(([x1,y1], i) => {
        const [x2,y2] = lBotPts[i+1];
        return (
          <g key={`lb${i}`}>
            <path d={fanPath(lx, cy, x1, y1, x2, y2)} fill={color} opacity={panelOpacity[i]}/>
            <line x1={lx} y1={cy} x2={x1} y2={y1}
                  stroke="white" strokeWidth={1.8 - i*0.3} opacity={0.18 - i*0.03}/>
          </g>
        );
      })}

      {/* ── RIGHT fan panels — mirror ── */}
      {lTopPts.slice(0,-1).map(([x1,y1], i) => {
        const [x2,y2] = lTopPts[i+1];
        const rx1 = width - x1; const rx2 = width - x2;
        return (
          <g key={`rt${i}`}>
            <path d={fanPath(rx, cy, rx1, y1, rx2, y2)} fill={color} opacity={panelOpacity[i]}/>
            <line x1={rx} y1={cy} x2={rx1} y2={y1}
                  stroke="white" strokeWidth={1.8 - i*0.3} opacity={0.22 - i*0.04}/>
          </g>
        );
      })}
      {lBotPts.slice(0,-1).map(([x1,y1], i) => {
        const [x2,y2] = lBotPts[i+1];
        const rx1 = width - x1; const rx2 = width - x2;
        return (
          <g key={`rb${i}`}>
            <path d={fanPath(rx, cy, rx1, y1, rx2, y2)} fill={color} opacity={panelOpacity[i]}/>
            <line x1={rx} y1={cy} x2={rx1} y2={y1}
                  stroke="white" strokeWidth={1.8 - i*0.3} opacity={0.18 - i*0.03}/>
          </g>
        );
      })}

      {/* ── DOUBLE SATIN BAND ── */}
      <rect x="0" y={cy-20} width={width} height="8"  fill={color} opacity="0.42" rx="1"/>
      <rect x="0" y={cy-12} width={width} height="24" fill={color} opacity="0.72" rx="1"/>
      <rect x="0" y={cy-12} width={width} height="7"  fill="white" opacity="0.22" rx="1"/>
      <rect x="0" y={cy+10} width={width} height="4"  fill="black" opacity="0.07"/>
      <rect x="0" y={cy+14} width={width} height="7"  fill={color} opacity="0.34" rx="1"/>

      {/* ── CENTER KNOT — folded fabric block ── */}
      {/* Outer shadow of knot */}
      <rect x={cx-36} y={cy-21} width="72" height="42" fill="black" opacity="0.08" rx="3"/>
      {/* Knot main body */}
      <rect x={cx-34} y={cy-20} width="68" height="40" fill={color} opacity="0.96" rx="2"/>
      {/* Top satin highlight */}
      <rect x={cx-34} y={cy-20} width="68" height="10" fill="white" opacity="0.20" rx="2"/>
      {/* Vertical fold lines (like stacked ribbon layers) */}
      <line x1={cx-14} y1={cy-18} x2={cx-14} y2={cy+18} stroke="black" strokeWidth="1.2" opacity="0.12"/>
      <line x1={cx+14} y1={cy-18} x2={cx+14} y2={cy+18} stroke="black" strokeWidth="1.2" opacity="0.10"/>
      {/* Horizontal gather lines */}
      <line x1={cx-28} y1={cy-6}  x2={cx+28} y2={cy-6}  stroke="black" strokeWidth="0.8" opacity="0.09"/>
      <line x1={cx-28} y1={cy+6}  x2={cx+28} y2={cy+6}  stroke="black" strokeWidth="0.7" opacity="0.07"/>
      {/* Center vertical satin sheen */}
      <rect x={cx-8} y={cy-18} width="16" height="36" fill="white" opacity="0.10" rx="2"/>
      {/* Knot top highlight spot */}
      <ellipse cx={cx-8} cy={cy-10} rx="10" ry="5" fill="white" opacity="0.18"/>
    </svg>
  );
}

// ── Main dispatcher ────────────────────────────────────────────────────────────
function GoldenRibbon({ color, width = 300, style = "classic" }: {
  color: string; width?: number; style?: RibbonStyle;
}) {
  switch (style) {
    case "crossed":  return <RibbonCrossed  color={color} width={width} />;
    case "minimal":  return <RibbonMinimal  color={color} width={width} />;
    case "floral":   return <RibbonFloral   color={color} width={width} />;
    case "romantic": return <RibbonRomantic color={color} width={width} />;
    case "luxury":   return <RibbonLuxury   color={color} width={width} />;
    default:         return <RibbonClassic  color={color} width={width} />;
  }
}

function DeskSurface({ color }: { color: string }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
      {/* Wood grain lines */}
      <line x1="0" y1="4"  x2="400" y2="4"  stroke={color} strokeWidth="0.6" opacity="0.25"/>
      <line x1="0" y1="9"  x2="400" y2="9"  stroke={color} strokeWidth="0.4" opacity="0.18"/>
      <line x1="0" y1="14" x2="400" y2="14" stroke={color} strokeWidth="0.6" opacity="0.22"/>
      <line x1="0" y1="20" x2="400" y2="20" stroke={color} strokeWidth="0.4" opacity="0.15"/>
      <line x1="0" y1="26" x2="400" y2="26" stroke={color} strokeWidth="0.5" opacity="0.20"/>
      {/* Subtle knots */}
      <ellipse cx="80"  cy="12" rx="12" ry="3" stroke={color} strokeWidth="0.5" opacity="0.12" fill="none"/>
      <ellipse cx="280" cy="18" rx="9"  ry="2" stroke={color} strokeWidth="0.5" opacity="0.10" fill="none"/>
    </svg>
  );
}

// ── Envelope fold lines — kite/diamond crease pattern visible on the front face ──
function EnvelopeFolds({ width, height, color }: { width: number; height: number; color: string }) {
  const cx = width / 2;
  const cy = height / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none"
         className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Side panel shading — the left and right flaps folded in */}
      <polygon points={`0,0 0,${height} ${cx},${cy}`}          fill={color} opacity="0.10"/>
      <polygon points={`${width},0 ${width},${height} ${cx},${cy}`} fill={color} opacity="0.10"/>
      {/* Bottom panel shading */}
      <polygon points={`0,${height} ${width},${height} ${cx},${cy}`} fill={color} opacity="0.07"/>
      {/* Fold crease lines — diagonal from each corner to center */}
      <line x1="0"     y1="0"      x2={cx} y2={cy} stroke={color} strokeWidth="0.9" opacity="0.28"/>
      <line x1={width} y1="0"      x2={cx} y2={cy} stroke={color} strokeWidth="0.9" opacity="0.28"/>
      <line x1="0"     y1={height} x2={cx} y2={cy} stroke={color} strokeWidth="0.9" opacity="0.24"/>
      <line x1={width} y1={height} x2={cx} y2={cy} stroke={color} strokeWidth="0.9" opacity="0.24"/>
      {/* Subtle center horizontal crease where side panels meet */}
      <line x1="0" y1={cy} x2={width} y2={cy}
            stroke={color} strokeWidth="0.5" strokeDasharray="3 7" opacity="0.14"/>
    </svg>
  );
}

export default function EnvelopeIntro({ event, participant, theme, onOpen }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");

  const isShaking   = phase === "shaking";
  const isOpen      = phase === "opening" || phase === "rising" || phase === "revealing" || phase === "done";
  const isRising    = phase === "rising"  || phase === "revealing" || phase === "done";
  const isBreaking  = phase === "opening";
  const isRevealing = phase === "revealing" || phase === "done";

  async function handleClick() {
    if (phase !== "idle") return;
    setPhase("shaking");
    await delay(480);
    setPhase("opening");
    await delay(900);
    setPhase("rising");
    await delay(700);
    setPhase("revealing");
    await delay(900);
    setPhase("done");
    await delay(200);
    onOpen();
  }

  const isBotanical = theme.layoutVariant === "botanical";

  const screenBg  = isBotanical ? "#0e1c09" : theme.secondary;
  const envBody   = isBotanical ? "#2d4a22" : theme.secondary;
  const cardBg    = isBotanical ? "#f5f0e8" : "#fafaf8";
  const cardText  = isBotanical ? "#1e3314" : theme.primary;
  const hintColor = isBotanical ? "#c9a96e" : theme.primary;
  // Colors — explicit overrides take priority, then theme-based defaults
  const defaultSealBg  = isBotanical ? "#c9a96e" : theme.primary;
  const defaultRibbon  = isBotanical ? "#c9a96e" : theme.accent;
  const envBorder = event.style.ribbonColor?.trim() || defaultRibbon;
  const sealBg    = event.style.sealColor?.trim()    || defaultSealBg;
  const sealFgDefault = isBotanical ? "#0e1c09" : "#fff";
  const sealFg    = event.style.sealTextColor?.trim() || sealFgDefault;
  const deskColor = isBotanical ? "#c9a96e" : theme.accent;
  const greenLeaf = isBotanical ? "#5a8f5e" : theme.primary;

  const sealInitials = event.style.sealInitials?.trim().slice(0, 2) ?? "";

  const decorExit = { opacity: 0, y: 24, transition: { duration: 0.4 } };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: screenBg, fontFamily: event.style.fontFamily || "Cormorant Garamond, serif" }}
          onClick={handleClick}
        >

          {/* ── DESK SURFACE at the bottom ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="desk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={decorExit}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-8"
                style={{ backgroundColor: isBotanical ? "#1a2e12" : theme.accent + "22" }}
              >
                <DeskSurface color={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DESK SHADOW under envelope ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute"
                style={{
                  bottom: 26,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 320,
                  height: 20,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${deskColor}55 0%, transparent 70%)`,
                  filter: "blur(4px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* ── QUILL PEN — left side ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="quill"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: -30 }}
                transition={{ delay: 0.5 }}
                className="absolute"
                style={{ bottom: 24, left: "calc(50% - 250px)" }}
              >
                <div style={{ transform: "rotate(-18deg)", transformOrigin: "right bottom" }}>
                  <QuillPen color={deskColor} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FLORAL SPRIG — far right ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="sprig"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: 30 }}
                transition={{ delay: 0.6 }}
                className="absolute"
                style={{ bottom: 20, right: "calc(50% - 270px)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── WAX CANDLE — right side ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="wax"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ ...decorExit, x: 20 }}
                transition={{ delay: 0.7 }}
                className="absolute"
                style={{ bottom: 20, right: "calc(50% - 210px)" }}
              >
                <WaxKit color={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SMALL LEAF CORNER — top left ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="corner-tl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-4 left-4"
                style={{ transform: "rotate(15deg)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SMALL LEAF CORNER — top right (mirrored) ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.div
                key="corner-tr"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute top-4 right-4"
                style={{ transform: "scaleX(-1) rotate(15deg)" }}
              >
                <FloralSprig color={greenLeaf} accent={deskColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TOP HINT ── */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.p
                key="hint-top"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.75, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.8 }}
                className="text-xs tracking-widest uppercase mb-10"
                style={{ color: hintColor }}
              >
                Tienes una invitación
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── ENVELOPE + CARD wrapper — same 300×210 reference frame ── */}
          <div className="relative" style={{ width: 300, height: 210 }}>

          {/* Envelope — slides left on revealing */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ perspective: 800 }}
            animate={
              isRevealing ? { x: "-140%", opacity: 0, rotate: -12 } :
              isShaking   ? {
                x: [0, -8, 10, -10, 8, -6, 6, -4, 4, -2, 2, 0],
                rotate: [0, -2, 2.5, -2.5, 2, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
              } : {}
            }
            transition={
              isRevealing ? { duration: 0.60, ease: [0.4, 0, 1, 1] } :
              isShaking   ? { duration: 0.50, ease: "easeInOut" } :
              {}
            }
          >

            {/* Body — z-index:1 creates own stacking context so fold-line children
                 don't bleed into the same context as the card sibling */}
            <div
              className="absolute inset-0 rounded-b-md overflow-hidden"
              style={{
                backgroundColor: envBody,
                border: `1px solid ${envBorder}55`,
                zIndex: 1,
                boxShadow: `
                  0 2px 4px rgba(0,0,0,0.14),
                  0 8px 24px rgba(0,0,0,0.22),
                  0 24px 48px rgba(0,0,0,0.14),
                  inset 0 1px 2px rgba(255,255,255,0.10),
                  inset 0 -2px 6px rgba(0,0,0,0.10)
                `,
              }}
            >
              {/* Realistic fold crease lines and panel shading */}
              <EnvelopeFolds width={300} height={210} color={envBorder} />

              {/* Bottom V triangles — more visible for realistic envelope look */}
              <div className="absolute bottom-0 left-0 w-0 h-0"
                   style={{ borderRight: "150px solid transparent", borderBottom: `105px solid ${envBorder}50`, zIndex: 2 }} />
              <div className="absolute bottom-0 right-0 w-0 h-0"
                   style={{ borderLeft: "150px solid transparent", borderBottom: `105px solid ${envBorder}50`, zIndex: 2 }} />

              {/* Subtle inner-liner tint visible at top opening */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 42,
                background: `linear-gradient(to bottom, ${sealBg}22, transparent)`,
                zIndex: 1,
              }} />

              {/* Thin inner-edge highlight to simulate paper rim */}
              <div style={{
                position: "absolute", inset: 0,
                border: `0.5px solid ${envBorder}28`,
                borderRadius: "0 0 6px 6px",
                pointerEvents: "none", zIndex: 3,
              }} />

              {isBotanical && (
                <>
                  <div className="absolute bottom-2 left-2 opacity-50" style={{ zIndex: 3 }}>
                    <EnvelopeBranch color={envBorder} />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-50" style={{ transform: "scaleX(-1)", zIndex: 3 }}>
                    <EnvelopeBranch color={envBorder} />
                  </div>
                </>
              )}
            </div>


            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 105, transformStyle: "preserve-3d", zIndex: 10, perspective: 600 }}
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.72, ease: [0.35, 0, 0.15, 1] }}
            >
              {/* Front face — downward triangle (closed) with subtle fold shadow */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                     backgroundColor: envBody,
                     outline: `1px solid ${envBorder}55`,
                     outlineOffset: -1,
                     backfaceVisibility: "hidden",
                     filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.20))",
                   }} />
              {/* Back face — inner liner (visible when open): diagonal stripe security pattern */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                     backgroundColor: sealBg,
                     backgroundImage: `repeating-linear-gradient(
                       -45deg,
                       transparent,
                       transparent 4px,
                       rgba(255,255,255,0.13) 4px,
                       rgba(255,255,255,0.13) 5px
                     )`,
                     opacity: 0.82,
                     transform: "rotateX(180deg)",
                     backfaceVisibility: "hidden",
                   }} />
            </motion.div>

            {/* Golden ribbon — idle+shaking: static; opening: bow snaps apart */}
            <AnimatePresence>
              {(phase === "idle" || phase === "shaking" || phase === "opening") && (
                <motion.div
                  key="ribbon"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isBreaking
                    ? {
                        scaleX:  [1, 1.06, 1.06, 2.2],
                        scaleY:  [1, 1.12, 0.15, 0],
                        opacity: [1, 1,    1,    0],
                      }
                    : { opacity: 1, scaleX: 1, scaleY: 1 }
                  }
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={isBreaking
                    ? { duration: 0.75, times: [0, 0.2, 0.5, 1], ease: "easeInOut" }
                    : { delay: 0.5, duration: 0.5, ease: "easeOut" }
                  }
                  className="absolute inset-x-0"
                  style={{ top: 0, zIndex: 5, transformOrigin: "center" }}
                >
                  <GoldenRibbon color={envBorder} width={300} style={event.style.ribbonStyle ?? "classic"} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wax seal — pulse on shake, crack on opening */}
            <AnimatePresence>
              {(phase === "idle" || phase === "shaking" || phase === "opening") && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isBreaking
                    ? { scale: [1, 1.18, 1.12, 0], opacity: [1, 1, 1, 0], rotate: [0, -6, 4, 0] }
                    : isShaking
                    ? { scale: [1, 1.07, 0.96, 1.04, 0.98, 1], rotate: [0, -3, 3, -2, 1, 0] }
                    : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  exit={{ scale: 0, opacity: 0 }}
                  transition={isBreaking
                    ? { duration: 0.7, times: [0, 0.25, 0.55, 1], ease: "easeInOut" }
                    : isShaking
                    ? { duration: 0.50, ease: "easeInOut" }
                    : { delay: 0.4, type: "spring", stiffness: 180, damping: 14 }
                  }
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{ top: 79 }}
                >
                  <div className="relative" style={{ width: 60, height: 60 }}>
                    <WaxSealSvg bg={sealBg} fg={sealFg} initials={sealInitials} size={60} />
                    {isBreaking && <SealCracks size={60} />}
                    {isBreaking && <SealFragments size={60} color={sealBg} />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── RISING CARD — sibling of envelope, guaranteed above all envelope contents ── */}
          <motion.div
            className="absolute left-4 right-4 rounded shadow-lg flex flex-col items-center justify-center gap-2 pointer-events-none"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${envBorder}`,
              bottom: 12,
              height: 160,
              zIndex: 30,
            }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={
              isRevealing ? { y: -130, opacity: 0 } :
              isRising    ? { y: -130, opacity: 1, rotate: [0, 1.2, -0.8, 0.5, 0] } :
                            { y: 0, opacity: 0, rotate: 0 }
            }
            transition={{ duration: isRevealing ? 0.20 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {isBotanical && (
              <>
                <div className="absolute top-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.4 }} />
                <div className="absolute bottom-0 left-4 right-4 h-px" style={{ backgroundColor: envBorder, opacity: 0.4 }} />
              </>
            )}
            <p className="text-xs tracking-widest uppercase" style={{ color: cardText, opacity: 0.5 }}>Para</p>
            <p className="text-2xl text-center px-4 leading-tight"
               style={{ color: cardText, fontFamily: "Great Vibes, cursive" }}>
              {participant.name}
            </p>
            <div className="w-10 h-px" style={{ backgroundColor: envBorder }} />
            <p className="text-xs tracking-widest text-center px-4" style={{ color: cardText, opacity: 0.5 }}>
              {event.name}
            </p>
          </motion.div>

          </div>{/* end envelope+card wrapper */}

          {/* ── REVEAL CARD — zoom toward viewer after envelope slides away ── */}
          <AnimatePresence>
            {isRevealing && (
              <motion.div
                key="reveal-card"
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                style={{ zIndex: 50 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className="flex flex-col items-center justify-center gap-4 rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: cardBg,
                    border: `1.5px solid ${envBorder}80`,
                    width: "min(320px, 88vw)",
                    padding: "36px 28px",
                    boxShadow: `0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)`,
                    fontFamily: event.style.fontFamily || "Cormorant Garamond, serif",
                  }}
                  initial={{ scale: 0.65, y: 60, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 0.80, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Decorative top line */}
                  <div style={{ width: 40, height: 1, backgroundColor: envBorder, opacity: 0.5 }} />

                  <p className="text-xs tracking-widest uppercase" style={{ color: cardText, opacity: 0.5 }}>
                    Para
                  </p>
                  <p className="text-3xl text-center leading-snug"
                     style={{ color: cardText, fontFamily: "Great Vibes, cursive" }}>
                    {participant.name}
                  </p>

                  <div style={{ width: 48, height: 1, backgroundColor: envBorder, opacity: 0.45 }} />

                  <p className="text-xs tracking-widest uppercase text-center" style={{ color: cardText, opacity: 0.55 }}>
                    {event.name}
                  </p>

                  {/* Decorative bottom line */}
                  <div style={{ width: 40, height: 1, backgroundColor: envBorder, opacity: 0.5 }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── BOTTOM HINT ── */}
          <AnimatePresence>
            {(phase === "idle" || phase === "shaking") && (
              <motion.div
                key="hint-bottom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, repeatType: "loop" }}
                className="mt-10 text-xs tracking-widest uppercase"
                style={{ color: hintColor }}
              >
                Haz clic para abrir
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
