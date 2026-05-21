import { DeltakerStatusType } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { tiltaksKoordinatorDeltakerlisteRequestSchema } from './deltakerliste'

const gyldigId = uuidv4()

describe('tiltaksKoordinatorDeltakerlisteRequestSchema', () => {
  it('godtar gyldig request med bare gjennomforingId', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: gyldigId
    })
    expect(result.success).toBe(true)
  })

  it('godtar request med alle felter', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: gyldigId,
      harForslagFraArrangor: true,
      statuser: [DeltakerStatusType.DELTAR, DeltakerStatusType.SOKT_INN]
    })
    expect(result.success).toBe(true)
  })

  it('godtar request uten valgfrie felter', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: gyldigId,
      harForslagFraArrangor: false,
      statuser: []
    })
    expect(result.success).toBe(true)
  })

  it('avviser request uten gjennomforingId', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      harForslagFraArrangor: true
    })
    expect(result.success).toBe(false)
  })

  it('avviser request med ugyldig UUID som gjennomforingId', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: 'ikke-en-uuid'
    })
    expect(result.success).toBe(false)
  })

  it('avviser request med ugyldig status', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: gyldigId,
      statuser: ['UGYLDIG_STATUS']
    })
    expect(result.success).toBe(false)
  })

  it('avviser request med ugyldig type for harForslagFraArrangor', () => {
    const result = tiltaksKoordinatorDeltakerlisteRequestSchema.safeParse({
      gjennomforingId: gyldigId,
      harForslagFraArrangor: 'ja'
    })
    expect(result.success).toBe(false)
  })
})
