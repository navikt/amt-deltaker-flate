import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { UtkastDeltaker } from './UtkastDeltaker'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../test-utils/deltaker-context-test-utils'

describe('UtkastDeltaker - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagDeltaker({
    gyldigeDeltakelsesmengder: [
      {
        deltakelsesprosent: 80,
        dagerPerUke: 3,
        gyldigFra: new Date(2026, 0, 1)
      }
    ]
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
    renderWithDeltakerContext(<UtkastDeltaker />, stottetTiltakDeltaker)
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
    expect(screen.getByText(/3 dager i uka/)).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithDeltakerContext(<UtkastDeltaker />, ikkeStottetTiltakDeltaker)
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
