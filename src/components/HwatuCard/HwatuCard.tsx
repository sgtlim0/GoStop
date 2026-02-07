import type { HwatuCard as HwatuCardType } from '../../types/index.ts'
import CardIllustration from './CardIllustration.tsx'
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

export default function HwatuCard({ card, faceDown, selected, highlight, small, onClick, animateIn, delay = 0 }: Props) {
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
        <div className={styles.face}>
          {/* SVG Illustration Layer */}
          <CardIllustration
            month={card.month}
            type={card.type}
            ribbonType={card.ribbonType}
            size={small ? 'small' : 'normal'}
          />

          {/* Month number badge */}
          <div className={styles.monthBadge}>{card.month}{'\uC6D4'}</div>

          {/* Type indicator */}
          {card.type === 'bright' && <div className={styles.brightBadge}>{'\u5149'}</div>}

          {/* Card name at bottom */}
          <div className={styles.cardLabel}>{card.name}</div>

          {/* Bright glow overlay */}
          {card.type === 'bright' && <div className={styles.brightGlow} />}
        </div>
      )}
    </div>
  )
}
