import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tiltakskode } from 'deltaker-flate-common'
import { UtkastDeltaker } from './UtkastDeltaker'
import {
  lagNavVeilederDeltaker,
  renderWithNavVeilederDeltakerContext
} from '../test-utils/deltaker-context-test-utils'

describe('UtkastDeltaker - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagNavVeilederDeltaker()
  const ikkeStottetTiltakDeltaker = {
    ...stottetTiltakDeltaker,
    deltakerliste: {
      ...stottetTiltakDeltaker.deltakerliste,
      tiltakskode: Tiltakskode.OPPFOLGING
    }
  }

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <UtkastDeltaker />,
      stottetTiltakDeltaker
    )
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <UtkastDeltaker />,
      ikkeStottetTiltakDeltaker
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
