import type { HwatuCard, CardType, RibbonType } from '../types/index.ts'
import { MONTH_NAMES, MONTH_SYMBOLS } from '../types/index.ts'

interface CardDef {
  readonly month: number
  readonly type: CardType
  readonly ribbonType?: RibbonType
  readonly name: string
  readonly symbol: string
  readonly junkValue: number
  readonly illustration: string
}

const CARD_DEFS: readonly CardDef[] = [
  // Month 1 - Pine (솔)
  { month: 1, type: 'bright', name: '\uD559', symbol: '\u2600\uFE0F', junkValue: 0, illustration: '\uD83E\uDDA2' },
  { month: 1, type: 'ribbon', ribbonType: 'hongdan', name: '\uD64D\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF32' },
  { month: 1, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF32' },
  { month: 1, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF32' },
  // Month 2 - Plum (매)
  { month: 2, type: 'animal', name: '\uAF51\uAF2C\uB9AC', symbol: '\uD83D\uDC26', junkValue: 0, illustration: '\uD83D\uDC26' },
  { month: 2, type: 'ribbon', ribbonType: 'hongdan', name: '\uD64D\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF38' },
  { month: 2, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF38' },
  { month: 2, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF38' },
  // Month 3 - Cherry (벚)
  { month: 3, type: 'bright', name: '\uCEE4\uD2BC', symbol: '\u2600\uFE0F', junkValue: 0, illustration: '\uD83C\uDFAA' },
  { month: 3, type: 'ribbon', ribbonType: 'hongdan', name: '\uD64D\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF38' },
  { month: 3, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF38' },
  { month: 3, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF38' },
  // Month 4 - Wisteria (등)
  { month: 4, type: 'animal', name: '\uB450\uACAC\uC0C8', symbol: '\uD83D\uDC26', junkValue: 0, illustration: '\uD83D\uDC26' },
  { month: 4, type: 'ribbon', ribbonType: 'chodan', name: '\uCD08\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83D\uDFE3' },
  { month: 4, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83D\uDFE3' },
  { month: 4, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83D\uDFE3' },
  // Month 5 - Orchid/Iris (난)
  { month: 5, type: 'animal', name: '\uB2E4\uB9AC', symbol: '\uD83C\uDF09', junkValue: 0, illustration: '\uD83C\uDF09' },
  { month: 5, type: 'ribbon', ribbonType: 'chodan', name: '\uCD08\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF3C' },
  { month: 5, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3C' },
  { month: 5, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3C' },
  // Month 6 - Peony (모란)
  { month: 6, type: 'animal', name: '\uB098\uBE44', symbol: '\uD83E\uDD8B', junkValue: 0, illustration: '\uD83E\uDD8B' },
  { month: 6, type: 'ribbon', ribbonType: 'cheongdan', name: '\uCCAD\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF3A' },
  { month: 6, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3A' },
  { month: 6, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3A' },
  // Month 7 - Bush Clover (싸리)
  { month: 7, type: 'animal', name: '\uBA67\uB3FC\uC9C0', symbol: '\uD83D\uDC17', junkValue: 0, illustration: '\uD83D\uDC17' },
  { month: 7, type: 'ribbon', ribbonType: 'chodan', name: '\uCD08\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF3F' },
  { month: 7, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3F' },
  { month: 7, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3F' },
  // Month 8 - Pampas Grass (공산)
  { month: 8, type: 'bright', name: '\uB2EC', symbol: '\u2600\uFE0F', junkValue: 0, illustration: '\uD83C\uDF15' },
  { month: 8, type: 'animal', name: '\uAE30\uB7EC\uAE30', symbol: '\uD83E\uDEB6', junkValue: 0, illustration: '\uD83E\uDEB6' },
  { month: 8, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3E' },
  { month: 8, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3E' },
  // Month 9 - Chrysanthemum (국)
  { month: 9, type: 'animal', name: '\uAD6D\uC9C4', symbol: '\uD83C\uDF76', junkValue: 0, illustration: '\uD83C\uDF76' },
  { month: 9, type: 'ribbon', ribbonType: 'cheongdan', name: '\uCCAD\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF3B' },
  { month: 9, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3B' },
  { month: 9, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF3B' },
  // Month 10 - Maple (단풍)
  { month: 10, type: 'animal', name: '\uC0AC\uC2B4', symbol: '\uD83E\uDD8C', junkValue: 0, illustration: '\uD83E\uDD8C' },
  { month: 10, type: 'ribbon', ribbonType: 'cheongdan', name: '\uCCAD\uB2E8', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF41' },
  { month: 10, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF41' },
  { month: 10, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF41' },
  // Month 11 - Paulownia (오동)
  { month: 11, type: 'bright', name: '\uBD09\uD669', symbol: '\u2600\uFE0F', junkValue: 0, illustration: '\uD83E\uDD85' },
  { month: 11, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF33' },
  { month: 11, type: 'junk', name: '\uD53C', symbol: '\uD83C\uDF43', junkValue: 1, illustration: '\uD83C\uDF33' },
  { month: 11, type: 'junk', name: '\uC30D\uD53C', symbol: '\uD83C\uDF43\uD83C\uDF43', junkValue: 2, illustration: '\uD83C\uDF33' },
  // Month 12 - Rain (비)
  { month: 12, type: 'bright', name: '\uBE44\uAD11', symbol: '\u2600\uFE0F', junkValue: 0, illustration: '\u2602\uFE0F' },
  { month: 12, type: 'animal', name: '\uC81C\uBE44', symbol: '\uD83D\uDC26', junkValue: 0, illustration: '\uD83D\uDC26' },
  { month: 12, type: 'ribbon', ribbonType: 'bi', name: '\uBE44\uB760', symbol: '\uD83C\uDF8B', junkValue: 0, illustration: '\uD83C\uDF27\uFE0F' },
  { month: 12, type: 'junk', name: '\uC30D\uD53C', symbol: '\uD83C\uDF43\uD83C\uDF43', junkValue: 2, illustration: '\uD83C\uDF27\uFE0F' },
]

export function createDeck(): HwatuCard[] {
  return CARD_DEFS.map((def, i) => ({
    id: i,
    month: def.month,
    type: def.type,
    ribbonType: def.ribbonType,
    name: def.name,
    symbol: def.symbol,
    junkValue: def.junkValue,
    monthName: MONTH_NAMES[def.month],
    monthSymbol: MONTH_SYMBOLS[def.month],
    illustration: def.illustration,
  }))
}

export function shuffleDeck(deck: readonly HwatuCard[]): HwatuCard[] {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function dealInitial(deck: HwatuCard[]): {
  playerHand: HwatuCard[]
  opponentHand: HwatuCard[]
  field: HwatuCard[]
  remaining: HwatuCard[]
} {
  const playerHand = deck.slice(0, 10)
  const opponentHand = deck.slice(10, 20)
  const field = deck.slice(20, 28)
  const remaining = deck.slice(28)
  return {
    playerHand: sortHand(playerHand),
    opponentHand: sortHand(opponentHand),
    field,
    remaining,
  }
}

export function sortHand(hand: readonly HwatuCard[]): HwatuCard[] {
  return [...hand].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month
    const typeOrder: Record<string, number> = { bright: 0, animal: 1, ribbon: 2, junk: 3 }
    return typeOrder[a.type] - typeOrder[b.type]
  })
}

export function getFieldMatches(card: HwatuCard, field: readonly HwatuCard[]): HwatuCard[] {
  return field.filter(f => f.month === card.month)
}
