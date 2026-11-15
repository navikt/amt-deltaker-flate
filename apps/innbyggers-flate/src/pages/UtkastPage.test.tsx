import '@testing-library/jest-dom/vitest'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { godkjennUtkast } from '../api/api'
import { UtkastPage } from './UtkastPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

// Testene kjører i Node, men appens TypeScript-oppsett eksponerer ikke Node-typene.
// Dette begrensede grensesnittet dekker bare eventene testen trenger.
interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

// Node-prosessens unhandledRejection-hendelse fanger avvisninger JSDOM ikke alltid sender til window.
const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

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
    const unhandledRejections: unknown[] = []
    const handleUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    nodeProcess.on('unhandledRejection', handleUnhandledRejection)

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

      expect(unhandledRejections).toEqual([])
    } finally {
      nodeProcess.off('unhandledRejection', handleUnhandledRejection)
    }
  })
})
