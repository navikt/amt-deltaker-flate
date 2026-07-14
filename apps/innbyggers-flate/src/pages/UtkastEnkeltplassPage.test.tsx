import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { UtkastEnkeltplassPage } from './UtkastEnkeltplassPage'
import { DeltakerContext } from '../DeltakerContext'
import { DeltakerResponse } from '../api/data/deltaker'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

vi.mock('react-router-dom', () => ({
  useParams: () => ({ deltakerId: 'deltaker-123' })
}))

const lagDeltaker = (
  overrides: Partial<DeltakerResponse> = {}
): DeltakerResponse =>
  ({
    deltakerId: '1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'Arbeidsmarkedsopplæring',
      tiltakskode: {
        kode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
        visningsnavn: 'Arbeidsmarkedsopplæring'
      },
      arrangorNavn: 'Test AS',
      arrangor: { navn: 'Test AS', organisasjonsnummer: '999888777' },
      erEnkeltplass: true,
      oppstartstype: null,
      startdato: null,
      sluttdato: null,
      status: null,
      tilgjengeligInnhold: { ledetekst: null, innhold: [] },
      oppmoteSted: null,
      pameldingstype: 'TRENGER_GODKJENNING',
      opplaringKategoriseringValg: null,
      prisinformasjon: null
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
    vedtaksinformasjon: null,
    deltakelsesprosent: null,
    dagerPerUke: null,
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
    },
    erUnderOppfolging: true,
    erManueltDeltMedArrangor: false,
    ...overrides
  }) as unknown as DeltakerResponse

const renderWithDeltaker = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider
      value={{
        deltaker,
        setDeltaker: vi.fn(),
        showSuccessMessage: false,
        setShowSuccessMessage: vi.fn()
      }}
    >
      <UtkastEnkeltplassPage />
    </DeltakerContext.Provider>
  )

describe('UtkastEnkeltplassPage - Deltakelsesmengde', () => {
  it('viser deltakelsesmengde når arbeidsmarkedsopplæring og dagerPerUke er satt', () => {
    const deltaker = lagDeltaker({
      dagerPerUke: 3
    })

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText('3 dager i uka')).toBeInTheDocument()
  })

  it('viser deltakelsesmengde når enkeltplass og dagerPerUke er satt for andre tiltakskoder', () => {
    const deltaker = lagDeltaker({
      deltakerliste: {
        ...lagDeltaker().deltakerliste,
        tiltakskodeDto: {
          kode: Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET,
          visningsnavn: 'Varig tilrettelagt arbeid'
        }
      },
      dagerPerUke: 4
    })

    renderWithDeltaker(deltaker)

    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText('4 dager i uka')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når dagerPerUke er null', () => {
    const deltaker = lagDeltaker({
      dagerPerUke: null
    })

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })

  it('viser 1 dag i uka når dagerPerUke er 1', () => {
    const deltaker = lagDeltaker({
      dagerPerUke: 1
    })

    renderWithDeltaker(deltaker)

    expect(screen.getByText('1 dag i uka')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når dagerPerUke er 0', () => {
    const deltaker = lagDeltaker({
      dagerPerUke: 0
    })

    renderWithDeltaker(deltaker)

    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
    expect(screen.queryByText(/dag(er)? i uka/)).not.toBeInTheDocument()
  })
})
