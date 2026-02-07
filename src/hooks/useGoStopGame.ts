import { useState, useCallback, useRef } from 'react'
import type { HwatuCard, GameState, GamePhase, CapturedCards } from '../types/index.ts'
import { emptyCaptured, emptyScore } from '../types/index.ts'
import { createDeck, shuffleDeck, dealInitial, getFieldMatches, sortHand } from '../engine/cards.ts'
import { calculateScore, addToCapture } from '../engine/scoring.ts'
import { aiPickCard, aiPickMatch, aiShouldGo } from '../engine/ai.ts'
import { soundEngine } from '../engine/sound.ts'

function initialState(): GameState {
  return {
    phase: 'idle',
    deck: [],
    field: [],
    playerHand: [],
    opponentHand: [],
    playerCapture: emptyCaptured(),
    opponentCapture: emptyCaptured(),
    currentTurn: 'player',
    selectedCard: null,
    pendingMatch: null,
    flippedCard: null,
    playerScore: emptyScore(),
    opponentScore: emptyScore(),
    goCount: { player: 0, opponent: 0 },
    sweepCount: { player: 0, opponent: 0 },
    message: '',
    round: 0,
    totalScore: { player: 0, opponent: 0 },
    lastCaptured: [],
  }
}

export function useGoStopGame() {
  const [state, setState] = useState<GameState>(initialState)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  // ── Helpers ──

  function captureCards(
    who: 'player' | 'opponent',
    prev: GameState,
    played: HwatuCard,
    matched: HwatuCard | null,
    flipped: HwatuCard | null,
    flipMatched: HwatuCard | null
  ): Partial<GameState> {
    const captureKey = who === 'player' ? 'playerCapture' : 'opponentCapture'
    const sweepKey = 'sweepCount'
    let cap: CapturedCards = prev[captureKey]
    const toCapture: HwatuCard[] = []
    let newField = [...prev.field]

    // Step 1: played card matching
    if (matched) {
      toCapture.push(played, matched)
      newField = newField.filter(c => c.id !== matched.id)
    } else {
      newField.push(played)
    }

    // Step 2: flipped card matching
    if (flipped) {
      if (flipMatched) {
        toCapture.push(flipped, flipMatched)
        newField = newField.filter(c => c.id !== flipMatched.id)
        // If flipped matched the card we just placed (쪽)
        if (!matched && flipMatched.id === played.id) {
          // played card is already in newField, remove it
          newField = newField.filter(c => c.id !== played.id)
        }
      } else {
        newField.push(flipped)
      }
    }

    cap = addToCapture(cap, toCapture)

    // Check sweep
    let sweeps = prev[sweepKey]
    if (toCapture.length > 0 && newField.length === 0) {
      soundEngine.playSweep()
      sweeps = { ...sweeps, [who]: sweeps[who] + 1 }
    } else if (toCapture.length > 0) {
      soundEngine.playCapture()
    }

    return {
      [captureKey]: cap,
      field: newField,
      [sweepKey]: sweeps,
      lastCaptured: toCapture,
    }
  }

  // ── Actions ──

  const startGame = useCallback(() => {
    clearTimer()
    soundEngine.playDeal()
    const deck = shuffleDeck(createDeck())
    const { playerHand, opponentHand, field, remaining } = dealInitial(deck)
    setState(prev => ({
      ...initialState(),
      phase: 'dealing' as GamePhase,
      deck: remaining,
      field,
      playerHand,
      opponentHand,
      round: prev.round + 1,
      totalScore: prev.totalScore,
    }))
    timerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'playerPickCard', message: '\uCE74\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694' }))
    }, 800)
  }, [])

  const selectCard = useCallback((card: HwatuCard) => {
    setState(prev => {
      if (prev.phase !== 'playerPickCard') return prev
      soundEngine.playClick()

      const matches = getFieldMatches(card, prev.field)
      const newHand = prev.playerHand.filter(c => c.id !== card.id)

      if (matches.length === 0) {
        // No match: card to field, go to flip
        soundEngine.playCardPlace()
        return {
          ...prev,
          playerHand: newHand,
          field: [...prev.field, card],
          selectedCard: card,
          phase: 'playerFlip' as GamePhase,
          message: '\uB371 \uCE74\uB4DC \uB4A4\uC9D1\uAE30...',
          pendingMatch: null,
        }
      }

      if (matches.length === 1) {
        // Auto capture
        soundEngine.playCardPlace()
        return {
          ...prev,
          playerHand: newHand,
          selectedCard: card,
          pendingMatch: { playedCard: card, matchCandidates: matches },
          phase: 'playerFlip' as GamePhase,
          message: '\uB371 \uCE74\uB4DC \uB4A4\uC9D1\uAE30...',
        }
      }

      if (matches.length >= 3) {
        // 3 match = capture all (bomb)
        soundEngine.playCardPlace()
        return {
          ...prev,
          playerHand: newHand,
          selectedCard: card,
          pendingMatch: { playedCard: card, matchCandidates: matches },
          phase: 'playerFlip' as GamePhase,
          message: '\uD3ED\uD0C4! \uB371 \uCE74\uB4DC \uB4A4\uC9D1\uAE30...',
        }
      }

      // 2 matches: player picks
      return {
        ...prev,
        playerHand: newHand,
        selectedCard: card,
        pendingMatch: { playedCard: card, matchCandidates: matches },
        phase: 'playerPickMatch' as GamePhase,
        message: '\uAC00\uC838\uAC08 \uCE74\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694',
      }
    })
  }, [])

  const selectMatch = useCallback((matchCard: HwatuCard) => {
    soundEngine.playCapture()
    setState(prev => {
      if (prev.phase !== 'playerPickMatch' || !prev.pendingMatch) return prev
      return {
        ...prev,
        pendingMatch: { ...prev.pendingMatch, matchCandidates: [matchCard] },
        phase: 'playerFlip' as GamePhase,
        message: '\uB371 \uCE74\uB4DC \uB4A4\uC9D1\uAE30...',
      }
    })
  }, [])

  const flipDeck = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'playerFlip') return prev
      if (prev.deck.length === 0) return prev

      soundEngine.playFlip()
      const [flipped, ...restDeck] = prev.deck

      // Also check if flipped matches the card we placed (쪽)
      let allFieldForFlip = [...prev.field]
      if (prev.selectedCard && !prev.pendingMatch) {
        // selectedCard was placed on field (no match found)
        // field already contains it
      }

      const flipMatchCandidates = getFieldMatches(flipped, allFieldForFlip)

      if (flipMatchCandidates.length === 2) {
        // Player chooses
        return {
          ...prev,
          deck: restDeck,
          flippedCard: flipped,
          phase: 'playerFlipMatch' as GamePhase,
          message: '\uB4A4\uC9D1\uC740 \uCE74\uB4DC\uC640 \uB9E4\uCE6D\uD560 \uCE74\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694',
        }
      }

      // Auto resolve
      const flipMatch = flipMatchCandidates.length === 1 ? flipMatchCandidates[0]
        : flipMatchCandidates.length >= 3 ? flipMatchCandidates[0] // capture first (all will be handled)
        : null

      const playedCard = prev.selectedCard!
      const playedMatch = prev.pendingMatch?.matchCandidates[0] ?? null

      // Handle 3-match bomb for flip
      let extraCaptures: HwatuCard[] = []
      if (flipMatchCandidates.length >= 3) {
        extraCaptures = flipMatchCandidates.slice(1)
      }
      if (prev.pendingMatch && prev.pendingMatch.matchCandidates.length >= 3) {
        // played card was a bomb too
      }

      const changes = captureCards('player', { ...prev, deck: restDeck }, playedCard, playedMatch, flipped, flipMatch)

      // Also handle extra captures for bombs
      let finalCapture = (changes as Record<string, unknown>).playerCapture as CapturedCards
      let finalField = changes.field as HwatuCard[]
      if (extraCaptures.length > 0) {
        finalCapture = addToCapture(finalCapture, extraCaptures)
        finalField = finalField.filter(
          c => !extraCaptures.some(e => e.id === c.id)
        )
      }
      if (prev.pendingMatch && prev.pendingMatch.matchCandidates.length >= 3) {
        const extraPlayed = prev.pendingMatch.matchCandidates.slice(1)
        finalCapture = addToCapture(finalCapture, extraPlayed)
        finalField = finalField.filter(
          c => !extraPlayed.some(e => e.id === c.id)
        )
      }

      const newScore = calculateScore(finalCapture, ((changes as Record<string, unknown>).sweepCount as { player: number; opponent: number }).player)
      const hadScore = prev.playerScore.total > 0
      const hasNewScore = newScore.total > 0 && (!hadScore || newScore.total > prev.playerScore.total)
      const wasGo = prev.goCount.player > 0

      const nextPhase: GamePhase = (hasNewScore && (newScore.total >= 1 || wasGo))
        ? 'goStop'
        : 'opponentTurn'

      return {
        ...prev,
        ...changes,
        field: finalField,
        playerCapture: finalCapture,
        deck: restDeck,
        flippedCard: flipped,
        selectedCard: null,
        pendingMatch: null,
        playerScore: newScore,
        phase: nextPhase,
        message: nextPhase === 'goStop' ? `${newScore.total}\uC810! \uACE0 \uB610\uB294 \uC2A4\uD1B1?` : '',
      }
    })

    // If opponent turn, trigger AI after delay
    timerRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.phase === 'opponentTurn') return prev // will be handled by runOpponent
        return prev
      })
    }, 100)
  }, [])

  const selectFlipMatch = useCallback((matchCard: HwatuCard) => {
    soundEngine.playCapture()
    setState(prev => {
      if (prev.phase !== 'playerFlipMatch' || !prev.flippedCard) return prev

      const playedCard = prev.selectedCard!
      const playedMatch = prev.pendingMatch?.matchCandidates[0] ?? null
      const changes = captureCards('player', prev, playedCard, playedMatch, prev.flippedCard, matchCard)

      let finalCapture = (changes as Record<string, unknown>).playerCapture as CapturedCards
      let finalField = changes.field as HwatuCard[]
      if (prev.pendingMatch && prev.pendingMatch.matchCandidates.length >= 3) {
        const extra = prev.pendingMatch.matchCandidates.slice(1)
        finalCapture = addToCapture(finalCapture, extra)
        finalField = finalField.filter(c => !extra.some(e => e.id === c.id))
      }

      const newScore = calculateScore(finalCapture, ((changes as Record<string, unknown>).sweepCount as { player: number; opponent: number }).player)
      const hadScore = prev.playerScore.total > 0
      const hasNewScore = newScore.total > 0 && (!hadScore || newScore.total > prev.playerScore.total)
      const wasGo = prev.goCount.player > 0
      const nextPhase: GamePhase = (hasNewScore && (newScore.total >= 1 || wasGo)) ? 'goStop' : 'opponentTurn'

      return {
        ...prev,
        ...changes,
        field: finalField,
        playerCapture: finalCapture,
        selectedCard: null,
        pendingMatch: null,
        flippedCard: null,
        playerScore: newScore,
        phase: nextPhase,
        message: nextPhase === 'goStop' ? `${newScore.total}\uC810! \uACE0 \uB610\uB294 \uC2A4\uD1B1?` : '',
      }
    })
  }, [])

  const playerGo = useCallback(() => {
    soundEngine.playGo()
    setState(prev => ({
      ...prev,
      goCount: { ...prev.goCount, player: prev.goCount.player + 1 },
      phase: 'opponentTurn' as GamePhase,
      message: `\uACE0! (${prev.goCount.player + 1}\uACE0)`,
    }))
  }, [])

  const playerStop = useCallback(() => {
    soundEngine.playStop()
    setState(prev => {
      const multiplier = Math.pow(2, prev.goCount.player)
      const finalPoints = prev.playerScore.total * multiplier
      return {
        ...prev,
        phase: 'roundEnd' as GamePhase,
        totalScore: { ...prev.totalScore, player: prev.totalScore.player + finalPoints },
        message: `\uC2A4\uD1B1! ${finalPoints}\uC810 \uD68D\uB4DD!`,
      }
    })
  }, [])

  // ── Opponent Turn ──

  const runOpponentTurn = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'opponentTurn') return prev
      if (prev.opponentHand.length === 0 && prev.playerHand.length === 0) {
        return { ...prev, phase: 'roundEnd' as GamePhase, message: '\uCE74\uB4DC \uC18C\uC9C4! \uB77C\uC6B4\uB4DC \uC885\uB8CC' }
      }
      if (prev.opponentHand.length === 0) {
        return { ...prev, phase: 'playerPickCard' as GamePhase, currentTurn: 'player', message: '\uCE74\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694' }
      }

      soundEngine.playCardPlace()
      const card = aiPickCard(prev.opponentHand, prev.field)
      const matches = getFieldMatches(card, prev.field)
      const newHand = prev.opponentHand.filter(c => c.id !== card.id)

      let playedMatch: HwatuCard | null = null
      if (matches.length === 1) {
        playedMatch = matches[0]
      } else if (matches.length >= 2) {
        playedMatch = aiPickMatch(matches)
      }

      // Flip from deck
      let flipped: HwatuCard | null = null
      let restDeck = [...prev.deck]
      if (restDeck.length > 0) {
        flipped = restDeck[0]
        restDeck = restDeck.slice(1)
      }

      let flipMatch: HwatuCard | null = null
      if (flipped) {
        const tempField = playedMatch
          ? prev.field.filter(c => c.id !== playedMatch!.id)
          : [...prev.field, card]
        const fMatches = getFieldMatches(flipped, tempField)
        if (fMatches.length === 1) {
          flipMatch = fMatches[0]
        } else if (fMatches.length >= 2) {
          flipMatch = aiPickMatch(fMatches)
        }
      }

      const stateWithDeck = { ...prev, deck: restDeck, opponentHand: newHand }
      const changes = captureCards('opponent', stateWithDeck, card, playedMatch, flipped, flipMatch)

      let finalCapture = (changes as Record<string, unknown>).opponentCapture as CapturedCards
      let finalField = changes.field as HwatuCard[]
      // Handle bomb captures
      if (matches.length >= 3) {
        const extra = matches.slice(1)
        if (playedMatch) {
          const rest = extra.filter(e => e.id !== playedMatch!.id)
          finalCapture = addToCapture(finalCapture, rest)
          finalField = finalField.filter(c => !rest.some(e => e.id === c.id))
        }
      }

      const oppScore = calculateScore(finalCapture, ((changes as Record<string, unknown>).sweepCount as { player: number; opponent: number }).opponent)
      const hadScore = prev.opponentScore.total > 0
      const hasNewScore = oppScore.total > 0 && (!hadScore || oppScore.total > prev.opponentScore.total)
      const wasGo = prev.goCount.opponent > 0

      let nextPhase: GamePhase = 'playerPickCard'
      let msg = '\uCE74\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694'
      let newGoCount = prev.goCount
      let newTotalScore = prev.totalScore

      if (hasNewScore && (oppScore.total >= 1 || wasGo)) {
        const shouldGo = aiShouldGo(oppScore.total, prev.goCount.opponent)
        if (shouldGo) {
          newGoCount = { ...newGoCount, opponent: newGoCount.opponent + 1 }
          msg = `\uC0C1\uB300 \uACE0! (${newGoCount.opponent}\uACE0)`
          soundEngine.playGo()
        } else {
          const multiplier = Math.pow(2, prev.goCount.opponent)
          const finalPts = oppScore.total * multiplier
          newTotalScore = { ...newTotalScore, opponent: newTotalScore.opponent + finalPts }
          nextPhase = 'roundEnd'
          msg = `\uC0C1\uB300 \uC2A4\uD1B1! ${finalPts}\uC810`
          soundEngine.playLose()
        }
      }

      if (newHand.length === 0 && prev.playerHand.length === 0 && nextPhase !== 'roundEnd') {
        nextPhase = 'roundEnd'
        msg = '\uCE74\uB4DC \uC18C\uC9C4! \uB77C\uC6B4\uB4DC \uC885\uB8CC'
      }

      return {
        ...prev,
        ...changes,
        field: finalField,
        opponentCapture: finalCapture,
        opponentHand: sortHand(newHand),
        deck: restDeck,
        opponentScore: oppScore,
        goCount: newGoCount,
        totalScore: newTotalScore,
        selectedCard: null,
        pendingMatch: null,
        flippedCard: flipped,
        phase: nextPhase,
        currentTurn: 'player',
        message: msg,
      }
    })
  }, [])

  const triggerOpponent = useCallback(() => {
    timerRef.current = setTimeout(() => {
      runOpponentTurn()
    }, 1000)
  }, [runOpponentTurn])

  const newRound = useCallback(() => {
    startGame()
  }, [startGame])

  return {
    state,
    startGame,
    selectCard,
    selectMatch,
    flipDeck,
    selectFlipMatch,
    playerGo,
    playerStop,
    triggerOpponent,
    newRound,
  }
}
