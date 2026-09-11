import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DeltakerStatusType,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { DeltakerPage } from './DeltakerPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()]
}))

describe('DeltakerPage - Deltakelsesmengde', () => {
  const baseStatus = {
    id: 's1',
    type: DeltakerStatusType.VENTER_PA_OPPSTART,
    aarsak: null,
    gyldigFra: new Date(),
    gyldigTil: null,
    opprettet: new Date()
  }
  const stottetTiltakDeltaker = lagInnbyggerDeltaker({
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

  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithInnbyggerDeltakerContext(<DeltakerPage />, stottetTiltakDeltaker)
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithInnbyggerDeltakerContext(
      <DeltakerPage />,
      ikkeStottetTiltakDeltaker
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})

describe('DeltakerPage - prisinformasjon til godkjenning', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('viser prisinformasjon til godkjenning når forslaget finnes', () => {
    const deltaker = lagInnbyggerDeltaker(
      {},
      {
        prisinformasjonTilGodkjenning: {
          type: PrisinformasjonType.Anskaffelse,
          pris: 5000
        }
      }
    )

    renderWithInnbyggerDeltakerContext(<DeltakerPage />, deltaker)

    expect(
      screen.getByRole('heading', { name: 'Endring sendt til godkjenning:' })
    ).toBeInTheDocument()
    expect(screen.getByText('Venter på godkjenning')).toBeInTheDocument()
  })

  it('skjuler prisinformasjon til godkjenning når forslaget mangler', () => {
    renderWithInnbyggerDeltakerContext(<DeltakerPage />, lagInnbyggerDeltaker())

    expect(
      screen.queryByRole('heading', { name: 'Endring sendt til godkjenning:' })
    ).not.toBeInTheDocument()
  })
})
