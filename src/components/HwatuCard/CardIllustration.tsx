/**
 * Traditional Hwatu card SVG illustrations.
 * Each month has unique plant + special element per card type.
 *
 * Reference: Traditional Korean Hwatu (화투) deck
 * Month 1: Pine (솔) - Crane, red ribbon, 2 junk
 * Month 2: Plum (매) - Nightingale, red ribbon, 2 junk
 * Month 3: Cherry (벚) - Curtain, red ribbon, 2 junk
 * Month 4: Wisteria (등) - Cuckoo, green ribbon, 2 junk
 * Month 5: Iris (난) - Bridge, green ribbon, 2 junk
 * Month 6: Peony (모란) - Butterfly, blue ribbon, 2 junk
 * Month 7: Bush Clover (싸리) - Boar, green ribbon, 2 junk
 * Month 8: Pampas (공산) - Full Moon, Geese, 2 junk
 * Month 9: Chrysanthemum (국) - Sake Cup, blue ribbon, 2 junk
 * Month 10: Maple (단풍) - Deer, blue ribbon, 2 junk
 * Month 11: Paulownia (오동) - Phoenix, 3 junk
 * Month 12: Rain (비) - Umbrella Man, Swallow, ribbon, double junk
 */

interface IllustrationProps {
  readonly month: number
  readonly type: string
  readonly ribbonType?: string
  readonly size?: 'normal' | 'small'
}

export default function CardIllustration({ month, type, ribbonType, size = 'normal' }: IllustrationProps) {
  const w = size === 'small' ? 28 : 44
  const h = size === 'small' ? 40 : 64

  return (
    <svg
      viewBox="0 0 44 64"
      width={w}
      height={h}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {/* Background tint per month */}
      <MonthBackground month={month} />

      {/* Plant/flower motif for the month */}
      <MonthPlant month={month} />

      {/* Type-specific main illustration */}
      {type === 'bright' && <BrightIllustration month={month} />}
      {type === 'animal' && <AnimalIllustration month={month} />}
      {type === 'ribbon' && <RibbonIllustration ribbonType={ribbonType} />}
      {type === 'junk' && <JunkIllustration />}
    </svg>
  )
}

function MonthBackground({ month }: { month: number }) {
  const colors: Record<number, [string, string]> = {
    1: ['#2d6a2d', '#1a4a1a'],   // Pine - deep green
    2: ['#c4587a', '#8b2050'],   // Plum - pink
    3: ['#e8a0c0', '#d070a0'],   // Cherry - light pink
    4: ['#8860a8', '#5a3a7a'],   // Wisteria - purple
    5: ['#4a6ab8', '#2a4a8a'],   // Iris - blue
    6: ['#d84040', '#a82a2a'],   // Peony - red
    7: ['#6a8a30', '#4a6a1a'],   // Bush Clover - olive
    8: ['#203868', '#102848'],   // Pampas - night blue
    9: ['#c8a030', '#9a7a1a'],   // Chrysanthemum - gold
    10: ['#d86020', '#b84a1a'],  // Maple - orange
    11: ['#5a408a', '#3a2060'],  // Paulownia - deep purple
    12: ['#5a6a7a', '#3a4a5a'],  // Rain - grey blue
  }
  const [c1] = colors[month] ?? ['#555', '#333']

  return (
    <rect x="0" y="0" width="44" height="26" fill={c1} opacity="0.15" rx="0">
      <animate attributeName="opacity" values="0.12;0.18;0.12" dur="4s" repeatCount="indefinite" />
    </rect>
  )
}

function MonthPlant({ month }: { month: number }) {
  switch (month) {
    case 1: return <PinePlant />
    case 2: return <PlumPlant />
    case 3: return <CherryPlant />
    case 4: return <WisteriaPlant />
    case 5: return <IrisPlant />
    case 6: return <PeonyPlant />
    case 7: return <BushCloverPlant />
    case 8: return <PampasPlant />
    case 9: return <ChrysanthemumPlant />
    case 10: return <MaplePlant />
    case 11: return <PaulowniaPlant />
    case 12: return <RainPlant />
    default: return null
  }
}

