import '@testing-library/jest-dom/vitest'
import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DeltakerStatusType,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { trackUnhandledRejections } from 'deltaker-flate-common/test-utils/unhandled-rejections'
import { useSearchParams } from 'react-router-dom'
import { getHistorikk } from '../api/api'
import { DeltakerPage } from './DeltakerPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

vi.mock('../api/api.ts', () => ({
  getHistorikk: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn()
}))

beforeEach(() => {
  window.scrollTo = vi.fn()
  vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()])
})

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

describe('DeltakerPage - historikk', () => {
  it('viser feilmelding uten uhåndtert avvisning når historikk ikke kan hentes', async () => {
    vi.mocked(getHistorikk).mockRejectedValue(new Error('Request failed'))
    const unhandledRejections = trackUnhandledRejections()

    try {
      renderWithInnbyggerDeltakerContext(
        <DeltakerPage />,
        lagInnbyggerDeltaker({
          status: {
            id: 's1',
            type: DeltakerStatusType.VENTER_PA_OPPSTART,
            aarsak: null,
            gyldigFra: new Date(),
            gyldigTil: null,
            opprettet: new Date()
          }
        })
      )

      fireEvent.click(screen.getByRole('button', { name: 'Se endringer' }))

      expect(
        await screen.findByText(
          'Beklager, vi kunne ikke hente historiske endringer på tiltaket.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections.rejections).toEqual([])
    } finally {
      unhandledRejections.stop()
    }
  })
})
