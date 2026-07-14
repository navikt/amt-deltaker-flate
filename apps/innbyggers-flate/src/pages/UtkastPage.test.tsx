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
  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithInnbyggerDeltakerContext(<UtkastPage />, lagInnbyggerDeltaker())
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithInnbyggerDeltakerContext(
      <UtkastPage />,
      lagInnbyggerDeltaker({}, { tiltakskode: Tiltakskode.OPPFOLGING })
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
