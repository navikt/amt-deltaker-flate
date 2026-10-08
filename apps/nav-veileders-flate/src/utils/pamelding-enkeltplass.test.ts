import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import {
  OpplaringRepresenterer,
  PrisinformasjonType,
  Tilskuddstype,
  Tiltakskode
} from 'deltaker-flate-common'
import {
  createPameldingEnkeltplassFormSchema,
  SLUTTDATO_FOR_TIDLIG_FEILMELDING,
  STARTDATO_FOR_TIDLIG_FEILMELDING,
  type PameldingEnkeltplassFormValues
} from '../model/PameldingEnkeltplassFormValues'
import {
  formToEnkeltplassKladdRequest,
  formToEnkeltplassRequest,
  getEnkeltplassTiltakHosArrangorTekst
} from './pamelding-enkeltplass'
import { DeltakerResponse } from '../api/data/deltaker'

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
  kategoriseringValg: [],
  sertifiseringValg: [],
  dagerPerUke: null,
  ...overrides
})

const lagPameldingForDatoValidering = (
  startdato: Date | null,
  sluttdato: Date | null = null
) =>
  ({
    startdato,
    sluttdato,
    maxVarighet: 365 * 24 * 60 * 60 * 1000,
    deltakerliste: {
      sluttdato: dayjs('2100-01-01').toDate()
    }
  }) as unknown as DeltakerResponse

const lagPameldingMedSluttdatoOverMaksVarighet = () => {
  const startdato = dayjs('2024-07-17')
  const sluttdato = dayjs('2025-06-01')
  const pamelding = lagPameldingForDatoValidering(
    startdato.toDate(),
    sluttdato.toDate()
  )
  pamelding.maxVarighet = 180 * 24 * 60 * 60 * 1000
  pamelding.deltakerliste.sluttdato = null

  return { pamelding, startdato, sluttdato }
}