// ── Month 1: Pine ──
function PinePlant() {
  return (
    <g opacity="0.5">
      {/* Pine trunk */}
      <line x1="12" y1="50" x2="14" y2="28" stroke="#5a3a20" strokeWidth="2" />
      <line x1="14" y1="36" x2="8" y2="30" stroke="#5a3a20" strokeWidth="1.2" />
      {/* Pine needles clusters */}
      <circle cx="8" cy="28" r="5" fill="#1a5a2a" opacity="0.7" />
      <circle cx="16" cy="24" r="6" fill="#2a6a3a" opacity="0.6" />
      <circle cx="10" cy="20" r="4" fill="#1a5a2a" opacity="0.5" />
    </g>
  )
}

// ── Month 2: Plum Blossom ──
function PlumPlant() {
  return (
    <g opacity="0.5">
      <line x1="10" y1="52" x2="18" y2="26" stroke="#4a2a1a" strokeWidth="1.5" />
      <line x1="15" y1="36" x2="28" y2="28" stroke="#4a2a1a" strokeWidth="1" />
      {/* Plum blossoms */}
      <circle cx="18" cy="24" r="3" fill="#e8507a" opacity="0.7" />
      <circle cx="28" cy="26" r="2.5" fill="#e8507a" opacity="0.6" />
      <circle cx="12" cy="22" r="2" fill="#e8507a" opacity="0.5" />
      <circle cx="18" cy="24" r="1" fill="#fff" opacity="0.5" />
      <circle cx="28" cy="26" r="0.8" fill="#fff" opacity="0.5" />
    </g>
  )
}

// ── Month 3: Cherry Blossom ──
function CherryPlant() {
  return (
    <g opacity="0.5">
      <line x1="22" y1="52" x2="22" y2="24" stroke="#5a3a2a" strokeWidth="1.5" />
      {/* Cherry blossom clusters */}
      <circle cx="16" cy="22" r="3.5" fill="#ffa0c0" opacity="0.6" />
      <circle cx="24" cy="18" r="4" fill="#ff90b0" opacity="0.7" />
      <circle cx="20" cy="14" r="3" fill="#ffa0c0" opacity="0.5" />
      <circle cx="28" cy="22" r="2.5" fill="#ff90b0" opacity="0.5" />
      {/* Petals falling */}
      <circle cx="30" cy="38" r="1.2" fill="#ffb0d0" opacity="0.4" />
      <circle cx="8" cy="42" r="1" fill="#ffb0d0" opacity="0.3" />
    </g>
  )
}

// ── Month 4: Wisteria ──
function WisteriaPlant() {
  return (
    <g opacity="0.5">
      <line x1="20" y1="10" x2="20" y2="16" stroke="#5a3a2a" strokeWidth="1.5" />
      {/* Hanging wisteria clusters */}
      <ellipse cx="14" cy="24" rx="3" ry="8" fill="#9a60c0" opacity="0.6" />
      <ellipse cx="22" cy="28" rx="3" ry="10" fill="#8a50b0" opacity="0.5" />
      <ellipse cx="30" cy="22" rx="2.5" ry="7" fill="#9a60c0" opacity="0.4" />
      {/* Dots for petals */}
      <circle cx="14" cy="20" r="1" fill="#b080d0" opacity="0.7" />
      <circle cx="22" cy="24" r="1" fill="#b080d0" opacity="0.6" />
    </g>
  )
}

// ── Month 5: Iris ──
function IrisPlant() {
  return (
    <g opacity="0.5">
      {/* Iris leaves - long and straight */}
      <line x1="16" y1="50" x2="14" y2="20" stroke="#2a6a2a" strokeWidth="1.5" />
      <line x1="20" y1="50" x2="22" y2="22" stroke="#2a6a2a" strokeWidth="1.5" />
      <line x1="24" y1="50" x2="28" y2="24" stroke="#2a6a2a" strokeWidth="1.2" />
      {/* Iris flowers */}
      <ellipse cx="14" cy="18" rx="3" ry="2" fill="#4060c0" opacity="0.7" />
      <ellipse cx="22" cy="20" rx="3.5" ry="2.5" fill="#3050b0" opacity="0.6" />
    </g>
  )
}

