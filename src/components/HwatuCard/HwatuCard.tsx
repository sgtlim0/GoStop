import type { HwatuCard as HwatuCardType } from '../../types/index.ts'
import { MONTH_COLORS } from '../../types/index.ts'
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

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  bright: { label: '\u2600', color: '#f0c040' },
  animal: { label: '\u25CF', color: '#4a9eff' },
  ribbon: { label: '\u2550', color: '#e06060' },
  junk: { label: '\u00B7', color: '#888' },
}

const RIBBON_COLORS: Record<string, string> = {
  hongdan: '#d32f2f',
  chodan: '#388e3c',
  cheongdan: '#1565c0',
  bi: '#6a1b9a',
}

export default function HwatuCard({ card, faceDown, selected, highlight, small, onClick, animateIn, delay = 0 }: Props) {
  const badge = TYPE_BADGE[card.type]
  const monthColor = MONTH_COLORS[card.month]
  const ribbonColor = card.ribbonType ? RIBBON_COLORS[card.ribbonType] : undefined

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
          <div className={styles.backPattern} />
        </div>
      ) : (
        <div className={styles.face} style={{ background: `linear-gradient(145deg, ${monthColor}, ${monthColor}dd)` }}>
          <div className={styles.monthNum}>{card.month}</div>
          <div className={styles.typeBadge} style={{ background: badge.color }}>{badge.label}</div>
          {ribbonColor && <div className={styles.ribbon} style={{ background: ribbonColor }} />}
          <div className={styles.cardName}>{card.name}</div>
          {card.type === 'bright' && <div className={styles.brightGlow} />}
        </div>
      )}
    </div>
  )
}
