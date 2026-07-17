import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { AvbruttUtkastPage } from './AvbruttUtkastPage'
import {
  lagInnbyggerDeltaker,
  renderWithInnbyggerDeltakerContext
} from './test-utils'

describe('AvbruttUtkastPage - Deltakelsesmengde', () => {
  const baseStatus = {
    id: 's1',
    type: DeltakerStatusType.AVBRUTT_UTKAST,
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
    renderWithInnbyggerDeltakerContext(
      <AvbruttUtkastPage />,
      stottetTiltakDeltaker
    )
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithInnbyggerDeltakerContext(
      <AvbruttUtkastPage />,
      ikkeStottetTiltakDeltaker
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