// ── Month 6: Peony ──
function PeonyPlant() {
  return (
    <g opacity="0.5">
      {/* Peony stems */}
      <line x1="22" y1="52" x2="20" y2="30" stroke="#3a5a2a" strokeWidth="1.5" />
      <line x1="20" y1="36" x2="12" y2="28" stroke="#3a5a2a" strokeWidth="1" />
      {/* Large peony flower */}
      <circle cx="20" cy="24" r="6" fill="#d03030" opacity="0.6" />
      <circle cx="20" cy="24" r="4" fill="#e04040" opacity="0.5" />
      <circle cx="20" cy="24" r="2" fill="#f06060" opacity="0.4" />
      <circle cx="12" cy="26" r="3.5" fill="#c02828" opacity="0.4" />
      {/* Leaves */}
      <ellipse cx="28" cy="34" rx="4" ry="2.5" fill="#3a6a2a" opacity="0.4" />
    </g>
  )
}

// ── Month 7: Bush Clover ──
function BushCloverPlant() {
  return (
    <g opacity="0.5">
      {/* Arching stems */}
      <path d="M10,50 Q15,30 30,20" fill="none" stroke="#5a6a2a" strokeWidth="1.2" />
      <path d="M14,50 Q20,34 34,24" fill="none" stroke="#5a6a2a" strokeWidth="1" />
      {/* Small leaves along stems */}
      <circle cx="18" cy="36" r="1.5" fill="#6a8a2a" opacity="0.6" />
      <circle cx="22" cy="30" r="1.5" fill="#6a8a2a" opacity="0.6" />
      <circle cx="26" cy="26" r="1.5" fill="#6a8a2a" opacity="0.5" />
      <circle cx="30" cy="22" r="1.5" fill="#6a8a2a" opacity="0.5" />
      {/* Small flowers */}
      <circle cx="20" cy="34" r="1" fill="#d060a0" opacity="0.5" />
      <circle cx="28" cy="24" r="1" fill="#d060a0" opacity="0.4" />
    </g>
  )
}

// ── Month 8: Pampas Grass ──
function PampasPlant() {
  return (
    <g opacity="0.5">
      {/* Pampas grass stalks */}
      <line x1="14" y1="55" x2="12" y2="28" stroke="#8a8a50" strokeWidth="1" />
      <line x1="22" y1="55" x2="22" y2="26" stroke="#8a8a50" strokeWidth="1" />
      <line x1="30" y1="55" x2="32" y2="30" stroke="#8a8a50" strokeWidth="1" />
      {/* Pampas plumes */}
      <ellipse cx="12" cy="26" rx="2" ry="4" fill="#d0c890" opacity="0.5" />
      <ellipse cx="22" cy="24" rx="2" ry="4" fill="#d0c890" opacity="0.5" />
      <ellipse cx="32" cy="28" rx="2" ry="4" fill="#d0c890" opacity="0.4" />
    </g>
  )
}

// ── Month 9: Chrysanthemum ──
function ChrysanthemumPlant() {
  return (
    <g opacity="0.5">
      <line x1="22" y1="52" x2="22" y2="28" stroke="#3a5a2a" strokeWidth="1.5" />
      {/* Chrysanthemum - many petals */}
      <circle cx="22" cy="22" r="7" fill="#d0a020" opacity="0.5" />
      <circle cx="22" cy="22" r="5" fill="#e0b030" opacity="0.4" />
      <circle cx="22" cy="22" r="3" fill="#f0c040" opacity="0.4" />
      {/* Leaves */}
      <ellipse cx="14" cy="36" rx="4" ry="2" fill="#3a6a2a" opacity="0.4" />
      <ellipse cx="30" cy="34" rx="4" ry="2" fill="#3a6a2a" opacity="0.3" />
    </g>
  )
}

