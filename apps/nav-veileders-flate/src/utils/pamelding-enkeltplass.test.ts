import { describe, expect, it } from 'vitest'
import {
  OpplaringRepresenterer,
  PrisinformasjonType,
  Tiltakskode,
  Tilskuddstype
} from 'deltaker-flate-common'
import { PameldingEnkeltplassFormValues } from '../model/PameldingEnkeltplassFormValues'
import {
  formToEnkeltplassKladdRequest,
  formToEnkeltplassRequest
} from './pamelding-enkeltplass'

const lagFormData = (
  overrides: Partial<PameldingEnkeltplassFormValues> = {}
): PameldingEnkeltplassFormValues => ({
  tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
  innhold: 'Testinnhold',
  arrangorUnderenhet: '123',
  startdato: '06.05.2026',
  sluttdato: '12.05.2026',
  pristype: PrisinformasjonType.Anskaffelse,
  prisinformasjon: {
    type: PrisinformasjonType.Anskaffelse,
    pris: 1000
  },
  kodeverkValg: [],
  sertifiseringValg: [],
  ...overrides
})

describe('formToEnkeltplassRequest', () => {
  it('konverterer gyldige datoer til ISO-format i request', () => {
    const request = formToEnkeltplassRequest(lagFormData())

    expect(request.startdato).toBe('2026-05-06')
    expect(request.sluttdato).toBe('2026-05-12')
  })

  it('setter tom streng for ugyldige datoer i stedet for "Invalid Date"', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({
        startdato: 'ugyldig-dato',
        sluttdato: 'fortsatt-ugyldig-dato'
      })
    )

    expect(request.startdato).toBe('')
    expect(request.sluttdato).toBe('')
    expect(request.startdato).not.toBe('Invalid Date')
    expect(request.sluttdato).not.toBe('Invalid Date')
  })

  it('returnerer tomme lister når kodeverk og sertifiseringer ikke har valgte verdier', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({ kodeverkValg: [], sertifiseringValg: [] })
    )

    expect(request.kodeverkValg).toEqual([])
    expect(request.sertifiseringValg).toEqual([])
  })

  it('flater ut valgte kodeverkverdier', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({
        kodeverkValg: [
          {
            representerer: OpplaringRepresenterer.BRANSJE_ID,
            valgteIder: ['11111111-1111-1111-1111-111111111111']
          },
          {
            representerer: OpplaringRepresenterer.LAREFAG,
            valgteIder: [
              '22222222-2222-2222-2222-222222222222',
              '33333333-3333-3333-3333-333333333333'
            ]
          }
        ]
      })
    )

    expect(request.kodeverkValg).toEqual([
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333'
    ])
  })

  it('sender med valgte sertifiseringer', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({
        sertifiseringValg: [
          { id: 90999, navn: 'Datakortet del 1' },
          { id: 2, navn: 'Sertifisert zumba-instruktør' }
        ]
      })
    )

    expect(request.sertifiseringValg).toEqual([
      { id: 90999, navn: 'Datakortet del 1' },
      { id: 2, navn: 'Sertifisert zumba-instruktør' }
    ])
  })
})

describe('formToEnkeltplassKladdRequest', () => {
  it('konverterer tilskudd-array til record-format for kladd', () => {
    const request = formToEnkeltplassKladdRequest(
      lagFormData({
        pristype: PrisinformasjonType.Tilskudd,
        prisinformasjon: {
          type: PrisinformasjonType.Tilskudd,
          tilskudd: [
            { tilskudd: Tilskuddstype.SKOLEPENGER, belop: 1000 },
            { tilskudd: Tilskuddstype.SEMESTERAVGIFT, belop: 2000 }
          ],
          tilleggsopplysninger: 'Test'
        }
      })
    )

    expect(request.prisinformasjon).toEqual({
      type: PrisinformasjonType.Tilskudd,
      tilskudd: {
        SKOLEPENGER: 1000,
        SEMESTERAVGIFT: 2000
      },
      tilleggsopplysninger: 'Test'
    })
  })
})
