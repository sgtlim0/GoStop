import type { HwatuCard, AIDifficulty, CapturedCards } from '../types/index.ts'
import { getFieldMatches } from './cards.ts'
import { calculateScore, addToCapture } from './scoring.ts'

function cardPriority(card: HwatuCard): number {
  switch (card.type) {
    case 'bright': return 10
    case 'animal': return 5
    case 'ribbon': return 3
    case 'junk': return 1
  }
}

function matchValue(matches: readonly HwatuCard[]): number {
  return matches.reduce((sum, c) => sum + cardPriority(c), 0)
}

// ── EASY: random play with occasional mistakes ──

function aiPickCardEasy(hand: readonly HwatuCard[], field: readonly HwatuCard[]): HwatuCard {
  // 40% chance of playing completely random
  if (Math.random() < 0.4) {
    return hand[Math.floor(Math.random() * hand.length)]
  }
  // 30% chance of playing lowest priority card even if matches exist
  if (Math.random() < 0.3) {
    let worst = hand[0]
    let worstP = Infinity
    for (const card of hand) {
      const p = cardPriority(card)
      if (p < worstP) { worstP = p; worst = card }
    }
    return worst
  }
  // Otherwise pick a card that has a match, but prefer low-value matches
  let bestCard = hand[0]
  let bestValue = -1
  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    if (matches.length > 0) {
      const value = cardPriority(card)
      if (value > bestValue) { bestValue = value; bestCard = card }
    }
  }
  return bestCard
}

// ── NORMAL: current logic (greedy matching) ──

function aiPickCardNormal(hand: readonly HwatuCard[], field: readonly HwatuCard[]): HwatuCard {
  let bestCard = hand[0]
  let bestValue = -1
  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    if (matches.length > 0) {
      const value = cardPriority(card) + matchValue(matches)
      if (value > bestValue) { bestValue = value; bestCard = card }
    }
  }
  if (bestValue < 0) {
    let lowestPriority = Infinity
    for (const card of hand) {
      const p = cardPriority(card)
      if (p < lowestPriority) { lowestPriority = p; bestCard = card }
    }
  }
  return bestCard
}

// ── HARD: considers opponent's potential captures ──

function aiPickCardHard(
  hand: readonly HwatuCard[],
  field: readonly HwatuCard[],
  playerCapture: CapturedCards,
): HwatuCard {
  let bestCard = hand[0]
  let bestScore = -Infinity

  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    let score = 0

    if (matches.length > 0) {
      // Value of capturing
      score += cardPriority(card) + matchValue(matches)

      // Bonus for denying opponent key cards
      for (const m of matches) {
        if (m.type === 'bright') score += 8
        // Check if opponent is close to godori
        const godoriMonths = [2, 4, 8]
        if (m.type === 'animal' && godoriMonths.includes(m.month)) {
          const playerGodoriCount = playerCapture.animal.filter(
            c => godoriMonths.includes(c.month)
          ).length
          if (playerGodoriCount >= 1) score += 6
        }
        // Block ribbon combos
        if (m.type === 'ribbon' && m.ribbonType) {
          const sameType = playerCapture.ribbon.filter(c => c.ribbonType === m.ribbonType)
          if (sameType.length >= 2) score += 5
        }
      }
    } else {
      // No match: penalize placing valuable cards on field
      score -= cardPriority(card) * 2
      // Extra penalty for bright cards left on field
      if (card.type === 'bright') score -= 10
    }

    if (score > bestScore) { bestScore = score; bestCard = card }
  }
  return bestCard
}

// ── INSANE: multi-step lookahead ──