// ── Month 10: Maple ──
function MaplePlant() {
  return (
    <g opacity="0.5">
      <line x1="22" y1="52" x2="20" y2="26" stroke="#5a3a2a" strokeWidth="1.5" />
      <line x1="20" y1="34" x2="12" y2="26" stroke="#5a3a2a" strokeWidth="1" />
      <line x1="20" y1="30" x2="32" y2="22" stroke="#5a3a2a" strokeWidth="1" />
      {/* Maple leaves - star shapes approximated */}
      <polygon points="12,24 10,20 12,18 14,20 16,18 14,24" fill="#d04020" opacity="0.6" />
      <polygon points="28,20 26,16 28,14 30,16 32,14 30,20" fill="#e05030" opacity="0.5" />
      <polygon points="20,14 18,10 20,8 22,10 24,8 22,14" fill="#c03818" opacity="0.5" />
      {/* Falling leaves */}
      <polygon points="34,40 33,38 35,38" fill="#d04020" opacity="0.3" />
      <polygon points="8,44 7,42 9,42" fill="#e05030" opacity="0.25" />
    </g>
  )
}

// ── Month 11: Paulownia ──
function PaulowniaPlant() {
  return (
    <g opacity="0.5">
      <line x1="22" y1="55" x2="22" y2="24" stroke="#4a3a2a" strokeWidth="2" />
      <line x1="22" y1="32" x2="12" y2="24" stroke="#4a3a2a" strokeWidth="1" />
      <line x1="22" y1="30" x2="32" y2="22" stroke="#4a3a2a" strokeWidth="1" />
      {/* Paulownia leaves - large round */}
      <ellipse cx="12" cy="22" rx="5" ry="4" fill="#4a6a5a" opacity="0.5" />
      <ellipse cx="32" cy="20" rx="5" ry="4" fill="#4a6a5a" opacity="0.4" />
      <ellipse cx="22" cy="16" rx="4" ry="3" fill="#4a6a5a" opacity="0.4" />
    </g>
  )
}

// ── Month 12: Rain/Willow ──
function RainPlant() {
  return (
    <g opacity="0.5">
      {/* Willow trunk */}
      <line x1="10" y1="55" x2="12" y2="16" stroke="#4a4a3a" strokeWidth="1.5" />
      {/* Willow drooping branches */}
      <path d="M12,20 Q16,30 14,42" fill="none" stroke="#5a7a4a" strokeWidth="0.8" />
      <path d="M12,18 Q20,28 18,40" fill="none" stroke="#5a7a4a" strokeWidth="0.8" />
      <path d="M12,22 Q8,32 10,42" fill="none" stroke="#5a7a4a" strokeWidth="0.8" />
      {/* Rain drops */}
      <line x1="26" y1="10" x2="24" y2="16" stroke="#7090b0" strokeWidth="0.5" opacity="0.5" />
      <line x1="32" y1="14" x2="30" y2="20" stroke="#7090b0" strokeWidth="0.5" opacity="0.5" />
      <line x1="36" y1="8" x2="34" y2="14" stroke="#7090b0" strokeWidth="0.5" opacity="0.4" />
      <line x1="28" y1="24" x2="26" y2="30" stroke="#7090b0" strokeWidth="0.5" opacity="0.4" />
    </g>
  )
}

// ── Bright Card Main Illustrations ──
function BrightIllustration({ month }: { month: number }) {
  switch (month) {
    case 1: return <CraneIllustration />    // 학
    case 3: return <CurtainIllustration />  // 커튼
    case 8: return <MoonIllustration />     // 달
    case 11: return <PhoenixIllustration /> // 봉황
    case 12: return <UmbrellaManIllustration /> // 비광
    default: return null
  }
}

function CraneIllustration() {
  return (
    <g>
      {/* Crane body */}
      <ellipse cx="26" cy="34" rx="6" ry="4" fill="#fff" stroke="#ccc" strokeWidth="0.3" />
      {/* Crane neck */}
      <path d="M30,32 Q32,24 30,20" fill="none" stroke="#fff" strokeWidth="1.5" />
      {/* Crane head */}
      <circle cx="30" cy="19" r="2" fill="#fff" />
      <circle cx="30" cy="18" r="1.2" fill="#d02020" /> {/* Red crown */}
      {/* Beak */}
      <line x1="30" y1="20" x2="34" y2="19" stroke="#333" strokeWidth="0.8" />
      {/* Wings */}
      <path d="M22,32 Q18,28 20,34" fill="#222" stroke="none" />
      {/* Legs */}
      <line x1="26" y1="38" x2="24" y2="46" stroke="#333" strokeWidth="0.6" />
      <line x1="28" y1="38" x2="30" y2="46" stroke="#333" strokeWidth="0.6" />
      {/* Sun */}
      <circle cx="34" cy="10" r="4" fill="#d02020" opacity="0.8" />
    </g>
  )
}

