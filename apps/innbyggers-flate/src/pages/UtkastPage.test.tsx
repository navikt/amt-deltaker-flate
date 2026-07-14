import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { UtkastPage } from './UtkastPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

vi.mock('react-router-dom', () => ({
  useParams: () => ({ deltakerId: 'deltaker-1' })
}))

describe('UtkastPage - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagInnbyggerDeltaker()
  const ikkeStottetTiltakDeltaker = {
    ...stottetTiltakDeltaker,
    deltakerliste: {
      ...stottetTiltakDeltaker.deltakerliste,
      tiltakskode: Tiltakskode.OPPFOLGING
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
})
