import { useState, useCallback, useEffect } from 'react'
import { useGoStopGame } from './hooks/useGoStopGame.ts'
import { soundEngine } from './engine/sound.ts'
import type { AIDifficulty } from './types/index.ts'
import { DIFFICULTY_LABELS } from './types/index.ts'
import GameField from './components/GameField/GameField.tsx'
import PlayerHand from './components/PlayerHand/PlayerHand.tsx'
import CapturedArea from './components/CapturedArea/CapturedArea.tsx'
import ScoreBoard from './components/ScoreBoard/ScoreBoard.tsx'
import GoStopModal from './components/GoStopModal/GoStopModal.tsx'
import styles from './App.module.css'

const DIFFICULTIES: AIDifficulty[] = ['easy', 'normal', 'hard', 'insane', 'impossible']

export default function App() {
  const game = useGoStopGame()
  const { state, difficulty, setDifficulty, inputLocked } = game
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

  // Auto-advance: auto-flip deck when in playerFlip phase
  useEffect(() => {
    if (state.phase === 'playerFlip' && !inputLocked) {
      const timer = setTimeout(() => {
        handleFlip()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [state.phase, inputLocked, handleFlip])

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

          <div className={styles.difficultySection}>
            <div className={styles.difficultyLabel}>{'\uB09C\uC774\uB3C4'}</div>
            <div className={styles.difficultyGrid}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`${styles.difficultyBtn} ${difficulty === d ? styles.difficultyActive : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  <span className={styles.difficultyName}>{DIFFICULTY_LABELS[d]}</span>
                  <span className={styles.difficultyStars}>
                    {d === 'easy' && '\u2605'}
                    {d === 'normal' && '\u2605\u2605'}
                    {d === 'hard' && '\u2605\u2605\u2605'}
                    {d === 'insane' && '\u2605\u2605\u2605\u2605'}
                    {d === 'impossible' && '\u2605\u2605\u2605\u2605\u2605'}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
        <div className={styles.headerLeft}>
          <span className={styles.difficultyTag}>{DIFFICULTY_LABELS[difficulty]}</span>
        </div>
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