function CurtainIllustration() {
  return (
    <g>
      {/* Festival curtain - maku */}
      <rect x="8" y="20" width="28" height="20" rx="1" fill="#d04040" opacity="0.8" />
      <rect x="8" y="20" width="28" height="4" fill="#2a2a2a" opacity="0.6" />
      {/* Curtain tassels/drapes */}
      <line x1="12" y1="24" x2="12" y2="38" stroke="#f0c040" strokeWidth="0.5" opacity="0.7" />
      <line x1="22" y1="24" x2="22" y2="38" stroke="#f0c040" strokeWidth="0.5" opacity="0.7" />
      <line x1="32" y1="24" x2="32" y2="38" stroke="#f0c040" strokeWidth="0.5" opacity="0.7" />
      {/* Bottom fringe */}
      <rect x="8" y="38" width="28" height="2" fill="#f0c040" opacity="0.5" />
    </g>
  )
}

function MoonIllustration() {
  return (
    <g>
      {/* Night sky hint */}
      <rect x="0" y="0" width="44" height="30" fill="#102040" opacity="0.2" />
      {/* Full moon */}
      <circle cx="22" cy="16" r="9" fill="#f0e8a0" opacity="0.9" />
      <circle cx="22" cy="16" r="9" fill="url(#moonGlow)" opacity="0.3" />
      {/* Moon surface details */}
      <circle cx="19" cy="14" r="1.5" fill="#e0d890" opacity="0.5" />
      <circle cx="25" cy="18" r="1" fill="#e0d890" opacity="0.4" />
    </g>
  )
}

function PhoenixIllustration() {
  return (
    <g>
      {/* Phoenix body */}
      <ellipse cx="22" cy="32" rx="6" ry="5" fill="#d0a020" stroke="#a07010" strokeWidth="0.5" />
      {/* Head */}
      <circle cx="28" cy="24" r="3" fill="#e0b030" />
      {/* Crest */}
      <path d="M28,22 L26,16 L28,18 L30,14 L30,18 L32,16 L30,22" fill="#d04020" opacity="0.8" />
      {/* Beak */}
      <polygon points="31,24 34,23 31,25" fill="#c06010" />
      {/* Eye */}
      <circle cx="29" cy="23.5" r="0.6" fill="#222" />
      {/* Tail feathers */}
      <path d="M16,34 Q8,28 6,18" fill="none" stroke="#d04020" strokeWidth="1.2" />
      <path d="M16,36 Q6,32 4,22" fill="none" stroke="#e0a020" strokeWidth="1" />
      <path d="M16,38 Q10,36 8,28" fill="none" stroke="#d06020" strokeWidth="0.8" />
    </g>
  )
}

function UmbrellaManIllustration() {
  return (
    <g>
      {/* Umbrella */}
      <path d="M12,18 Q22,6 32,18" fill="#d04040" stroke="#a03030" strokeWidth="0.5" />
      <line x1="22" y1="12" x2="22" y2="44" stroke="#5a3a2a" strokeWidth="0.8" />
      {/* Person silhouette */}
      <circle cx="22" cy="28" r="3" fill="#3a3a3a" /> {/* Head */}
      <rect x="18" y="31" width="8" height="10" rx="1" fill="#3a5a8a" /> {/* Body */}
      {/* Legs */}
      <line x1="20" y1="41" x2="18" y2="48" stroke="#3a3a3a" strokeWidth="1" />
      <line x1="24" y1="41" x2="26" y2="48" stroke="#3a3a3a" strokeWidth="1" />
      {/* Frog at feet */}
      <ellipse cx="32" cy="48" rx="2.5" ry="1.5" fill="#4a8a4a" opacity="0.6" />
    </g>
  )
}

