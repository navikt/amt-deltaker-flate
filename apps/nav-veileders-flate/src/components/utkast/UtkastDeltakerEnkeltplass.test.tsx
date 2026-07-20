import '@testing-library/jest-dom'
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
  } as unknown as DeltakerResponse
}

const renderWithDeltaker = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
      <UtkastDeltakerEnkeltplass />
    </DeltakerContext.Provider>
  )

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
  it('viser deltakelsesmengde når dagerPerUke er satt', () => {
    const deltaker = lagDeltaker()
    deltaker.dagerPerUke = 3

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText('3 dager i uka')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når dagerPerUke er null', () => {
    const deltaker = lagDeltaker()
    deltaker.dagerPerUke = null

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })

  it('viser 1 dag i uka når dagerPerUke er 1', () => {
    const deltaker = lagDeltaker()
    deltaker.dagerPerUke = 1

    renderWithDeltaker(deltaker)

    expect(screen.getByText('1 dag i uka')).toBeInTheDocument()
  })

  it('viser korrekt antall dager når dagerPerUke er 5', () => {
    const deltaker = lagDeltaker()
    deltaker.dagerPerUke = 5

    renderWithDeltaker(deltaker)

    expect(screen.getByText('5 dager i uka')).toBeInTheDocument()
  })

  it('viser deltakelsesmengde for arbeidsmarkedsopplæring', () => {
    const deltaker = lagDeltaker()
    deltaker.deltakerliste.tiltakskode.kode =
      Tiltakskode.ARBEIDSMARKEDSOPPLAERING
    deltaker.dagerPerUke = 4

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText('4 dager i uka')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når dagerPerUke er 0', () => {
    const deltaker = lagDeltaker()
    deltaker.dagerPerUke = 0

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
    expect(screen.queryByText(/dag(er)? i uka/)).not.toBeInTheDocument()
  })
})