describe('PameldingEnkeltplassFormSchema', () => {
  it('avviser ny startdato før datovelgerens nedre grense', () => {
    const startdato = dayjs().subtract(3, 'month')
    const schema = createPameldingEnkeltplassFormSchema(
      lagPameldingForDatoValidering(null)
    )

    const result = schema.safeParse(
      lagFormData({
        startdato: startdato.format('DD.MM.YYYY'),
        sluttdato: startdato.add(1, 'day').format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['startdato'],
          message: STARTDATO_FOR_TIDLIG_FEILMELDING
        })
      )
    }
  })

  it('godtar eksisterende startdato selv om den er før nedre grense', () => {
    const startdato = dayjs().subtract(3, 'month')
    const schema = createPameldingEnkeltplassFormSchema(
      lagPameldingForDatoValidering(startdato.toDate())
    )

    const result = schema.safeParse(
      lagFormData({
        startdato: startdato.format('DD.MM.YYYY'),
        sluttdato: startdato.add(1, 'day').format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(true)
  })

  it('rapporterer formatfeil for ugyldig startdato', () => {
    const schema = createPameldingEnkeltplassFormSchema(
      lagPameldingForDatoValidering(null)
    )
    const result = schema.safeParse(
      lagFormData({
        startdato: 'ugyldig',
        sluttdato: dayjs().add(1, 'day').format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['startdato'],
          message: 'Ugyldig datoformat: Bruk dd.mm.åååå'
        })
      )
    }
  })

  it('avviser ny sluttdato før nedre grense når startdato mangler', () => {
    const sluttdato = dayjs().subtract(3, 'month')
    const schema = createPameldingEnkeltplassFormSchema(
      lagPameldingForDatoValidering(null)
    )
    const result = schema.safeParse(
      lagFormData({
        startdato: '',
        sluttdato: sluttdato.format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['sluttdato'],
          message: SLUTTDATO_FOR_TIDLIG_FEILMELDING
        })
      )
    }
  })

  it('gir ikke nedre-grensefeil for eksisterende sluttdato når startdato mangler', () => {
    const sluttdato = dayjs().subtract(3, 'month')
    const schema = createPameldingEnkeltplassFormSchema(
      lagPameldingForDatoValidering(null, sluttdato.toDate())
    )
    const result = schema.safeParse(
      lagFormData({
        startdato: '',
        sluttdato: sluttdato.format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['startdato']
        })
      )
      expect(result.error.issues).not.toContainEqual(
        expect.objectContaining({
          path: ['sluttdato'],
          message: SLUTTDATO_FOR_TIDLIG_FEILMELDING
        })
      )
    }
  })

  it('godtar eksisterende sluttdato over maksvarighet', () => {
    const { pamelding, startdato, sluttdato } =
      lagPameldingMedSluttdatoOverMaksVarighet()
    const schema = createPameldingEnkeltplassFormSchema(pamelding)

    const result = schema.safeParse(
      lagFormData({
        startdato: startdato.format('DD.MM.YYYY'),
        sluttdato: sluttdato.format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(true)
  })

  it('avviser ny sluttdato etter eksisterende sluttdato over maksvarighet', () => {
    const { pamelding, startdato, sluttdato } =
      lagPameldingMedSluttdatoOverMaksVarighet()
    const schema = createPameldingEnkeltplassFormSchema(pamelding)
    const nySluttdato = sluttdato.add(1, 'day')

    const result = schema.safeParse(
      lagFormData({
        startdato: startdato.format('DD.MM.YYYY'),
        sluttdato: nySluttdato.format('DD.MM.YYYY')
      })
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['sluttdato'],
          message: expect.stringMatching(
            /^Seneste tillatte sluttdato er \d{2}\.\d{2}\.\d{4}\.$/
          )
        })
      )
    }
  })
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
      lagFormData({ kategoriseringValg: [], sertifiseringValg: [] })
    )

    expect(request.kodeverkValg).toEqual([])
    expect(request.sertifiseringValg).toEqual([])
  })

  it('flater ut valgte kodeverkverdier', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({
        kategoriseringValg: [
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

  it('sender med dagerPerUke', () => {
    const request = formToEnkeltplassRequest(
      lagFormData({
        dagerPerUke: 4
      })
    )

    expect(request.dagerPerUke).toBe(4)
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
            { type: Tilskuddstype.SKOLEPENGER, pris: 1000 },
            { type: Tilskuddstype.SEMESTERAVGIFT, pris: 2000 }
          ],
          tilleggsopplysninger: 'Test'
        }
      })
    )

    expect(request.prisinformasjon).toEqual({
      type: PrisinformasjonType.Tilskudd,
      tilskudd: [
        {
          type: Tilskuddstype.SKOLEPENGER,
          pris: 1000
        },
        {
          type: Tilskuddstype.SEMESTERAVGIFT,
          pris: 2000
        }
      ],
      tilleggsopplysninger: 'Test'
    })
  })

  it('sender med dagerPerUke i kladd-request', () => {
    const request = formToEnkeltplassKladdRequest(
      lagFormData({
        dagerPerUke: 3
      })
    )

    expect(request.dagerPerUke).toBe(3)
  })
})

describe('getEnkeltplassTiltakHosArrangorTekst', () => {
  const deltakerliste = {
    tiltakskode: {
      visningsnavn: 'Arbeidsmarkedsopplæring'
    },
    arrangor: null,
    visningsnavn: {
      tiltakHosArrangorTittel: 'Arbeidsmarkedsopplæring'
    }
  } as DeltakerResponse['deltakerliste']

  it('tar med navnet på en arrangør som nettopp er valgt i skjemaet', () => {
    const tekst = getEnkeltplassTiltakHosArrangorTekst(deltakerliste, {
      arrangorUnderenhet: '999999999',
      arrangorNavn: 'Ny Arrangør AS'
    })

    expect(tekst).toBe('Arbeidsmarkedsopplæring hos Ny Arrangør AS')
  })

  it('beholder visningsteksten fra backend for en lagret arrangør', () => {
    const tekst = getEnkeltplassTiltakHosArrangorTekst(
      {
        ...deltakerliste,
        arrangor: {
          organisasjonsnummer: '123456789',
          navn: 'Lagret Arrangør AS'
        },
        visningsnavn: {
          ...deltakerliste.visningsnavn,
          tiltakHosArrangorTittel:
            'Arbeidsmarkedsopplæring hos Lagret Arrangør AS'
        }
      },
      {
        arrangorUnderenhet: '123456789',
        arrangorNavn: 'Lagret Arrangør AS'
      }
    )

    expect(tekst).toBe('Arbeidsmarkedsopplæring hos Lagret Arrangør AS')
  })
})
