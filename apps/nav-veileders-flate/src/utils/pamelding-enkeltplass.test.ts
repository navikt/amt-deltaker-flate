import { describe, expect, it } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { generateEnkeltplassPameldingRequest } from './pamelding-enkeltplass'
import { DeltakerResponse } from '../api/data/deltaker'

dayjs.extend(duration)

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
  it('mapper startdato og sluttdato fra API-datoer til DTO-format', () => {
    const request = generateEnkeltplassPameldingRequest({
      ...lagDeltaker(),
      startdato: new Date('2026-01-15T00:00:00.000Z'),
      sluttdato: new Date('2026-03-01T00:00:00.000Z')
    })

    expect(request.startdato).toBe('2026-01-15')
    expect(request.sluttdato).toBe('2026-03-01')
  })

  it('returnerer undefined kodeverkValg og sertifiseringValg når deltaker mangler kodeverk', () => {
    const request = generateEnkeltplassPameldingRequest(lagDeltaker(null))
    expect(request.kodeverkValg).toBeUndefined()
    expect(request.sertifiseringValg).toBeUndefined()
  })

  it('returnerer tomme lister når det flate kodeverket ikke har valgte verdier', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        tittel: 'Bransje',
        valg: [],
        valgteKodeverkIder: [],
        valgteSertifiseringer: []
      })
    )
    expect(request.kodeverkValg).toEqual([])
    expect(request.sertifiseringValg).toEqual([])
  })

  it('returnerer valgteKodeverkIder fra det flate kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        tittel: 'Bransje, Lærefag',
        valg: ['Bygg', 'Tømrer', 'Rørlegger'],
        valgteKodeverkIder: [
          '11111111-1111-1111-1111-111111111111',
          '22222222-2222-2222-2222-222222222222',
          '33333333-3333-3333-3333-333333333333'
        ],
        valgteSertifiseringer: []
      })
    )

    expect(request.kodeverkValg).toEqual([
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333'
    ])
  })

  it('returnerer valgteSertifiseringer fra det flate kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        tittel: null,
        valg: [],
        valgteKodeverkIder: [],
        valgteSertifiseringer: [
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
