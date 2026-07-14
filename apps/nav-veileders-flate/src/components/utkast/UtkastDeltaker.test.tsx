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
  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <UtkastDeltaker />,
      lagNavVeilederDeltaker()
    )
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <UtkastDeltaker />,
      lagNavVeilederDeltaker({}, { tiltakskode: Tiltakskode.OPPFOLGING })
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
