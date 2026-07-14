import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import {
  lagNavVeilederDeltaker,
  renderWithNavVeilederDeltakerContext
} from '../test-utils/deltaker-context-test-utils'
import { DeltakerInfo } from './DeltakerInfo'

describe('DeltakerInfo - Deltakelsesmengde', () => {
  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <DeltakerInfo className="" />,
      lagNavVeilederDeltaker({
        status: {
          id: 's1',
          type: DeltakerStatusType.DELTAR,
          aarsak: null,
          gyldigFra: new Date(),
          gyldigTil: null,
          opprettet: new Date()
        }
      })
    )
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithNavVeilederDeltakerContext(
      <DeltakerInfo className="" />,
      lagNavVeilederDeltaker(
        {
          status: {
            id: 's1',
            type: DeltakerStatusType.DELTAR,
            aarsak: null,
            gyldigFra: new Date(),
            gyldigTil: null,
            opprettet: new Date()
          }
        },
        { tiltakskode: Tiltakskode.OPPFOLGING }
      )
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
