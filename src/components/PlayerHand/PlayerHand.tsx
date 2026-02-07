import type { HwatuCard as CardType, GameState } from '../../types/index.ts'
import HwatuCard from '../HwatuCard/HwatuCard.tsx'
import styles from './PlayerHand.module.css'

interface Props {
  readonly state: GameState
  readonly onCardClick: (card: CardType) => void
}

export default function PlayerHand({ state, onCardClick }: Props) {
  const { playerHand, phase, selectedCard } = state
  const canSelect = phase === 'playerPickCard'

  return (
    <div className={styles.container}>
      <div className={styles.label}>{'\uB0B4 \uD328'}</div>
      <div className={styles.hand}>
        {playerHand.map((card, i) => (
          <HwatuCard
            key={card.id}
            card={card}
            selected={selectedCard?.id === card.id}
            onClick={canSelect ? () => onCardClick(card) : undefined}
            animateIn={phase === 'dealing'}
            delay={i * 40}
          />
        ))}
      </div>
    </div>
  )
}
