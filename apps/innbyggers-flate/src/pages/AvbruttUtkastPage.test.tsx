import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { DeltakerResponse } from '../api/data/deltaker'
import { DeltakerContext } from '../DeltakerContext'
import { AvbruttUtkastPage } from './AvbruttUtkastPage'

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
      opplaringKategoriseringValg: null
    },
    status: {
      id: 's1',
      type: DeltakerStatusType.AVBRUTT_UTKAST,
      aarsak: null,
      gyldigFra: new Date(),
      gyldigTil: null,
      opprettet: new Date()
    },
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    vedtaksinformasjon: null,
    deltakelsesprosent: 80,
    dagerPerUke: 3,
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
      <AvbruttUtkastPage />
    </DeltakerContext.Provider>
  )

describe('AvbruttUtkastPage - Deltakelsesmengde', () => {
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
