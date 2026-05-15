import { describe, expect, it } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { generateEnkeltplassPameldingRequest } from './pamelding-enkeltplass'
import { DeltakerResponse } from '../api/data/deltaker'
import { KodeverkAlternativType, Seleksjonstype } from '../api/data/kodeverk'

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
  it('returnerer undefined kodeverkValg og sertifiseringValg når deltaker mangler kodeverk', () => {
    const request = generateEnkeltplassPameldingRequest(lagDeltaker(null))
    expect(request.kodeverkValg).toBeUndefined()
    expect(request.sertifiseringValg).toBeUndefined()
  })

  it('returnerer tom liste når kodeverket ikke har valgte verdier', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: null,
            visningsnavn: 'Bransje',
            representerer: 'bransje',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              { id: 'b1', visningsnavn: 'Bygg', valgt: false },
              { id: 'b2', visningsnavn: 'Helse', valgt: false }
            ]
          }
        ],
        sertifiseringValg: []
      })
    )
    expect(request.kodeverkValg).toEqual([])
  })

  it('plukker ut alle valgte verdi-IDer rekursivt fra kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: 'FAG_OG_YRKESOPPLAERING',
        alternativer: [
          {
            type: KodeverkAlternativType.VERDIGRUPPE,
            id: null,
            visningsnavn: 'Bransje',
            representerer: 'bransje',
            seleksjonstype: Seleksjonstype.ENKELTVALG,
            alternativer: [
              { id: 'b1', visningsnavn: 'Bygg', valgt: true },
              { id: 'b2', visningsnavn: 'Helse', valgt: false }
            ]
          },
          {
            type: KodeverkAlternativType.GRUPPE,
            id: null,
            visningsnavn: 'Utdanning',
            alternativer: [
              {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                representerer: 'larefag',
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  { id: 'fag-1', visningsnavn: 'Tømrer', valgt: true },
                  { id: 'fag-2', visningsnavn: 'Rørlegger', valgt: true },
                  { id: 'fag-3', visningsnavn: 'Maler', valgt: false }
                ]
              }
            ]
          }
        ],
        sertifiseringValg: []
      })
    )

    expect(request.kodeverkValg).toEqual(['b1', 'fag-1', 'fag-2'])
  })

  it('plukker ut sertifiseringValg fra kodeverket', () => {
    const request = generateEnkeltplassPameldingRequest(
      lagDeltaker({
        tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
        alternativer: [],
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
