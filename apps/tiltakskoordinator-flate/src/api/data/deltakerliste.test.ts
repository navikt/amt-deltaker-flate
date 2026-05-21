import { DeltakerStatusType } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { tiltaksKoordinatorDeltakerlisteRequestSchema } from './deltakerliste'

describe('tiltaksKoordinatorDeltakerlisteRequestSchema', () => {
  it('godtar tomt objekt (alle felter er valgfrie)', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('godtar request med alle felter', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      harForslagFraArrangor: true,
      statuser: [DeltakerStatusType.DELTAR, DeltakerStatusType.SOKT_INN]
    })
    expect(result.success).toBe(true)
  })

  it('godtar request med tomme statuser', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      harForslagFraArrangor: false,
      statuser: []
    })
    expect(result.success).toBe(true)
  })

  it('avviser request med ugyldig status', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      statuser: ['UGYLDIG_STATUS']
    })
    expect(result.success).toBe(false)
  })

  it('avviser request med ugyldig type for harForslagFraArrangor', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      harForslagFraArrangor: 'ja'
    })
    expect(result.success).toBe(false)
  })
})
