import type { GameState } from '../../types/index.ts'
import styles from './GoStopModal.module.css'

interface Props {
  readonly state: GameState
  readonly onGo: () => void
  readonly onStop: () => void
  readonly onNewRound: () => void
}

export default function GoStopModal({ state, onGo, onStop, onNewRound }: Props) {
  if (state.phase === 'goStop') {
    const multiplier = Math.pow(2, state.goCount.player)
    const currentPoints = state.playerScore.total * multiplier
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.title}>{state.playerScore.total}{'\uC810'} {'\uB2EC\uC131'}!</div>
          <div className={styles.subtitle}>
            {state.goCount.player > 0 && `${state.goCount.player}\uACE0 \u00D7 \uBC30\uC728 = ${currentPoints}\uC810`}
            {state.goCount.player === 0 && `\uD604\uC7AC ${currentPoints}\uC810`}
          </div>
          <div className={styles.details}>
            {state.playerScore.details.map((d, i) => (
              <div key={i} className={styles.detailRow}>
                <span>{d.label}</span>
                <span>+{d.points}</span>
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <button className={styles.goButton} onClick={onGo}>{'\uACE0'} (GO)</button>
            <button className={styles.stopButton} onClick={onStop}>{'\uC2A4\uD1B1'} (STOP)</button>
          </div>
        </div>
      </div>
    )
  }

  if (state.phase === 'roundEnd') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.title}>{'\uB77C\uC6B4\uB4DC \uC885\uB8CC'}</div>
          <div className={styles.resultRow}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>{'\uB0B4 \uC810\uC218'}</span>
              <span className={styles.resultValue}>{state.totalScore.player}</span>
            </div>
            <span className={styles.vs}>vs</span>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>{'\uC0C1\uB300 \uC810\uC218'}</span>
              <span className={styles.resultValue}>{state.totalScore.opponent}</span>
            </div>
          </div>
          <div className={styles.message}>{state.message}</div>
          <button className={styles.stopButton} onClick={onNewRound}>{'\uB2E4\uC74C \uB77C\uC6B4\uB4DC'}</button>
        </div>
      </div>
    )
  }

  return null
}
