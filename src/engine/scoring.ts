import type { CapturedCards, ScoreResult, ScoreDetail, HwatuCard } from '../types/index.ts'

function countJunk(cards: readonly HwatuCard[]): number {
  return cards.reduce((sum, c) => sum + (c.junkValue || 1), 0)
}

export function calculateScore(captured: CapturedCards, sweepCount: number): ScoreResult {
  const details: ScoreDetail[] = []
  const brightCount = captured.bright.length
  const animalCount = captured.animal.length
  const ribbonCount = captured.ribbon.length
  const junkTotal = countJunk(captured.junk)

  // Bright scoring
  if (brightCount === 5) {
    details.push({ label: '5\uAD11', points: 15 })
  } else if (brightCount === 4) {
    details.push({ label: '4\uAD11', points: 4 })
  } else if (brightCount === 3) {
    const hasRainBright = captured.bright.some(c => c.month === 12)
    if (hasRainBright) {
      details.push({ label: '\uBE443\uAD11', points: 2 })
    } else {
      details.push({ label: '3\uAD11', points: 3 })
    }
  }

  // Godori (2-animal + 4-cuckoo + 8-geese)
  const godoriMonths = [2, 4, 8]
  const hasGodori = godoriMonths.every(m => captured.animal.some(c => c.month === m))
  if (hasGodori) {
    details.push({ label: '\uACE0\uB3C4\uB9AC', points: 5 })
  }

  // Ribbon combos
  const hongdan = captured.ribbon.filter(c => c.ribbonType === 'hongdan')
  const chodan = captured.ribbon.filter(c => c.ribbonType === 'chodan')
  const cheongdan = captured.ribbon.filter(c => c.ribbonType === 'cheongdan')

  if (hongdan.length >= 3) {
    details.push({ label: '\uD64D\uB2E8', points: 3 })
  }
  if (chodan.length >= 3) {
    details.push({ label: '\uCD08\uB2E8', points: 3 })
  }
  if (cheongdan.length >= 3) {
    details.push({ label: '\uCCAD\uB2E8', points: 3 })
  }

  // Ribbon count (5+)
  if (ribbonCount >= 5) {
    details.push({ label: `\uB760 ${ribbonCount}\uC7A5`, points: 1 + (ribbonCount - 5) })
  }

  // Animal count (5+)
  if (animalCount >= 5) {
    details.push({ label: `\uC5F4\uB057 ${animalCount}\uC7A5`, points: 1 + (animalCount - 5) })
  }

  // Junk count (10+)
  if (junkTotal >= 10) {
    details.push({ label: `\uD53C ${junkTotal}\uC7A5`, points: 1 + (junkTotal - 10) })
  }

  // Sweep bonus
  if (sweepCount > 0) {
    details.push({ label: `\uC4F8 ${sweepCount}\uD68C`, points: sweepCount })
  }

  const total = details.reduce((sum, d) => sum + d.points, 0)

  return {
    total,
    details,
    brightCount,
    animalCount,
    ribbonCount,
    junkCount: junkTotal,
  }
}

export function addToCapture(captured: CapturedCards, cards: readonly HwatuCard[]): CapturedCards {
  const bright = [...captured.bright]
  const animal = [...captured.animal]
  const ribbon = [...captured.ribbon]
  const junk = [...captured.junk]

  for (const card of cards) {
    switch (card.type) {
      case 'bright': bright.push(card); break
      case 'animal': animal.push(card); break
      case 'ribbon': ribbon.push(card); break
      case 'junk': junk.push(card); break
    }
  }

  return { bright, animal, ribbon, junk }
}