function aiPickCardInsane(
  hand: readonly HwatuCard[],
  field: readonly HwatuCard[],
  playerCapture: CapturedCards,
  opponentCapture: CapturedCards,
): HwatuCard {
  let bestCard = hand[0]
  let bestScore = -Infinity

  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    let score = 0

    if (matches.length > 0) {
      score += cardPriority(card) * 1.5 + matchValue(matches)

      // Simulate capture and evaluate score gain
      const captureList = [card, ...(matches.length === 1 ? matches : [matches[0]])]
      const simCapture = addToCapture(opponentCapture, captureList)
      const simScore = calculateScore(simCapture, 0)
      const curScore = calculateScore(opponentCapture, 0)
      score += (simScore.total - curScore.total) * 3

      // Deny opponent scoring
      for (const m of matches) {
        if (m.type === 'bright') score += 10
        const godoriMonths = [2, 4, 8]
        if (m.type === 'animal' && godoriMonths.includes(m.month)) {
          const pCount = playerCapture.animal.filter(c => godoriMonths.includes(c.month)).length
          if (pCount >= 1) score += 8
        }
        if (m.type === 'ribbon' && m.ribbonType) {
          const sameType = playerCapture.ribbon.filter(c => c.ribbonType === m.ribbonType)
          if (sameType.length >= 2) score += 7
        }
      }

      // Consider remaining hand synergy
      const remainingHand = hand.filter(h => h.id !== card.id)
      const newField = field.filter(f => !matches.some(m => m.id === f.id))
      for (const rem of remainingHand) {
        const futureMatches = getFieldMatches(rem, newField)
        if (futureMatches.length > 0) score += cardPriority(rem) * 0.3
      }
    } else {
      score -= cardPriority(card) * 2.5
      if (card.type === 'bright') score -= 15

      // If placing on field, check if opponent can grab it next turn
      const fieldWithCard = [...field, card]
      for (const _fc of fieldWithCard) {
        // Penalize creating month clusters opponent can exploit
      }
      const sameMonthOnField = field.filter(f => f.month === card.month).length
      if (sameMonthOnField === 2) score -= 5 // Creating a triple for opponent
    }

    if (score > bestScore) { bestScore = score; bestCard = card }
  }
  return bestCard
}

// ── IMPOSSIBLE: probability-weighted decision with deck tracking ──

function aiPickCardImpossible(
  hand: readonly HwatuCard[],
  field: readonly HwatuCard[],
  playerCapture: CapturedCards,
  opponentCapture: CapturedCards,
  deck: readonly HwatuCard[],
): HwatuCard {
  let bestCard = hand[0]
  let bestScore = -Infinity

  // Track what's visible and what might be in deck
  const deckMonthCounts = new Map<number, number>()
  for (const d of deck) {
    deckMonthCounts.set(d.month, (deckMonthCounts.get(d.month) ?? 0) + 1)
  }

  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    let score = 0

    if (matches.length > 0) {
      score += cardPriority(card) * 2 + matchValue(matches) * 1.5

      // Simulate capture
      const captureList = matches.length >= 3
        ? [card, ...matches]
        : [card, ...(matches.length === 1 ? matches : [matches[0]])]
      const simCapture = addToCapture(opponentCapture, captureList)
      const simScore = calculateScore(simCapture, 0)
      const curScore = calculateScore(opponentCapture, 0)
      score += (simScore.total - curScore.total) * 4

      // Flip probability: chance that deck flip also matches this month
      const deckCount = deckMonthCounts.get(card.month) ?? 0
      if (deckCount > 0 && deck.length > 0) {
        const flipProb = deckCount / deck.length
        score += flipProb * matchValue(matches) * 2
      }

      // Deny opponent
      for (const m of matches) {
        if (m.type === 'bright') score += 15
        const godoriMonths = [2, 4, 8]
        if (m.type === 'animal' && godoriMonths.includes(m.month)) {
          const pCount = playerCapture.animal.filter(c => godoriMonths.includes(c.month)).length
          if (pCount >= 1) score += 12
          if (pCount >= 2) score += 20
        }
        if (m.type === 'ribbon' && m.ribbonType) {
          const sameType = playerCapture.ribbon.filter(c => c.ribbonType === m.ribbonType)
          if (sameType.length >= 2) score += 10
        }
      }

      // Future hand synergy
      const remainingHand = hand.filter(h => h.id !== card.id)
      const newField = field.filter(f => !matches.some(m => m.id === f.id))
      for (const rem of remainingHand) {
        const futureMatches = getFieldMatches(rem, newField)
        if (futureMatches.length > 0) {
          score += cardPriority(rem) * 0.5 + matchValue(futureMatches) * 0.3
        }
      }

      // Sweep detection
      const fieldAfterCapture = field.filter(f => !matches.some(m => m.id === f.id))
      if (fieldAfterCapture.length === 0) score += 8
    } else {
      score -= cardPriority(card) * 3
      if (card.type === 'bright') score -= 20

      // Risk: opponent capturing this from field
      const sameMonthOnField = field.filter(f => f.month === card.month).length
      if (sameMonthOnField === 2) score -= 8

      // Risk: deck flipping same month giving free capture
      const deckSame = deckMonthCounts.get(card.month) ?? 0
      if (deck.length > 0) {
        const flipRisk = deckSame / deck.length
        score -= flipRisk * cardPriority(card) * 3
      }
    }

    if (score > bestScore) { bestScore = score; bestCard = card }
  }
  return bestCard
}

