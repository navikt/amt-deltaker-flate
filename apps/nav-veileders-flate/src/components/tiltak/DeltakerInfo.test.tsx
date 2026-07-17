import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../test-utils/deltaker-context-test-utils'
import { DeltakerInfo } from './DeltakerInfo'

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
      tiltakskodeResponse: {
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
