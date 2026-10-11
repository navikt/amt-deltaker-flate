import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { UtkastDeltakerEnkeltplass } from './UtkastDeltakerEnkeltplass'
import { DeltakerResponse } from '../../api/data/deltaker'
import { DeltakerContext } from '../tiltak/DeltakerContext'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const lagVisningsnavn = (
  ingressTekst: string
): DeltakerResponse['deltakerliste']['visningsnavn'] => ({
  tiltakHosArrangorIngressTekst: ingressTekst,
  tiltakHosArrangorTittel:
    'Norskopplæring, grunnleggende ferdigheter og FOV hos Språkskolen AS',
  kladdTiltakHosArrangorTittel: 'FOV kurs liste hos Språkskolen AS'
})

const lagDeltaker = (
  kodeverk: DeltakerResponse['deltakerliste']['opplaringKategoriseringValg'] = null,
  visningsnavn?: DeltakerResponse['deltakerliste']['visningsnavn']
): DeltakerResponse => {
  return {
    deltakerId: '1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'FOV kurs liste',
      tiltakskode: {
        kode: Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
        visningsnavn: 'Norskopplæring, grunnleggende ferdigheter og FOV'
      },
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
      opplaringKategoriseringValg: kodeverk,
      visningsnavn: visningsnavn || {
        tiltakHosArrangorIngressTekst: 'FOV kurs liste hos Språkskolen AS',
        tiltakHosArrangorTittel:
          'Norskopplæring, grunnleggende ferdigheter og FOV hos Språkskolen AS',
        kladdTiltakHosArrangorTittel: 'FOV kurs liste hos Språkskolen AS'
      }
    } as DeltakerResponse['deltakerliste'],
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
    deltakelsesprosent: null,
    dagerPerUke: null,
    vedtaksinformasjon: null,
    kanEndres: true,
    digitalBruker: true,
    maxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    softMaxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    forslag: [],
    importertFraArena: null,
    harAdresse: false,
    adresseDelesMedArrangor: false,
    gyldigeDeltakelsesmengder: []
  } as unknown as DeltakerResponse
}

const renderWithDeltaker = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
      <UtkastDeltakerEnkeltplass />
    </DeltakerContext.Provider>
  )

const settDagerPerUke = (deltaker: DeltakerResponse, dagerPerUke: number) => {
  deltaker.startdato = new Date(2026, 0, 1)
  deltaker.deltakelsesprosent = null
  deltaker.dagerPerUke = dagerPerUke
}

describe('UtkastDeltakerEnkeltplass - VeilederSnakkeboble', () => {
  it('renders ingress text from backend visningsnavn', () => {
    const deltaker = lagDeltaker(
      null,
      lagVisningsnavn('Norskopplæring B1 hos Språkskolen AS')
    )

    renderWithDeltaker(deltaker)

    expect(
      screen.getByText(
        /utkast til søknad til Norskopplæring B1 hos Språkskolen AS/
      )
    ).toBeInTheDocument()
  })

  it('renders ingress text when backend returns course list name', () => {
    const deltaker = lagDeltaker(
      null,
      lagVisningsnavn('FOV kurs liste hos Språkskolen AS')
    )

    renderWithDeltaker(deltaker)

    expect(
      screen.getByText(
        /utkast til søknad til FOV kurs liste hos Språkskolen AS/
      )
    ).toBeInTheDocument()
  })
})

describe('UtkastDeltakerEnkeltplass - Deltakelsesmengde', () => {
  it('viser deltakelsesmengde fra utkastfeltene uten dato', () => {
    const deltaker = lagDeltaker()
    settDagerPerUke(deltaker, 3)

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText(/3 dager i uka/)).toBeInTheDocument()
    expect(screen.queryByText(/01\.01\.2026:/)).not.toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når utkastet mangler mengdeinformasjon', () => {
    const deltaker = lagDeltaker()

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })

  it('viser 1 dag i uka fra utkastfeltene', () => {
    const deltaker = lagDeltaker()
    settDagerPerUke(deltaker, 1)

    renderWithDeltaker(deltaker)

    expect(screen.getByText(/1 dag i uka/)).toBeInTheDocument()
  })

  it('viser korrekt antall dager fra utkastfeltene', () => {
    const deltaker = lagDeltaker()
    settDagerPerUke(deltaker, 5)

    renderWithDeltaker(deltaker)

    expect(screen.getByText(/5 dager i uka/)).toBeInTheDocument()
  })

  it('viser deltakelsesmengde for arbeidsmarkedsopplæring', () => {
    const deltaker = lagDeltaker()
    deltaker.deltakerliste.tiltakskode.kode =
      Tiltakskode.ARBEIDSMARKEDSOPPLAERING
    settDagerPerUke(deltaker, 4)

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText(/4 dager i uka/)).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når mengden ikke har dager', () => {
    const deltaker = lagDeltaker()
    settDagerPerUke(deltaker, 0)

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
    expect(screen.queryByText(/dag(er)? i uka/)).not.toBeInTheDocument()
  })
})
