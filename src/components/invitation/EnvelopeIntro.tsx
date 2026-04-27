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

type Phase = "idle" | "opening" | "rising" | "done";

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

// 1. CLASSIC — big bow with two loops and falling tails
function RibbonClassic({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  return (
    <svg width={width} height="110" viewBox={`0 0 ${width} 110`} fill="none"
         className="absolute pointer-events-none" style={{ top: 60, left: 0, zIndex: 5 }}>
      <rect x="0" y="40" width={width} height="16" fill={color} opacity="0.72" rx="1"/>
      <rect x="0" y="40" width={width} height="5"  fill="white" opacity="0.22" rx="1"/>
      <rect x="0" y="52" width={width} height="4"  fill="black" opacity="0.07"/>
      <path d={`M${cx-16} 48 C${cx-60} 6 ${cx-110} 2 ${cx-90} 34 C${cx-80} 56 ${cx-40} 60 ${cx-16} 48Z`} fill={color} opacity="0.78"/>
      <path d={`M${cx-16} 48 C${cx-56} 10 ${cx-104} 8 ${cx-88} 36`} stroke="white" strokeWidth="1" opacity="0.2" fill="none"/>
      <path d={`M${cx+16} 48 C${cx+60} 6 ${cx+110} 2 ${cx+90} 34 C${cx+80} 56 ${cx+40} 60 ${cx+16} 48Z`} fill={color} opacity="0.78"/>
      <path d={`M${cx+16} 48 C${cx+56} 10 ${cx+104} 8 ${cx+88} 36`} stroke="white" strokeWidth="1" opacity="0.2" fill="none"/>
      <ellipse cx={cx} cy="48" rx="18" ry="14" fill={color} opacity="0.9"/>
      <ellipse cx={cx} cy="48" rx="10" ry="8"  fill={color} opacity="1"/>
      <ellipse cx={cx-4} cy="45" rx="5" ry="3" fill="white" opacity="0.3"/>
      <path d={`M${cx-12} 56 C${cx-38} 76 ${cx-66} 98 ${cx-52} 110`} stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.75"/>
      <path d={`M${cx+12} 56 C${cx+38} 76 ${cx+66} 98 ${cx+52} 110`} stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.75"/>
    </svg>
  );
}

// 2. CROSSED — two diagonal ribbons forming an X with a round knot at center
function RibbonCrossed({ color, width }: { color: string; width: number }) {
  const cx = width / 2; const h = 210;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none"
         className="absolute pointer-events-none" style={{ top: 0, left: 0, zIndex: 5 }}>
      {/* Diagonal band top-left → bottom-right */}
      <path d={`M-10 0 L${width * 0.35} ${h} L${width * 0.45} ${h} L10 0Z`} fill={color} opacity="0.55"/>
      <path d={`M2 0 L${width * 0.37} ${h}`} stroke="white" strokeWidth="1.5" opacity="0.2"/>
      {/* Diagonal band top-right → bottom-left */}
      <path d={`M${width+10} 0 L${width * 0.65} ${h} L${width * 0.55} ${h} L${width-10} 0Z`} fill={color} opacity="0.55"/>
      <path d={`M${width-2} 0 L${width * 0.63} ${h}`} stroke="white" strokeWidth="1.5" opacity="0.2"/>
      {/* Center knot */}
      <ellipse cx={cx} cy={h/2} rx="16" ry="16" fill={color} opacity="0.95"/>
      <ellipse cx={cx} cy={h/2} rx="9"  ry="9"  fill={color} opacity="1"/>
      <ellipse cx={cx-3} cy={h/2-3} rx="4" ry="2.5" fill="white" opacity="0.35"/>
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

// 4. FLORAL — ribbon band with rose/flower clusters at center and sides
function RibbonFloral({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  function Rose({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
    return (
      <g>
        {[0,60,120,180,240,300].map((deg, i) => (
          <ellipse key={i} cx={x + Math.cos(deg*Math.PI/180)*r*0.55} cy={y + Math.sin(deg*Math.PI/180)*r*0.55}
                   rx={r*0.55} ry={r*0.35} fill={color} opacity={0.7 - i*0.05}
                   transform={`rotate(${deg} ${x + Math.cos(deg*Math.PI/180)*r*0.55} ${y + Math.sin(deg*Math.PI/180)*r*0.55})`}/>
        ))}
        <circle cx={x} cy={y} r={r*0.28} fill={color} opacity="0.95"/>
        <circle cx={x-r*0.08} cy={y-r*0.08} r={r*0.12} fill="white" opacity="0.4"/>
      </g>
    );
  }
  return (
    <svg width={width} height="80" viewBox={`0 0 ${width} 80`} fill="none"
         className="absolute pointer-events-none" style={{ top: 65, left: 0, zIndex: 5 }}>
      <rect x="0" y="36" width={width} height="12" fill={color} opacity="0.6" rx="1"/>
      <rect x="0" y="36" width={width} height="4"  fill="white" opacity="0.2" rx="1"/>
      {/* Left leaf sprigs */}
      <path d={`M${cx-55} 42 C${cx-70} 30 ${cx-80} 28 ${cx-72} 36`} stroke={color} strokeWidth="1.5" opacity="0.5" fill="none"/>
      <ellipse cx={cx-74} cy="30" rx="8" ry="4.5" fill={color} opacity="0.42" transform={`rotate(-40 ${cx-74} 30)`}/>
      <path d={`M${cx-55} 42 C${cx-68} 52 ${cx-78} 54 ${cx-70} 46`} stroke={color} strokeWidth="1.5" opacity="0.45" fill="none"/>
      <ellipse cx={cx-72} cy="52" rx="7" ry="4" fill={color} opacity="0.38" transform={`rotate(35 ${cx-72} 52)`}/>
      {/* Right leaf sprigs (mirror) */}
      <path d={`M${cx+55} 42 C${cx+70} 30 ${cx+80} 28 ${cx+72} 36`} stroke={color} strokeWidth="1.5" opacity="0.5" fill="none"/>
      <ellipse cx={cx+74} cy="30" rx="8" ry="4.5" fill={color} opacity="0.42" transform={`rotate(40 ${cx+74} 30)`}/>
      <path d={`M${cx+55} 42 C${cx+68} 52 ${cx+78} 54 ${cx+70} 46`} stroke={color} strokeWidth="1.5" opacity="0.45" fill="none"/>
      <ellipse cx={cx+72} cy="52" rx="7" ry="4" fill={color} opacity="0.38" transform={`rotate(-35 ${cx+72} 52)`}/>
      {/* Roses */}
      <Rose x={cx-42} y={42} r={11}/>
      <Rose x={cx+42} y={42} r={11}/>
      <Rose x={cx} y={42} r={13}/>
    </svg>
  );
}

// 5. ROMANTIC — tall teardrop loops + prominent heart center
function RibbonRomantic({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  // Heart path helper: heart centered at (hx, hy) with radius hr
  const heart = (hx: number, hy: number, hr: number) =>
    `M${hx} ${hy+hr} C${hx-hr*0.15} ${hy+hr*0.7},${hx-hr} ${hy+hr*0.5},${hx-hr} ${hy+hr*0.1} C${hx-hr} ${hy-hr*0.35},${hx-hr*0.5} ${hy-hr*0.6},${hx} ${hy-hr*0.2} C${hx+hr*0.5} ${hy-hr*0.6},${hx+hr} ${hy-hr*0.35},${hx+hr} ${hy+hr*0.1} C${hx+hr} ${hy+hr*0.5},${hx+hr*0.15} ${hy+hr*0.7},${hx} ${hy+hr} Z`;

  return (
    <svg width={width} height="110" viewBox={`0 0 ${width} 110`} fill="none"
         className="absolute pointer-events-none" style={{ top: 60, left: 0, zIndex: 5 }}>
      {/* Band */}
      <rect x="0" y="46" width={width} height="12" fill={color} opacity="0.62" rx="1"/>
      <rect x="0" y="46" width={width} height="4"  fill="white" opacity="0.2" rx="1"/>

      {/* Left teardrop loop — tall, narrow, elegant */}
      <path d={`M${cx-12} 52 C${cx-14} 28,${cx-32} 6,${cx-48} 10 C${cx-64} 14,${cx-68} 34,${cx-56} 46 C${cx-48} 53,${cx-26} 57,${cx-12} 52Z`}
            fill={color} opacity="0.75"/>
      <path d={`M${cx-12} 52 C${cx-15} 32,${cx-34} 12,${cx-47} 12`}
            stroke="white" strokeWidth="1.5" opacity="0.25" fill="none"/>

      {/* Right teardrop loop (mirror) */}
      <path d={`M${cx+12} 52 C${cx+14} 28,${cx+32} 6,${cx+48} 10 C${cx+64} 14,${cx+68} 34,${cx+56} 46 C${cx+48} 53,${cx+26} 57,${cx+12} 52Z`}
            fill={color} opacity="0.75"/>
      <path d={`M${cx+12} 52 C${cx+15} 32,${cx+34} 12,${cx+47} 12`}
            stroke="white" strokeWidth="1.5" opacity="0.25" fill="none"/>

      {/* Tails — pointed like cut ribbon */}
      <path d={`M${cx-10} 58 C${cx-22} 74,${cx-38} 96,${cx-26} 108 C${cx-20} 114,${cx-18} 108,${cx-14} 102 C${cx-10} 96,${cx-10} 82,${cx-10} 58`}
            fill={color} opacity="0.68"/>
      <path d={`M${cx+10} 58 C${cx+22} 74,${cx+38} 96,${cx+26} 108 C${cx+20} 114,${cx+18} 108,${cx+14} 102 C${cx+10} 96,${cx+10} 82,${cx+10} 58`}
            fill={color} opacity="0.68"/>

      {/* Large heart at center */}
      <path d={heart(cx, 50, 13)} fill={color} opacity="1"/>
      {/* Heart highlight */}
      <path d={heart(cx-1, 48, 5)} fill="white" opacity="0.28"/>
    </svg>
  );
}

// 6. LUXURY — full-height angular fan bow spanning the entire envelope
function RibbonLuxury({ color, width }: { color: string; width: number }) {
  const cx = width / 2;
  const cy = 105; // center of 210px envelope
  const h  = 210; // full envelope height
  // Hinge points (where fan radiates from)
  const lx = cx - 18; const rx = cx + 18;
  // Fan outer reach: nearly to envelope edges
  const outerX = 8;

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none"
         className="absolute pointer-events-none" style={{ top: 0, left: 0, zIndex: 5 }}>

      {/* ── Double band ── */}
      <rect x="0" y={cy-11} width={width} height="22" fill={color} opacity="0.68" rx="1"/>
      <rect x="0" y={cy-11} width={width} height="6"  fill="white" opacity="0.2"  rx="1"/>
      <rect x="0" y={cy+9}  width={width} height="4"  fill="black" opacity="0.07"/>
      <rect x="0" y={cy-18} width={width} height="7"  fill={color} opacity="0.38" rx="1"/>
      <rect x="0" y={cy+13} width={width} height="6"  fill={color} opacity="0.3"  rx="1"/>

      {/* ── LEFT fans — 4 panels top + 4 panels bottom ── */}
      {/* Top outer → inner */}
      <polygon points={`${lx},${cy} ${outerX},2      ${outerX+26},14`}    fill={color} opacity="0.85"/>
      <polygon points={`${lx},${cy} ${outerX+26},14  ${outerX+52},28`}    fill={color} opacity="0.72"/>
      <polygon points={`${lx},${cy} ${outerX+52},28  ${outerX+76},44`}    fill={color} opacity="0.60"/>
      <polygon points={`${lx},${cy} ${outerX+76},44  ${outerX+98},60`}    fill={color} opacity="0.48"/>
      {/* Bottom outer → inner */}
      <polygon points={`${lx},${cy} ${outerX},${h-2}      ${outerX+26},${h-14}`} fill={color} opacity="0.85"/>
      <polygon points={`${lx},${cy} ${outerX+26},${h-14}  ${outerX+52},${h-28}`} fill={color} opacity="0.72"/>
      <polygon points={`${lx},${cy} ${outerX+52},${h-28}  ${outerX+76},${h-44}`} fill={color} opacity="0.60"/>
      <polygon points={`${lx},${cy} ${outerX+76},${h-44}  ${outerX+98},${h-60}`} fill={color} opacity="0.48"/>
      {/* Sheen edge lines */}
      <line x1={lx} y1={cy} x2={outerX}     y2="2"      stroke="white" strokeWidth="1.2" opacity="0.25"/>
      <line x1={lx} y1={cy} x2={outerX+26}  y2="14"     stroke="white" strokeWidth="0.9" opacity="0.18"/>
      <line x1={lx} y1={cy} x2={outerX+52}  y2="28"     stroke="white" strokeWidth="0.7" opacity="0.12"/>
      <line x1={lx} y1={cy} x2={outerX}     y2={h-2}    stroke="white" strokeWidth="1.2" opacity="0.2"/>
      <line x1={lx} y1={cy} x2={outerX+26}  y2={h-14}   stroke="white" strokeWidth="0.9" opacity="0.14"/>

      {/* ── RIGHT fans — mirror ── */}
      <polygon points={`${rx},${cy} ${width-outerX},2      ${width-outerX-26},14`}    fill={color} opacity="0.85"/>
      <polygon points={`${rx},${cy} ${width-outerX-26},14  ${width-outerX-52},28`}    fill={color} opacity="0.72"/>
      <polygon points={`${rx},${cy} ${width-outerX-52},28  ${width-outerX-76},44`}    fill={color} opacity="0.60"/>
      <polygon points={`${rx},${cy} ${width-outerX-76},44  ${width-outerX-98},60`}    fill={color} opacity="0.48"/>
      <polygon points={`${rx},${cy} ${width-outerX},${h-2}      ${width-outerX-26},${h-14}`} fill={color} opacity="0.85"/>
      <polygon points={`${rx},${cy} ${width-outerX-26},${h-14}  ${width-outerX-52},${h-28}`} fill={color} opacity="0.72"/>
      <polygon points={`${rx},${cy} ${width-outerX-52},${h-28}  ${width-outerX-76},${h-44}`} fill={color} opacity="0.60"/>
      <polygon points={`${rx},${cy} ${width-outerX-76},${h-44}  ${width-outerX-98},${h-60}`} fill={color} opacity="0.48"/>
      <line x1={rx} y1={cy} x2={width-outerX}    y2="2"      stroke="white" strokeWidth="1.2" opacity="0.25"/>
      <line x1={rx} y1={cy} x2={width-outerX-26} y2="14"     stroke="white" strokeWidth="0.9" opacity="0.18"/>
      <line x1={rx} y1={cy} x2={width-outerX}    y2={h-2}    stroke="white" strokeWidth="1.2" opacity="0.2"/>

      {/* ── Center knot ── */}
      <rect x={cx-38} y={cy-22} width="76" height="44" fill={color} opacity="0.95" rx="3"/>
      <rect x={cx-28} y={cy-16} width="56" height="32" fill={color} opacity="1"    rx="2"/>
      <line x1={cx-16} y1={cy-14} x2={cx-16} y2={cy+14} stroke="white" strokeWidth="1.4" opacity="0.22"/>
      <line x1={cx+16} y1={cy-14} x2={cx+16} y2={cy+14} stroke="white" strokeWidth="1.4" opacity="0.18"/>
      <line x1={cx-24} y1={cy-6}  x2={cx+24} y2={cy-6}  stroke="white" strokeWidth="0.9" opacity="0.14"/>
      <line x1={cx-24} y1={cy+6}  x2={cx+24} y2={cy+6}  stroke="white" strokeWidth="0.7" opacity="0.1"/>
      <rect x={cx-14}  y={cy-13}  width="12" height="26" fill="white"   opacity="0.14"    rx="2"/>
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

export default function EnvelopeIntro({ event, participant, theme, onOpen }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");

  const isOpen     = phase === "opening" || phase === "rising" || phase === "done";
  const isRising   = phase === "rising"  || phase === "done";
  const isBreaking = phase === "opening"; // seal & bow animating

  async function handleClick() {
    if (phase !== "idle") return;
    setPhase("opening");
    await delay(900); // extra time for break animations
    setPhase("rising");
    await delay(900);
    setPhase("done");
    await delay(500);
    onOpen();
  }

  const isBotanical = theme.layoutVariant === "botanical";

  const screenBg  = isBotanical ? "#0e1c09" : theme.secondary;
  const envBody   = isBotanical ? "#2d4a22" : theme.secondary;
  const envBorder = isBotanical ? "#c9a96e" : theme.accent;
  const cardBg    = isBotanical ? "#f5f0e8" : theme.secondary;
  const cardText  = isBotanical ? "#1e3314" : theme.primary;
  const hintColor = isBotanical ? "#c9a96e" : theme.primary;
  const sealBg    = isBotanical ? "#c9a96e" : theme.primary;
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

          {/* ── ENVELOPE ── */}
          <div className="relative z-10" style={{ width: 300, height: 210, perspective: 800 }}>

            {/* Body */}
            <div
              className="absolute inset-0 rounded-b-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: envBody, border: `1.5px solid ${envBorder}` }}
            >
              <div className="absolute bottom-0 left-0 w-0 h-0"
                   style={{ borderRight: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />
              <div className="absolute bottom-0 right-0 w-0 h-0"
                   style={{ borderLeft: "150px solid transparent", borderBottom: `105px solid ${envBorder}22` }} />

              {isBotanical && (
                <>
                  <div className="absolute bottom-2 left-2 opacity-50">
                    <EnvelopeBranch color={envBorder} />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-50" style={{ transform: "scaleX(-1)" }}>
                    <EnvelopeBranch color={envBorder} />
                  </div>
                </>
              )}
            </div>

            {/* Rising card */}
            <motion.div
              className="absolute left-4 right-4 rounded shadow-lg flex flex-col items-center justify-center gap-2 overflow-hidden pointer-events-none"
              style={{ backgroundColor: cardBg, border: `1px solid ${envBorder}`, bottom: 12, height: 160 }}
              initial={{ y: 0, opacity: 0 }}
              animate={isRising ? { y: -130, opacity: 1 } : { y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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

            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 105, transformStyle: "preserve-3d", zIndex: 10, perspective: 600 }}
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Front face — downward triangle (closed) */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                     backgroundColor: envBody,
                     outline: `1.5px solid ${envBorder}`,
                     outlineOffset: -1,
                     backfaceVisibility: "hidden",
                   }} />
              {/* Back face — upward triangle (open), inverted on X axis */}
              <div className="absolute inset-0"
                   style={{
                     clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                     backgroundColor: isBotanical ? `${envBorder}30` : `${theme.primary}14`,
                     transform: "rotateX(180deg)",
                     backfaceVisibility: "hidden",
                   }} />
            </motion.div>

            {/* Golden ribbon — idle: static; opening: bow snaps then stretches apart */}
            <AnimatePresence>
              {(phase === "idle" || phase === "opening") && (
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

            {/* Wax seal — with crack + fragment break animation */}
            <AnimatePresence>
              {(phase === "idle" || phase === "opening") && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isBreaking
                    ? { scale: [1, 1.18, 1.12, 0], opacity: [1, 1, 1, 0], rotate: [0, -6, 4, 0] }
                    : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  exit={{ scale: 0, opacity: 0 }}
                  transition={isBreaking
                    ? { duration: 0.7, times: [0, 0.25, 0.55, 1], ease: "easeInOut" }
                    : { delay: 0.4, type: "spring", stiffness: 180, damping: 14 }
                  }
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{ top: 79 }}
                >
                  {/* Relative container so cracks overlay the seal */}
                  <div className="relative" style={{ width: 60, height: 60 }}>
                    <WaxSealSvg bg={sealBg} fg={sealFg} initials={sealInitials} size={60} />
                    {/* Crack lines appear on breaking */}
                    {isBreaking && <SealCracks size={60} />}
                    {/* Fragments fly apart */}
                    {isBreaking && <SealFragments size={60} color={sealBg} />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── BOTTOM HINT ── */}
          <AnimatePresence>
            {phase === "idle" && (
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
