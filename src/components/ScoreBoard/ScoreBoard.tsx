import type { GameState } from '../../types/index.ts'
import styles from './ScoreBoard.module.css'

interface Props {
  readonly state: GameState
}

export default function ScoreBoard({ state }: Props) {
  const { playerScore, opponentScore, goCount, totalScore, message } = state

  return (
    <div className={styles.board}>
      <div className={styles.scores}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>{'\uB0B4 \uC810\uC218'}</span>
          <span className={styles.scoreValue}>{playerScore.total}</span>
          {goCount.player > 0 && <span className={styles.goTag}>{goCount.player}{'\uACE0'}</span>}
        </div>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>{'\uB204\uC801'}</span>
          <span className={styles.totalValue}>{totalScore.player} : {totalScore.opponent}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>{'\uC0C1\uB300 \uC810\uC218'}</span>
          <span className={styles.scoreValue}>{opponentScore.total}</span>
          {goCount.opponent > 0 && <span className={styles.goTag}>{goCount.opponent}{'\uACE0'}</span>}
        </div>
      </div>
      {message && <div className={styles.message}>{message}</div>}
      {playerScore.details.length > 0 && (
        <div className={styles.details}>
          {playerScore.details.map((d, i) => (
            <span key={i} className={styles.detailTag}>{d.label} +{d.points}</span>
          ))}
        </div>
      )}
    </div>
  )
}
