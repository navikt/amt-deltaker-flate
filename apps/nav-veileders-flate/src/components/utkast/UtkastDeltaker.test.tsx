import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { UtkastDeltaker } from './UtkastDeltaker'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../test-utils/deltaker-context-test-utils'

describe('UtkastDeltaker - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagDeltaker()
  const ikkeStottetTiltakDeltaker = {
    ...stottetTiltakDeltaker,
    deltakerliste: {
      ...stottetTiltakDeltaker.deltakerliste,
      tiltakskode: Tiltakskode.OPPFOLGING
    }
  }

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithDeltakerContext(<UtkastDeltaker />, stottetTiltakDeltaker)
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithDeltakerContext(<UtkastDeltaker />, ikkeStottetTiltakDeltaker)
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
