import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Pameldingstype } from 'deltaker-flate-common'
import { MemoryRouter } from 'react-router-dom'
import { Deltaker } from '../../api/data/deltakerliste'
import { DeltakerlisteTabell } from './DeltakerlisteTabell'

const lagDeltaker = (
  id: string,
  fornavn: string,
  etternavn: string
): Deltaker =>
  ({
    id,
    fornavn,
    mellomnavn: null,
    etternavn,
    status: { type: DeltakerStatusType.SOKT_INN, aarsak: null },
    vurdering: null,
    beskyttelsesmarkering: [],
    navEnhet: 'Nav Grünerløkka',
    erManueltDeltMedArrangor: false,
    ikkeDigitalOgManglerAdresse: false,
    harAktiveForslag: false,
    erNyDeltaker: false,
    harOppdateringFraNav: false,
    kanEndres: true,
    soktInnDato: null,
    startdato: null,
    sluttdato: null
  }) as unknown as Deltaker

const deltakerlisteDetaljer = {
  id: 'liste-id',
  pameldingstype: Pameldingstype.TRENGER_GODKJENNING,
  oppstartstype: 'LOPENDE',
  tiltakskode: 'GRUPPE_ARBEIDSMARKEDSOPPLAERING',
  erEnkeltplass: false
}

const mockDeltakereResponse = vi.hoisted(() => ({
  current: [] as Deltaker[] | string | undefined
}))

vi.mock('../../hooks/useDeltakereQuery', () => ({
  useDeltakereQuery: () => ({ data: mockDeltakereResponse.current })
}))

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

const renderTabell = () =>
  render(
    <MemoryRouter>
      <DeltakerlisteTabell />
    </MemoryRouter>
  )

describe('DeltakerlisteTabell', () => {
  it('viser navn på deltakere fra useDeltakereQuery', () => {
    mockDeltakereResponse.current = [
      lagDeltaker('1', 'Ola', 'Nordmann'),
      lagDeltaker('2', 'Kari', 'Hansen')
    ]

    renderTabell()

    expect(screen.getByText(/Nordmann.*Ola/)).toBeTruthy()
    expect(screen.getByText(/Hansen.*Kari/)).toBeTruthy()
  })

  it('viser tom-melding når listen er tom', () => {
    mockDeltakereResponse.current = []

    renderTabell()

    expect(
      screen.getByText(/Det er foreløpig ingen innsøkte deltakere/)
    ).toBeTruthy()
  })

  it('viser tom-melding når data er tilgangsfeil-streng (behandles som tom)', () => {
    mockDeltakereResponse.current = 'IkkeTilgangTilDeltakerliste'

    renderTabell()

    expect(
      screen.getByText(/Det er foreløpig ingen innsøkte deltakere/)
    ).toBeTruthy()
  })
})
