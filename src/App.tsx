import { useState, useCallback, useEffect } from 'react'
import { useGoStopGame } from './hooks/useGoStopGame.ts'
import { soundEngine } from './engine/sound.ts'
import GameField from './components/GameField/GameField.tsx'
import PlayerHand from './components/PlayerHand/PlayerHand.tsx'
import CapturedArea from './components/CapturedArea/CapturedArea.tsx'
import ScoreBoard from './components/ScoreBoard/ScoreBoard.tsx'
import GoStopModal from './components/GoStopModal/GoStopModal.tsx'
import styles from './App.module.css'

export default function App() {
  const game = useGoStopGame()
  const { state } = game
  const [muted, setMuted] = useState(false)
  const [soundReady, setSoundReady] = useState(false)

  const initSound = useCallback(() => {
    if (!soundReady) {
      soundEngine.init()
      setSoundReady(true)
    }
  }, [soundReady])

  const toggleMute = useCallback(() => {
    initSound()
    setMuted(soundEngine.toggleMute())
  }, [initSound])

  const handleStart = useCallback(() => {
    initSound()
    game.startGame()
  }, [initSound, game])

  const handleSelectCard = useCallback((card: Parameters<typeof game.selectCard>[0]) => {
    initSound()
    game.selectCard(card)
  }, [initSound, game])

  const handleFieldCardClick = useCallback((card: Parameters<typeof game.selectMatch>[0]) => {
    initSound()
    if (state.phase === 'playerPickMatch') {
      game.selectMatch(card)
    } else if (state.phase === 'playerFlipMatch') {
      game.selectFlipMatch(card)
    }
  }, [initSound, game, state.phase])

  const handleFlip = useCallback(() => {
    initSound()
    game.flipDeck()
  }, [initSound, game])

  const handleGo = useCallback(() => {
    initSound()
    game.playerGo()
  }, [initSound, game])

  const handleStop = useCallback(() => {
    initSound()
    game.playerStop()
  }, [initSound, game])

  const handleNewRound = useCallback(() => {
    initSound()
    game.newRound()
  }, [initSound, game])

  // Trigger opponent turn
  useEffect(() => {
    if (state.phase === 'opponentTurn') {
      game.triggerOpponent()
    }
  }, [state.phase, game])

  if (state.phase === 'idle') {
    return (
      <div className={styles.app}>
        <div className={styles.startScreen}>
          <div className={styles.startTitle}>{'\uD654\uD22C'}</div>
          <div className={styles.startSubtitle}>{'\uB9DE\uACE0 - 2\uC778 \uACE0\uC2A4\uD1B1'}</div>
          <button className={styles.startBtn} onClick={handleStart}>
            {'\uAC8C\uC784 \uC2DC\uC791'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>{'\uD83C\uDFB4'}</span>
          <span className={styles.logoText}>{'\uB9DE\uACE0'}</span>
        </div>
        <button className={styles.soundToggle} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
        </button>
      </header>

      <div className={styles.gameArea}>
        <GameField
          state={state}
          onFieldCardClick={handleFieldCardClick}
        />

        <div className={styles.capturedRow}>
          <div className={styles.capturedHalf}>
            <CapturedArea captured={state.playerCapture} label={'\uB0B4 \uD68D\uB4DD'} />
          </div>
          <div className={styles.capturedHalf}>
            <CapturedArea captured={state.opponentCapture} label={'\uC0C1\uB300 \uD68D\uB4DD'} />
          </div>
        </div>

        <ScoreBoard state={state} />

        <PlayerHand state={state} onCardClick={handleSelectCard} />

        {state.phase === 'playerFlip' && (
          <div className={styles.controlBar}>
            <button className={`${styles.actionButton} ${styles.primaryBtn}`} onClick={handleFlip}>
              {'\uB371 \uB4A4\uC9D1\uAE30'}
            </button>
          </div>
        )}
      </div>

      <GoStopModal
        state={state}
        onGo={handleGo}
        onStop={handleStop}
        onNewRound={handleNewRound}
      />
    </div>
  )
}
