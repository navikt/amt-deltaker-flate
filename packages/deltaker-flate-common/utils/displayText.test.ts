import { describe, it, expect } from 'vitest'
import { DeltakerlisteStatus } from '../model/deltaker'
import { getDeltakerlisteStatusText } from './displayText'

describe('getDeltakerlisteStatusText', () => {
  it('returnerer "Planlagt" for PLANLAGT', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.PLANLAGT)).toBe(
      'Planlagt'
    )
  })

  it('returnerer "Gjennomføres" for GJENNOMFORES', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.GJENNOMFORES)).toBe(
      'Gjennomføres'
    )
  })

  it('returnerer "Avsluttet" for AVSLUTTET', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.AVSLUTTET)).toBe(
      'Avsluttet'
    )
  })

  it('returnerer "Avlyst" for AVLYST', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.AVLYST)).toBe(
      'Avlyst'
    )
  })

  it('returnerer "Avbrutt" for AVBRUTT', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.AVBRUTT)).toBe(
      'Avbrutt'
    )
  })

  it('returnerer "Kladd" for KLADD', () => {
    expect(getDeltakerlisteStatusText(DeltakerlisteStatus.KLADD)).toBe('Kladd')
  })

  it('dekker alle verdier i DeltakerlisteStatus-enum', () => {
    ;(Object.values(DeltakerlisteStatus) as DeltakerlisteStatus[]).forEach(
      (status) => {
        expect(getDeltakerlisteStatusText(status)).toBeDefined()
      }
    )
  })
})
