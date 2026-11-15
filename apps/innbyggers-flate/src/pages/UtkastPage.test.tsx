import '@testing-library/jest-dom/vitest'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { trackUnhandledRejections } from 'deltaker-flate-common/test-utils/unhandled-rejections'
import { godkjennUtkast } from '../api/api'
import { UtkastPage } from './UtkastPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

vi.mock('../api/api', () => ({
  godkjennUtkast: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ deltakerId: 'deltaker-1' })
}))

describe('UtkastPage - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagInnbyggerDeltaker()
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
    renderWithInnbyggerDeltakerContext(<UtkastPage />, stottetTiltakDeltaker)
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithInnbyggerDeltakerContext(
      <UtkastPage />,
      ikkeStottetTiltakDeltaker
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })

  it('viser feilmelding uten uhåndtert avvisning når godkjenning feiler', async () => {
    vi.mocked(godkjennUtkast).mockRejectedValue(new Error('Request failed'))
    const unhandledRejections = trackUnhandledRejections()

    try {
      renderWithInnbyggerDeltakerContext(<UtkastPage />, lagInnbyggerDeltaker())

      fireEvent.click(screen.getByLabelText('Ja, det ser greit ut.'))
      fireEvent.click(screen.getByTestId('godkjenn_utkast'))

      expect(
        await screen.findByText(
          'Det skjedde en feil ved godkjenning av utkastet. Prøv igjen senere.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections.rejections).toEqual([])
    } finally {
      unhandledRejections.stop()
    }
  })
})
