import { describe, expect, it } from 'vitest'
import { OpplaringRepresenterer, Tiltakskode } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { generateEnkeltplassPameldingRequest } from './pamelding-enkeltplass'
import { DeltakerResponse } from '../api/data/deltaker'

dayjs.extend(duration)

const createKodeverk = (
  valgteKategoriseringer: NonNullable<
    DeltakerResponse['deltakerliste']['kodeverk']
  >['valgteKategoriseringer'] = [],
  valgteSertifiseringer: NonNullable<
    DeltakerResponse['deltakerliste']['kodeverk']
  >['valgteSertifiseringer'] = []
) => ({
  valgteKategoriseringer,
  valgteSertifiseringer
})

const lagDeltaker = (
  kodeverk: DeltakerResponse['deltakerliste']['kodeverk'] = null
): DeltakerResponse =>
  ({
    deltakerId: '1',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'Test',
      tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
      arrangor: { navn: 'Test', organisasjonsnummer: '123' },
      erEnkeltplass: true,
      kodeverk
    },
    startdato: null,
    sluttdato: null,
    deltakelsesinnhold: { innhold: [] },
    prisinformasjon: ''
  }) as unknown as DeltakerResponse

describe('generateEnkeltplassPameldingRequest', () => {
  it('beholder gyldige ISO-datoer fra backend i request', () => {
    const request = generateEnkeltplassPameldingRequest({
      ...lagDeltaker(),
      startdato: new Date(2026, 4, 6),
      sluttdato: new Date(2026, 4, 12)
    })

    expect(request.startdato).toBe('2026-05-06')
    expect(request.sluttdato).toBe('2026-05-12')
  })

  it('setter tom streng for ugyldige datoer i stedet for "Invalid Date"', () => {
    const request = generateEnkeltplassPameldingRequest({
      ...lagDeltaker(),
      startdato: new Date('ugyldig-dato'),
      sluttdato: new Date('fortsatt-ugyldig-dato')
    })

    expect(request.startdato).toBe('')
    expect(request.sluttdato).toBe('')
    expect(request.startdato).not.toBe('Invalid Date')
    expect(request.sluttdato).not.toBe('Invalid Date')
  })

  it('returnerer undefined kodeverkValg og sertifiseringValg når deltaker mangler kodeverk', () => {
    const request = generateEnkeltplassPameldingRequest(lagDeltaker(null))
    expect(request.kodeverkValg).toBeUndefined()
    expect(request.sertifiseringValg).toBeUndefined()
  })

  it('returnerer tomme lister når det flate kodeverket ikke har valgte verdier', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker(createKodeverk())
    )
    expect(request.kodeverkValg).toEqual([])
    expect(request.sertifiseringValg).toEqual([])
  })

  it('returnerer valgte kodeverk per representerer fra det flate kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker(
        createKodeverk(
          [
            {
              representerer: OpplaringRepresenterer.BRANSJE_ID,
              valg: [
                {
                  id: '11111111-1111-1111-1111-111111111111',
                  visningsnavn: 'Bygg'
                }
              ]
            },
            {
              representerer: OpplaringRepresenterer.LAREFAG,
              valg: [
                {
                  id: '22222222-2222-2222-2222-222222222222',
                  visningsnavn: 'Tømrer'
                },
                {
                  id: '33333333-3333-3333-3333-333333333333',
                  visningsnavn: 'Rørlegger'
                }
              ]
            }
          ],
          []
        )
      )
    )

    expect(request.kodeverkValg).toEqual([
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333'
    ])
  })

  it('returnerer valgteSertifiseringer fra det flate kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker(
        createKodeverk(
          [],
          [
            { id: 90999, navn: 'Datakortet del 1' },
            { id: 2, navn: 'Sertifisert zumba-instruktør' }
          ]
        )
      )
    )

    expect(request.sertifiseringValg).toEqual([
      { id: 90999, navn: 'Datakortet del 1' },
      { id: 2, navn: 'Sertifisert zumba-instruktør' }
    ])
  })
})