// ── Unified API ──

export function aiPickCard(
  hand: readonly HwatuCard[],
  field: readonly HwatuCard[],
  difficulty: AIDifficulty = 'normal',
  playerCapture?: CapturedCards,
  opponentCapture?: CapturedCards,
  deck?: readonly HwatuCard[],
): HwatuCard {
  switch (difficulty) {
    case 'easy':
      return aiPickCardEasy(hand, field)
    case 'normal':
      return aiPickCardNormal(hand, field)
    case 'hard':
      return aiPickCardHard(hand, field, playerCapture ?? { bright: [], animal: [], ribbon: [], junk: [] })
    case 'insane':
      return aiPickCardInsane(
        hand, field,
        playerCapture ?? { bright: [], animal: [], ribbon: [], junk: [] },
        opponentCapture ?? { bright: [], animal: [], ribbon: [], junk: [] },
      )
    case 'impossible':
      return aiPickCardImpossible(
        hand, field,
        playerCapture ?? { bright: [], animal: [], ribbon: [], junk: [] },
        opponentCapture ?? { bright: [], animal: [], ribbon: [], junk: [] },
        deck ?? [],
      )
  }
}

export function aiPickMatch(candidates: readonly HwatuCard[], difficulty: AIDifficulty = 'normal'): HwatuCard {
  // Easy: random pick
  if (difficulty === 'easy' && Math.random() < 0.5) {
    return candidates[Math.floor(Math.random() * candidates.length)]
  }
  // All others: pick highest priority
  let best = candidates[0]
  let bestP = -1
  for (const c of candidates) {
    const p = cardPriority(c)
    if (p > bestP) { bestP = p; best = c }
  }
  return best
}

export function aiShouldGo(
  score: number,
  goCount: number,
  difficulty: AIDifficulty = 'normal',
  opponentHandSize?: number,
): boolean {
  switch (difficulty) {
    case 'easy':
      // Easy never goes, always stops
      return false

    case 'normal':
      if (goCount >= 3) return false
      if (score <= 2) return true
      if (score <= 4 && goCount < 2) return true
      return false

    case 'hard':
      if (goCount >= 4) return false
      if (score <= 3) return true
      if (score <= 5 && goCount < 2) return true
      if (score <= 7 && goCount === 0) return true
      return false

    case 'insane':
      if (goCount >= 5) return false
      if (score <= 4) return true
      if (score <= 7 && goCount < 3) return true
      if (score <= 10 && goCount === 0) return true
      return false

    case 'impossible': {
      if (goCount >= 5) return false
      const cardsLeft = opponentHandSize ?? 5
      // Aggressive go when many cards remain
      if (cardsLeft >= 4) {
        if (score <= 6) return true
        if (score <= 10 && goCount < 3) return true
        if (score <= 15 && goCount === 0) return true
      } else {
        // Conservative when few cards left
        if (score <= 3) return true
        if (score <= 5 && goCount < 2) return true
      }
      return false
    }
  }
}
