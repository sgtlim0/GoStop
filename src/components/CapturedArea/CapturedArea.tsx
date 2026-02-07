import type { CapturedCards } from '../../types/index.ts'
import HwatuCard from '../HwatuCard/HwatuCard.tsx'
import styles from './CapturedArea.module.css'

interface Props {
  readonly captured: CapturedCards
  readonly label: string
}

export default function CapturedArea({ captured, label }: Props) {
  const { bright, animal, ribbon, junk } = captured
  const hasCards = bright.length + animal.length + ribbon.length + junk.length > 0

  if (!hasCards) return null

  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.groups}>
        {bright.length > 0 && (
          <div className={styles.group}>
            <span className={styles.groupLabel}>{'\uAD11'} {bright.length}</span>
            <div className={styles.cards}>
              {bright.map(c => <HwatuCard key={c.id} card={c} small />)}
            </div>
          </div>
        )}
        {animal.length > 0 && (
          <div className={styles.group}>
            <span className={styles.groupLabel}>{'\uC5F4'} {animal.length}</span>
            <div className={styles.cards}>
              {animal.map(c => <HwatuCard key={c.id} card={c} small />)}
            </div>
          </div>
        )}
        {ribbon.length > 0 && (
          <div className={styles.group}>
            <span className={styles.groupLabel}>{'\uB760'} {ribbon.length}</span>
            <div className={styles.cards}>
              {ribbon.map(c => <HwatuCard key={c.id} card={c} small />)}
            </div>
          </div>
        )}
        {junk.length > 0 && (
          <div className={styles.group}>
            <span className={styles.groupLabel}>{'\uD53C'} {junk.reduce((s, c) => s + (c.junkValue || 1), 0)}</span>
            <div className={styles.cards}>
              {junk.map(c => <HwatuCard key={c.id} card={c} small />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
