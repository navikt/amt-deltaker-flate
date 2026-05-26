import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Pameldingstype } from 'deltaker-flate-common'
import { MemoryRouter } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste'
import { DeltakerlisteTabell } from './DeltakerlisteTabell'

import { lagTestDeltaker } from '../../test-utils/lagTestDeltaker'

const lagDeltaker = (id: string, fornavn: string, etternavn: string) =>
  lagTestDeltaker({ id, fornavn, etternavn })

const deltakerlisteDetaljer = {
  id: 'liste-id',
  pameldingstype: Pameldingstype.TRENGER_GODKJENNING,
  oppstartstype: 'LOPENDE',
  tiltakskode: 'GRUPPE_ARBEIDSMARKEDSOPPLAERING',
  erEnkeltplass: false
}

vi.mock('../../context-providers/DeltakerlisteContext', () => ({
  useDeltakerlisteContext: () => ({
    deltakerlisteDetaljer,
    statusCounts: {}
  })
}))

vi.mock('../../context-providers/FilterContext', () => ({
  useFilterContext: () => ({ valgteHendelseFilter: [] })
}))

vi.mock('../../context-providers/HandlingContext', async () => {
  const actual = await vi.importActual<
    typeof import('../../context-providers/HandlingContext')
  >('../../context-providers/HandlingContext')
  return {
    ...actual,
    useHandlingContext: () => ({
      handlingValg: null,
      valgteDeltakere: [],
      setValgteDeltakere: vi.fn(),
      setHandlingValg: vi.fn()
    })
  }
})

vi.mock('../../context-providers/SorteringContext', () => ({
  useSorteringContext: () => ({
    lagretSorteringsValg: undefined,
    setLagretSorteringsValg: vi.fn()
  })
}))

vi.mock('../handling/HandlingFullfortAlert', () => ({
  HandlingFullfortAlert: () => null
}))
vi.mock('../handling/HandlingFullfortMedFeilAlert', () => ({
  HandlingFullfortMedFeilAlert: () => null
}))
vi.mock('../handling/HandlingModalController', () => ({
  HandlingModalController: () => null
}))
vi.mock('../handling/HandlingerKnapp', () => ({
  HandlingerKnapp: () => null
}))

const renderTabell = (deltakere: Deltaker[]) =>
  render(
    <MemoryRouter>
      <DeltakerlisteTabell deltakere={deltakere} />
    </MemoryRouter>
  )

describe('DeltakerlisteTabell', () => {
  it('viser navn på deltakere fra prop', () => {
    renderTabell([
      lagDeltaker('1', 'Ola', 'Nordmann'),
      lagDeltaker('2', 'Kari', 'Hansen')
    ])

    expect(screen.getByText(/Nordmann.*Ola/)).toBeTruthy()
    expect(screen.getByText(/Hansen.*Kari/)).toBeTruthy()
  })

  it('viser tom-melding når listen er tom', () => {
    renderTabell([])

    expect(
      screen.getByText(/Det er foreløpig ingen innsøkte deltakere/)
    ).toBeTruthy()
  })

  it('viser sortérbare kolonneheadere', () => {
    renderTabell([lagDeltaker('1', 'Ola', 'Nordmann')])

    expect(screen.getByText('Navn')).toBeTruthy()
    expect(screen.getByText('Nav-enhet')).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: /Søkt inn/ })).toBeTruthy()
    expect(screen.getByText('Status')).toBeTruthy()
  })

  it('viser start- og sluttdato-kolonner når løpende oppstart', () => {
    renderTabell([lagDeltaker('1', 'Ola', 'Nordmann')])

    expect(screen.getByText('Start')).toBeTruthy()
    expect(screen.getByText('Slutt')).toBeTruthy()
  })

  it('rendrer riktig antall rader', () => {
    renderTabell([
      lagDeltaker('1', 'Ola', 'Nordmann'),
      lagDeltaker('2', 'Kari', 'Hansen'),
      lagDeltaker('3', 'Per', 'Olsen')
    ])

    expect(screen.getAllByRole('row')).toHaveLength(4) // 1 header + 3 data
  })

  it('viser ikke filterindikator i tom-melding når ingen deltakere finnes i andre filtre', () => {
    // statusCounts er {} (tom) i mock, så filterErAktiv = false
    renderTabell([])

    expect(screen.queryByText(/som samsvarer med dine filtervalg/)).toBeNull()
  })
})
