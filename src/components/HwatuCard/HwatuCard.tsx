import type { HwatuCard as HwatuCardType } from '../../types/index.ts'
import styles from './HwatuCard.module.css'

interface Props {
  readonly card: HwatuCardType
  readonly faceDown?: boolean
  readonly selected?: boolean
  readonly highlight?: boolean
  readonly small?: boolean
  readonly onClick?: () => void
  readonly animateIn?: boolean
  readonly delay?: number
}

// Traditional Hwatu card background colors per month
const MONTH_BG: Record<number, string> = {
  1: '#2d5a27',   // Pine green
  2: '#8b2252',   // Plum pink
  3: '#d4729a',   // Cherry blossom
  4: '#5c3d7a',   // Wisteria purple
  5: '#2a4a8a',   // Iris blue
  6: '#b8372a',   // Peony red
  7: '#6b7a2a',   // Bush clover olive
  8: '#1a3058',   // Pampas night blue
  9: '#9a7a1a',   // Chrysanthemum gold
  10: '#b84a1a',  // Maple orange
  11: '#3a2a5a',  // Paulownia violet
  12: '#3a4a5a',  // Rain grey-blue
}

// Accent colors for type badges
const TYPE_STYLES: Record<string, { bg: string; label: string }> = {
  bright: { bg: '#ffd700', label: '\u2606' },
  animal: { bg: '#4a9eff', label: '\u25CB' },
  ribbon: { bg: '#e06060', label: '\u2550' },
  junk: { bg: '#8a8a7a', label: '\u00B7' },
}

const RIBBON_COLORS: Record<string, { bg: string; text: string }> = {
  hongdan: { bg: '#d32f2f', text: '#fff' },
  chodan: { bg: '#2e7d32', text: '#fff' },
  cheongdan: { bg: '#1565c0', text: '#fff' },
  bi: { bg: '#6a1b9a', text: '#fff' },
}

export default function HwatuCard({ card, faceDown, selected, highlight, small, onClick, animateIn, delay = 0 }: Props) {
  const monthBg = MONTH_BG[card.month] ?? '#444'
  const typeStyle = TYPE_STYLES[card.type]
  const ribbonStyle = card.ribbonType ? RIBBON_COLORS[card.ribbonType] : undefined

  const cls = [
    styles.card,
    faceDown ? styles.faceDown : '',
    selected ? styles.selected : '',
    highlight ? styles.highlight : '',
    small ? styles.small : '',
    onClick ? styles.clickable : '',
    animateIn ? styles.animateIn : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} onClick={onClick} style={{ animationDelay: `${delay}ms` }}>
      {faceDown ? (
        <div className={styles.back}>
          <div className={styles.backInner}>
            <div className={styles.backSymbol}>{'\uD83C\uDFB4'}</div>
          </div>
        </div>
      ) : (
        <div className={styles.face} style={{ '--month-bg': monthBg } as React.CSSProperties}>
          {/* Top left: month number */}
          <div className={styles.monthBadge}>{card.month}</div>

          {/* Top right: type indicator */}
          <div
            className={styles.typeBadge}
            style={{ background: typeStyle.bg }}
          >
            {typeStyle.label}
          </div>

          {/* Center: main illustration */}
          <div className={styles.illustrationArea}>
            <div className={styles.mainEmoji}>{card.illustration}</div>
            {card.type === 'bright' && (
              <div className={styles.brightStar}>{'\u2728'}</div>
            )}
          </div>

          {/* Ribbon strip */}
          {ribbonStyle && (
            <div
              className={styles.ribbonStrip}
              style={{ background: ribbonStyle.bg, color: ribbonStyle.text }}
            >
              {card.name}
            </div>
          )}

          {/* Bottom: card name */}
          <div className={styles.cardLabel}>
            {card.type === 'junk' && card.junkValue >= 2 ? '\uC30D\uD53C' : card.name}
          </div>

          {/* Bright glow overlay */}
          {card.type === 'bright' && <div className={styles.brightGlow} />}
        </div>
      )}
    </div>
  )
}
