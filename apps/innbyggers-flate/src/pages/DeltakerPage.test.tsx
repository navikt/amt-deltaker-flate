import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { DeltakerContext } from '../DeltakerContext'
import { DeltakerPage } from './DeltakerPage'

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()]
}))

const lagDeltaker = (
  overrides: Partial<DeltakerResponse> = {}
): DeltakerResponse =>
  ({
    deltakerId: 'd1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    deltakerliste: {
      deltakerlisteId: 'l1',
      deltakerlisteNavn: 'Tiltak',
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      arrangorNavn: 'Arrangør',
      arrangor: { navn: 'Arrangør', organisasjonsnummer: '123456789' },
      erEnkeltplass: false,
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
      id: 's1',
      type: DeltakerStatusType.VENTER_PA_OPPSTART,
      aarsak: null,
      gyldigFra: new Date(),
      gyldigTil: null,
      opprettet: new Date()
    },
    startdato: '2026-01-01',
    sluttdato: '2026-06-01',
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    bakgrunnsinformasjon: null,
    vedtaksinformasjon: null,
    deltakelsesprosent: 80,
    dagerPerUke: 3,
    kanEndres: true,
    digitalBruker: true,
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

const renderPage = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider
      value={{
        deltaker,
        setDeltaker: vi.fn(),
        showSuccessMessage: false,
        setShowSuccessMessage: vi.fn()
      }}
    >
      <DeltakerPage />
    </DeltakerContext.Provider>
  )

describe('DeltakerPage - Deltakelsesmengde', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderPage(lagDeltaker())
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderPage(
      lagDeltaker({
        deltakerliste: {
          ...lagDeltaker().deltakerliste,
          tiltakskode: Tiltakskode.OPPFOLGING
        }
      })
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
