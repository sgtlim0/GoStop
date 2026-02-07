import type { HwatuCard as CardType, GameState } from '../../types/index.ts'
import HwatuCard from '../HwatuCard/HwatuCard.tsx'
import styles from './GameField.module.css'

interface Props {
  readonly state: GameState
  readonly onFieldCardClick?: (card: CardType) => void
}

export default function GameField({ state, onFieldCardClick }: Props) {
  const { field, pendingMatch, phase, flippedCard, opponentHand, deck } = state
  const matchIds = pendingMatch?.matchCandidates.map(c => c.id) ?? []
  const isPickingMatch = phase === 'playerPickMatch' || phase === 'playerFlipMatch'

  return (
    <div className={styles.container}>
      {/* Opponent hand */}
      <div className={styles.opponentRow}>
        <div className={styles.rowLabel}>{'\uC0C1\uB300'}</div>
        <div className={styles.handCards}>
          {opponentHand.map((card, i) => (
            <HwatuCard key={card.id} card={card} faceDown small delay={i * 30} />
          ))}
        </div>
      </div>

      {/* Field */}
      <div className={styles.fieldArea}>
        <div className={styles.fieldGrid}>
          {field.map(card => {
            const isMatch = isPickingMatch && matchIds.includes(card.id)
            return (
              <HwatuCard
                key={card.id}
                card={card}
                highlight={isMatch}
                onClick={isMatch ? () => onFieldCardClick?.(card) : undefined}
              />
            )
          })}
        </div>
        <div className={styles.deckArea}>
          {deck.length > 0 && (
            <div className={styles.deckStack}>
              <HwatuCard card={deck[0]} faceDown />
              <div className={styles.deckCount}>{deck.length}</div>
            </div>
          )}
          {flippedCard && phase !== 'playerPickCard' && (
            <div className={styles.flippedCard}>
              <HwatuCard card={flippedCard} animateIn />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