// ── Animal Card Illustrations ──
function AnimalIllustration({ month }: { month: number }) {
  switch (month) {
    case 2: return <NightingaleIllustration />
    case 4: return <CuckooIllustration />
    case 5: return <BridgeIllustration />
    case 6: return <ButterflyIllustration />
    case 7: return <BoarIllustration />
    case 8: return <GeeseIllustration />
    case 9: return <SakeCupIllustration />
    case 10: return <DeerIllustration />
    case 12: return <SwallowIllustration />
    default: return null
  }
}

function NightingaleIllustration() {
  return (
    <g>
      {/* Nightingale body */}
      <ellipse cx="26" cy="30" rx="5" ry="3.5" fill="#8aaa40" stroke="#6a8a20" strokeWidth="0.3" />
      {/* Head */}
      <circle cx="30" cy="26" r="2.5" fill="#8aaa40" />
      {/* Eye */}
      <circle cx="31" cy="25.5" r="0.5" fill="#222" />
      {/* Beak */}
      <polygon points="32,26 35,25 32,27" fill="#c08020" />
      {/* Tail */}
      <path d="M22,32 L16,36 L18,32" fill="#6a8a20" />
      {/* Feet */}
      <line x1="26" y1="33" x2="24" y2="38" stroke="#c08020" strokeWidth="0.5" />
      <line x1="28" y1="33" x2="28" y2="38" stroke="#c08020" strokeWidth="0.5" />
    </g>
  )
}

function CuckooIllustration() {
  return (
    <g>
      {/* Cuckoo - flying bird */}
      <ellipse cx="24" cy="28" rx="5" ry="3" fill="#3a3a4a" />
      <circle cx="28" cy="25" r="2" fill="#3a3a4a" />
      <circle cx="29" cy="24.5" r="0.4" fill="#fff" />
      <polygon points="30,25 33,24 30,26" fill="#c06020" />
      {/* Wings spread */}
      <path d="M20,26 Q14,20 10,22" fill="#4a4a5a" stroke="none" />
      <path d="M28,26 Q32,20 36,22" fill="#4a4a5a" stroke="none" />
      {/* Tail */}
      <path d="M20,30 L14,34" fill="none" stroke="#3a3a4a" strokeWidth="1.5" />
    </g>
  )
}

function BridgeIllustration() {
  return (
    <g>
      {/* Eight-plank bridge */}
      <rect x="6" y="34" width="32" height="3" rx="0.5" fill="#8a6a40" />
      {/* Bridge planks */}
      <line x1="10" y1="34" x2="10" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="14" y1="34" x2="14" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="18" y1="34" x2="18" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="22" y1="34" x2="22" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="26" y1="34" x2="26" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="30" y1="34" x2="30" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      <line x1="34" y1="34" x2="34" y2="37" stroke="#6a5030" strokeWidth="0.5" />
      {/* Bridge legs */}
      <line x1="10" y1="37" x2="8" y2="46" stroke="#6a5030" strokeWidth="1" />
      <line x1="34" y1="37" x2="36" y2="46" stroke="#6a5030" strokeWidth="1" />
      {/* Water below */}
      <path d="M4,46 Q12,44 22,46 Q32,48 40,46" fill="none" stroke="#6090c0" strokeWidth="0.5" opacity="0.5" />
    </g>
  )
}

