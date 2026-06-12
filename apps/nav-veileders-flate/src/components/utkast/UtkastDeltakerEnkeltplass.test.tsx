import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  DeltakerStatusType,
  OpplaringRepresenterer,
  Tiltakskode
} from 'deltaker-flate-common'
import { UtkastDeltakerEnkeltplass } from './UtkastDeltakerEnkeltplass'
import { DeltakerResponse } from '../../api/data/deltaker'
import { DeltakerContext } from '../tiltak/DeltakerContext'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const createKodeverk = (visningsnavn?: string | null) => ({
  valgteKategoriseringer: visningsnavn
    ? [
        {
          representerer: OpplaringRepresenterer.KURSTYPE_ID,
          valg: [{ id: 'kurs-1', visningsnavn }]
        }
      ]
    : [],
  valgteSertifiseringer: []
})

const lagDeltaker = (
  kodeverk: DeltakerResponse['deltakerliste']['kodeverk'] = null
): DeltakerResponse =>
  ({
    deltakerId: '1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'Norskopplæring, grunnleggende ferdigheter og FOV',
      tiltakskode: Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
      arrangorNavn: 'Språkskolen AS',
      arrangor: { navn: 'Språkskolen AS', organisasjonsnummer: '999888777' },
      erEnkeltplass: true,
      oppstartstype: null,
      startdato: null,
      sluttdato: null,
      status: null,
      tilgjengeligInnhold: { ledetekst: null, innhold: [] },
      oppmoteSted: null,
      pameldingstype: 'TRENGER_GODKJENNING',
      kodeverk
    },
    status: {
      id: '1',
      type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
      aarsak: null,
      gyldigFra: new Date(),
      gyldigTil: null,
      opprettet: new Date()
    },
    startdato: '2025-04-10',
    sluttdato: '2025-10-09',
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    prisinformasjon: '',
    vedtaksinformasjon: null,
    kanEndres: true,
    digitalBruker: true,
    maxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    softMaxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    forslag: [],
    importertFraArena: null,
    harAdresse: false,
    adresseDelesMedArrangor: false,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    }
  }) as unknown as DeltakerResponse

const renderWithDeltaker = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
      <UtkastDeltakerEnkeltplass />
    </DeltakerContext.Provider>
  )

describe('UtkastDeltakerEnkeltplass - VeilederSnakkeboble', () => {
  it('bruker kurstype fra kodeverk i snakkeboblen når tilgjengelig', () => {
    const deltaker = lagDeltaker(createKodeverk('Norskopplæring B1'))

    renderWithDeltaker(deltaker)

    expect(
      screen.getByText(
        /utkast til søknad til Norskopplæring B1 hos Språkskolen AS/
      )
    ).toBeInTheDocument()
  })

  it('faller tilbake til deltakerlisteNavn når kodeverk er null', () => {
    const deltaker = lagDeltaker(null)

    renderWithDeltaker(deltaker)

    expect(
      screen.getByText(
        /utkast til søknad til Norskopplæring, grunnleggende ferdigheter og FOV hos Språkskolen AS/
      )
    ).toBeInTheDocument()
  })

  it('faller tilbake til deltakerlisteNavn når kodeverk.tittel er null', () => {
    const deltaker = lagDeltaker(createKodeverk(null))

    renderWithDeltaker(deltaker)

    expect(
      screen.getByText(
        /utkast til søknad til Norskopplæring, grunnleggende ferdigheter og FOV hos Språkskolen AS/
      )
    ).toBeInTheDocument()
  })
})
