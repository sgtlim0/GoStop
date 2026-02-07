import type { HwatuCard } from '../types/index.ts'
import { getFieldMatches } from './cards.ts'

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

export function aiPickCard(hand: readonly HwatuCard[], field: readonly HwatuCard[]): HwatuCard {
  let bestCard = hand[0]
  let bestValue = -1

  for (const card of hand) {
    const matches = getFieldMatches(card, field)
    if (matches.length > 0) {
      const value = cardPriority(card) + matchValue(matches)
      if (value > bestValue) {
        bestValue = value
        bestCard = card
      }
    }
  }

  if (bestValue < 0) {
    let lowestPriority = Infinity
    for (const card of hand) {
      const p = cardPriority(card)
      if (p < lowestPriority) {
        lowestPriority = p
        bestCard = card
      }
    }
  }

  return bestCard
}

export function aiPickMatch(candidates: readonly HwatuCard[]): HwatuCard {
  let best = candidates[0]
  let bestP = -1
  for (const c of candidates) {
    const p = cardPriority(c)
    if (p > bestP) {
      bestP = p
      best = c
    }
  }
  return best
}

export function aiShouldGo(score: number, goCount: number): boolean {
  if (goCount >= 3) return false
  if (score <= 2) return true
  if (score <= 4 && goCount < 2) return true
  return false
}