function ButterflyIllustration() {
  return (
    <g>
      {/* Butterfly body */}
      <line x1="22" y1="24" x2="22" y2="34" stroke="#3a2a1a" strokeWidth="1" />
      {/* Upper wings */}
      <ellipse cx="16" cy="26" rx="5" ry="4" fill="#e0a020" stroke="#c08010" strokeWidth="0.3" />
      <ellipse cx="28" cy="26" rx="5" ry="4" fill="#e0a020" stroke="#c08010" strokeWidth="0.3" />
      {/* Lower wings */}
      <ellipse cx="17" cy="32" rx="4" ry="3" fill="#d09020" stroke="#b07010" strokeWidth="0.3" />
      <ellipse cx="27" cy="32" rx="4" ry="3" fill="#d09020" stroke="#b07010" strokeWidth="0.3" />
      {/* Wing patterns */}
      <circle cx="16" cy="26" r="1.5" fill="#222" opacity="0.3" />
      <circle cx="28" cy="26" r="1.5" fill="#222" opacity="0.3" />
      {/* Antennae */}
      <line x1="22" y1="24" x2="19" y2="20" stroke="#3a2a1a" strokeWidth="0.5" />
      <line x1="22" y1="24" x2="25" y2="20" stroke="#3a2a1a" strokeWidth="0.5" />
      <circle cx="19" cy="20" r="0.5" fill="#3a2a1a" />
      <circle cx="25" cy="20" r="0.5" fill="#3a2a1a" />
    </g>
  )
}

function BoarIllustration() {
  return (
    <g>
      {/* Boar body */}
      <ellipse cx="22" cy="36" rx="9" ry="6" fill="#5a4a3a" />
      {/* Head */}
      <ellipse cx="32" cy="32" rx="5" ry="4" fill="#5a4a3a" />
      {/* Snout */}
      <ellipse cx="36" cy="33" rx="2" ry="1.5" fill="#7a6a5a" />
      <circle cx="36" cy="33" r="0.4" fill="#222" />
      <circle cx="37" cy="33" r="0.4" fill="#222" />
      {/* Eye */}
      <circle cx="33" cy="31" r="0.6" fill="#222" />
      {/* Ear */}
      <ellipse cx="30" cy="28" rx="1.5" ry="2" fill="#6a5a4a" />
      {/* Legs */}
      <line x1="16" y1="40" x2="14" y2="48" stroke="#4a3a2a" strokeWidth="1.5" />
      <line x1="20" y1="41" x2="18" y2="48" stroke="#4a3a2a" strokeWidth="1.5" />
      <line x1="26" y1="41" x2="26" y2="48" stroke="#4a3a2a" strokeWidth="1.5" />
      <line x1="30" y1="40" x2="32" y2="48" stroke="#4a3a2a" strokeWidth="1.5" />
    </g>
  )
}

function GeeseIllustration() {
  return (
    <g>
      {/* Three geese flying in formation */}
      <path d="M10,34 L14,30 L18,34" fill="none" stroke="#fff" strokeWidth="1.2" />
      <path d="M18,30 L22,26 L26,30" fill="none" stroke="#fff" strokeWidth="1.2" />
      <path d="M26,34 L30,30 L34,34" fill="none" stroke="#fff" strokeWidth="1.2" />
      {/* Bodies */}
      <circle cx="14" cy="31" r="1" fill="#ddd" />
      <circle cx="22" cy="27" r="1" fill="#ddd" />
      <circle cx="30" cy="31" r="1" fill="#ddd" />
    </g>
  )
}

function SakeCupIllustration() {
  return (
    <g>
      {/* Sake cup - red lacquer */}
      <ellipse cx="22" cy="34" rx="8" ry="3" fill="#c02020" />
      <ellipse cx="22" cy="32" rx="8" ry="3" fill="#d03030" />
      {/* Cup interior */}
      <ellipse cx="22" cy="32" rx="6" ry="2" fill="#e04040" />
      {/* Sake/liquid inside */}
      <ellipse cx="22" cy="32" rx="5" ry="1.5" fill="#e8e0d0" opacity="0.7" />
      {/* Cup stand */}
      <rect x="19" y="36" width="6" height="2" rx="0.5" fill="#a01818" />
      <ellipse cx="22" cy="40" rx="5" ry="1.5" fill="#c02020" />
    </g>
  )
}

