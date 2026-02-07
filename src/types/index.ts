export type CardType = 'bright' | 'animal' | 'ribbon' | 'junk'
export type RibbonType = 'hongdan' | 'chodan' | 'cheongdan' | 'bi'
export type AIDifficulty = 'easy' | 'normal' | 'hard' | 'insane' | 'impossible'

export const DIFFICULTY_LABELS: Record<AIDifficulty, string> = {
  easy: '\uCD08\uBCF4',
  normal: '\uBCF4\uD1B5',
  hard: '\uC5B4\uB824\uC6C0',
  insane: '\uACE0\uC218',
  impossible: '\uC2E0',
}

export interface HwatuCard {
  readonly id: number
  readonly month: number
  readonly type: CardType
  readonly ribbonType?: RibbonType
  readonly name: string
  readonly symbol: string
  readonly junkValue: number
  readonly monthName: string
  readonly monthSymbol: string
  readonly illustration: string
}

export interface CapturedCards {
  readonly bright: readonly HwatuCard[]
  readonly animal: readonly HwatuCard[]
  readonly ribbon: readonly HwatuCard[]
  readonly junk: readonly HwatuCard[]
}

export interface ScoreDetail {
  readonly label: string
  readonly points: number
}

export interface ScoreResult {
  readonly total: number
  readonly details: readonly ScoreDetail[]
  readonly brightCount: number
  readonly animalCount: number
  readonly ribbonCount: number
  readonly junkCount: number
}

export type GamePhase =
  | 'idle'
  | 'dealing'
  | 'playerPickCard'
  | 'playerPickMatch'
  | 'playerFlip'
  | 'playerFlipMatch'
  | 'goStop'
  | 'opponentTurn'
  | 'roundEnd'
  | 'gameOver'

export interface PendingMatch {
  readonly playedCard: HwatuCard
  readonly matchCandidates: readonly HwatuCard[]
}

export interface GameState {
  readonly phase: GamePhase
  readonly deck: readonly HwatuCard[]
  readonly field: readonly HwatuCard[]
  readonly playerHand: readonly HwatuCard[]
  readonly opponentHand: readonly HwatuCard[]
  readonly playerCapture: CapturedCards
  readonly opponentCapture: CapturedCards
  readonly currentTurn: 'player' | 'opponent'
  readonly selectedCard: HwatuCard | null
  readonly pendingMatch: PendingMatch | null
  readonly flippedCard: HwatuCard | null
  readonly playerScore: ScoreResult
  readonly opponentScore: ScoreResult
  readonly goCount: { readonly player: number; readonly opponent: number }
  readonly sweepCount: { readonly player: number; readonly opponent: number }
  readonly message: string
  readonly round: number
  readonly totalScore: { readonly player: number; readonly opponent: number }
  readonly lastCaptured: readonly HwatuCard[]
}

export function emptyCaptured(): CapturedCards {
  return { bright: [], animal: [], ribbon: [], junk: [] }
}

export function emptyScore(): ScoreResult {
  return { total: 0, details: [], brightCount: 0, animalCount: 0, ribbonCount: 0, junkCount: 0 }
}

export const MONTH_NAMES: readonly string[] = [
  '', '1\uC6D4 \uC1A8', '2\uC6D4 \uB9E4', '3\uC6D4 \uBC9A', '4\uC6D4 \uB4F1',
  '5\uC6D4 \uB09C', '6\uC6D4 \uBAA8\uB780', '7\uC6D4 \uC2F8\uB9AC', '8\uC6D4 \uACF5\uC0B0',
  '9\uC6D4 \uAD6D', '10\uC6D4 \uB2E8\uD48D', '11\uC6D4 \uC624\uB3D9', '12\uC6D4 \uBE44',
]

export const MONTH_SYMBOLS: readonly string[] = [
  '', '\uD83C\uDF32', '\uD83C\uDF38', '\uD83C\uDF38', '\uD83D\uDFE3',
  '\uD83D\uDFE6', '\uD83C\uDF3A', '\uD83C\uDF3F', '\uD83C\uDF19',
  '\uD83C\uDF3C', '\uD83C\uDF41', '\uD83C\uDF33', '\uD83C\uDF27\uFE0F',
]

export const MONTH_COLORS: readonly string[] = [
  '',
  '#1a5c2a', '#c24685', '#e8a0bf', '#6b52a3',
  '#3a4db8', '#c23b22', '#d4760a', '#1b3a5c',
  '#b8960b', '#cc4400', '#4a2c7a', '#3d5a6e',
]
