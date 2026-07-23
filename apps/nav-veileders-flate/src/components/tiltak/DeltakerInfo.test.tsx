import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  DeltakerStatusType,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../test-utils/deltaker-context-test-utils'
import { DeltakerInfo } from './DeltakerInfo'
import { AppContext } from '../../AppContext.tsx'
import { DeltakerContext } from './DeltakerContext.tsx'
import { DeltakerResponse } from '../../api/data/deltaker.ts'

describe('DeltakerInfo - Deltakelsesmengde', () => {
  const baseStatus = {
    id: 's1',
    type: DeltakerStatusType.DELTAR,
    aarsak: null,
    gyldigFra: new Date(),
    gyldigTil: null,
    opprettet: new Date()
  }
  const stottetTiltakDeltaker = lagDeltaker({
    status: baseStatus
  })
  const ikkeStottetTiltakDeltaker = {
    ...stottetTiltakDeltaker,
    deltakerliste: {
      ...stottetTiltakDeltaker.deltakerliste,
      tiltakskode: {
        kode: Tiltakskode.OPPFOLGING,
        visningsnavn: 'Oppfølging'
      }
    }
  }

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithDeltakerContext(
      <DeltakerInfo className="" />,
      stottetTiltakDeltaker
    )
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithDeltakerContext(
      <DeltakerInfo className="" />,
      ikkeStottetTiltakDeltaker
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})

describe('DeltakerInfo - PrisinformasjonTilGodkjenning', () => {
  const appContextValue = {
    personident: 'p1',
    enhetId: 'e1',
    setPersonident: vi.fn(),
    setEnhetId: vi.fn()
  }

  const renderMedPrisinformasjon = (deltaker: DeltakerResponse) =>
    render(
      <AppContext.Provider value={appContextValue}>
        <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
          <DeltakerInfo className="" />
        </DeltakerContext.Provider>
      </AppContext.Provider>
    )

  it('viser seksjon for prisinformasjon til godkjenning med handlingsknapper', () => {
    const deltaker = lagDeltaker(
      {},
      {
        prisinformasjonTilGodkjenning: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 5000
        }
      }
    )

    renderMedPrisinformasjon(deltaker)

    expect(
      screen.getByText('Forslag sendt til godkjenning:')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tilbakekall forslag' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Endre forslag' })
    ).toBeInTheDocument()
  })

  it('skjuler seksjon for prisinformasjon til godkjenning når feltet ikke er satt', () => {
    const deltaker = lagDeltaker()

    renderMedPrisinformasjon(deltaker)

    expect(
      screen.queryByText('Forslag sendt til godkjenning:')
    ).not.toBeInTheDocument()
  })
})