function DeerIllustration() {
  return (
    <g>
      {/* Deer body */}
      <ellipse cx="20" cy="36" rx="8" ry="5" fill="#b08040" />
      {/* Head */}
      <circle cx="30" cy="28" r="3" fill="#b08040" />
      {/* Neck */}
      <path d="M26,34 Q28,30 30,28" fill="#b08040" stroke="#b08040" strokeWidth="3" />
      {/* Antlers */}
      <path d="M30,26 L28,18 L26,20" fill="none" stroke="#6a4a2a" strokeWidth="0.8" />
      <path d="M30,26 L32,18 L34,20" fill="none" stroke="#6a4a2a" strokeWidth="0.8" />
      <line x1="28" y1="20" x2="26" y2="16" stroke="#6a4a2a" strokeWidth="0.6" />
      <line x1="32" y1="20" x2="34" y2="16" stroke="#6a4a2a" strokeWidth="0.6" />
      {/* Eye */}
      <circle cx="31" cy="27.5" r="0.5" fill="#222" />
      {/* Spots */}
      <circle cx="18" cy="34" r="0.8" fill="#c09050" opacity="0.5" />
      <circle cx="22" cy="33" r="0.8" fill="#c09050" opacity="0.5" />
      {/* Legs */}
      <line x1="14" y1="40" x2="12" y2="48" stroke="#8a6030" strokeWidth="1" />
      <line x1="18" y1="40" x2="16" y2="48" stroke="#8a6030" strokeWidth="1" />
      <line x1="24" y1="40" x2="24" y2="48" stroke="#8a6030" strokeWidth="1" />
      <line x1="26" y1="40" x2="28" y2="48" stroke="#8a6030" strokeWidth="1" />
    </g>
  )
}

function SwallowIllustration() {
  return (
    <g>
      {/* Swallow - small bird in rain */}
      <ellipse cx="28" cy="30" rx="4" ry="2.5" fill="#2a2a3a" />
      <circle cx="32" cy="28" r="1.5" fill="#2a2a3a" />
      <circle cx="33" cy="27.5" r="0.3" fill="#fff" />
      <polygon points="33,28 36,27 33,29" fill="#c06020" />
      {/* Forked tail */}
      <path d="M24,30 L18,26" fill="none" stroke="#2a2a3a" strokeWidth="1" />
      <path d="M24,31 L18,34" fill="none" stroke="#2a2a3a" strokeWidth="1" />
      {/* Wings */}
      <path d="M28,28 Q24,24 20,26" fill="#3a3a4a" />
    </g>
  )
}

// ── Ribbon Illustration ──
function RibbonIllustration({ ribbonType }: { ribbonType?: string }) {
  const colors: Record<string, [string, string]> = {
    hongdan: ['#d03030', '#a01818'],   // Red poetry ribbon
    chodan: ['#2a8a2a', '#1a6a1a'],    // Green plain ribbon
    cheongdan: ['#2050b0', '#103890'],  // Blue poetry ribbon
    bi: ['#6a2a8a', '#4a1a6a'],        // Rain special ribbon
  }
  const [c1, c2] = colors[ribbonType ?? ''] ?? ['#888', '#666']
  const isPoetry = ribbonType === 'hongdan' || ribbonType === 'cheongdan'

  return (
    <g>
      {/* Ribbon banner */}
      <rect x="8" y="28" width="28" height="10" rx="1" fill={c1} />
      <rect x="8" y="28" width="28" height="10" rx="1" fill={c2} opacity="0.3" />
      {/* Ribbon edge decoration */}
      <line x1="8" y1="29" x2="36" y2="29" stroke="#fff" strokeWidth="0.3" opacity="0.3" />
      <line x1="8" y1="37" x2="36" y2="37" stroke="#fff" strokeWidth="0.3" opacity="0.3" />
      {/* Poetry text lines (for hongdan and cheongdan) */}
      {isPoetry && (
        <>
          <line x1="14" y1="31" x2="14" y2="36" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
          <line x1="18" y1="31" x2="18" y2="36" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
          <line x1="22" y1="31" x2="22" y2="36" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
          <line x1="26" y1="31" x2="26" y2="36" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
          <line x1="30" y1="31" x2="30" y2="36" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
        </>
      )}
    </g>
  )
}

// ── Junk Illustration ──
function JunkIllustration() {
  // Junk cards show just the plant, smaller and simpler
  return (
    <g opacity="0.3">
      <text x="22" y="36" textAnchor="middle" fontSize="4" fill="#8a7a6a" fontWeight="600">{'\uD53C'}</text>
    </g>
  )
}
