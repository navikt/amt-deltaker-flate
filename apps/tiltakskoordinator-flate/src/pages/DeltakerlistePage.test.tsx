import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { TilgangsFeil } from '../api/api'
import { DeltakerlistePage } from './DeltakerlistePage'
import { HandlingFilterValg } from '../utils/filter-deltakerliste'

let valgteHendelseFilter: HandlingFilterValg[] = []
let valgteStatusFilter: DeltakerStatusType[] = []

const setLagretSorteringsValg = vi.fn()

const mockQueryState = vi.hoisted(() => ({
  data: undefined as unknown,
  isPending: false,
  isFetching: false,
  isPlaceholderData: false,
  error: null as unknown
}))

const { handterTilgangsFeilMock, useQueryMock, getDeltakereMock } = vi.hoisted(
  () => ({
    handterTilgangsFeilMock: vi.fn(),
    useQueryMock: vi.fn(),
    getDeltakereMock: vi.fn()
  })
)

vi.mock('@tanstack/react-query', () => ({
  keepPreviousData: Symbol('keepPreviousData'),
  useQuery: (options: unknown) => {
    useQueryMock(options)
    return {
      data: mockQueryState.data,
      isPending: mockQueryState.isPending,
      isFetching: mockQueryState.isFetching,
      isPlaceholderData: mockQueryState.isPlaceholderData,
      error: mockQueryState.error
    }
  }
}))

vi.mock('../api/api', async () => {
  const actual =
    await vi.importActual<typeof import('../api/api')>('../api/api')
  return {
    ...actual,
    getDeltakere: getDeltakereMock
  }
})

vi.mock('../utils/tilgangsFeil', () => ({
  isTilgangsFeil: (obj: unknown) =>
    obj === 'ManglerADGruppe' ||
    obj === 'IkkeTilgangTilDeltakerliste' ||
    obj === 'DeltakerlisteStengt',
  handterTilgangsFeil: handterTilgangsFeilMock
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

vi.mock('../context-providers/AppContext', () => ({
  useAppContext: () => ({ deltakerlisteId: 'liste-id' })
}))

vi.mock('../context-providers/FilterContext', () => ({
  useFilterContext: () => ({
    valgteHendelseFilter,
    valgteStatusFilter
  })
}))

vi.mock('../context-providers/SorteringContext', () => ({
  useSorteringContext: () => ({ setLagretSorteringsValg })
}))

vi.mock('../context-providers/DeltakerlisteContext', () => ({
  useDeltakerlisteContext: () => ({
    deltakerlisteDetaljer: { id: 'liste-id' }
  })
}))

vi.mock('../hooks/useFocusPageLoad', () => ({
  useFocusPageLoad: () => ({ ref: null })
}))

vi.mock('../components/DeltakerlisteDetaljer', () => ({
  DeltakerlisteDetaljer: () => <div>DeltakerlisteDetaljer</div>
}))

vi.mock('../components/deltaker-liste-tabell/DeltakerlisteTabell', () => ({
  DeltakerlisteTabell: () => <div>DeltakerlisteTabell</div>
}))

vi.mock('../components/filter-deltakerliste/FilterDeltakerliste', () => ({
  FilterDeltakerliste: () => <div>FilterDeltakerliste</div>
}))

const resetMockQueryState = () => {
  mockQueryState.data = undefined
  mockQueryState.isPending = false
  mockQueryState.isFetching = false
  mockQueryState.isPlaceholderData = false
  mockQueryState.error = null
}

const lastUseQueryOptions = <T,>() => {
  const calls = useQueryMock.mock.calls
  return calls[calls.length - 1]?.[0] as T
}

describe('DeltakerlistePage sort-reset ved filterendring', () => {
  beforeEach(() => {
    valgteHendelseFilter = []
    valgteStatusFilter = []
    setLagretSorteringsValg.mockClear()
    resetMockQueryState()
  })

  it('resetter ikke sortering på første render', () => {
    render(<DeltakerlistePage />)

    expect(setLagretSorteringsValg).not.toHaveBeenCalled()
  })

  it('resetter sortering når hendelsefilter endres', () => {
    const { rerender } = render(<DeltakerlistePage />)

    valgteHendelseFilter = [HandlingFilterValg.AktiveForslag]
    rerender(<DeltakerlistePage />)

    expect(setLagretSorteringsValg).toHaveBeenCalledTimes(1)
    expect(setLagretSorteringsValg).toHaveBeenCalledWith(undefined)
  })

  it('resetter sortering når statusfilter endres', () => {
    const { rerender } = render(<DeltakerlistePage />)

    valgteStatusFilter = [DeltakerStatusType.DELTAR]
    rerender(<DeltakerlistePage />)

    expect(setLagretSorteringsValg).toHaveBeenCalledTimes(1)
    expect(setLagretSorteringsValg).toHaveBeenCalledWith(undefined)
  })
})

describe('DeltakerlistePage tilgangsfeil-håndtering', () => {
  beforeEach(() => {
    valgteHendelseFilter = []
    valgteStatusFilter = []
    resetMockQueryState()
    handterTilgangsFeilMock.mockClear()
  })

  it('kaller ikke handterTilgangsFeil når isFetching er true selv om data er TilgangsFeil', () => {
    mockQueryState.data = TilgangsFeil.IkkeTilgangTilDeltakerliste
    mockQueryState.isFetching = true

    render(<DeltakerlistePage />)

    expect(handterTilgangsFeilMock).not.toHaveBeenCalled()
  })

  it('kaller handterTilgangsFeil når isFetching blir false og data er TilgangsFeil', () => {
    mockQueryState.data = TilgangsFeil.IkkeTilgangTilDeltakerliste
    mockQueryState.isFetching = true

    const { rerender } = render(<DeltakerlistePage />)

    expect(handterTilgangsFeilMock).not.toHaveBeenCalled()

    mockQueryState.isFetching = false
    rerender(<DeltakerlistePage />)

    expect(handterTilgangsFeilMock).toHaveBeenCalledTimes(1)
    expect(handterTilgangsFeilMock).toHaveBeenCalledWith(
      TilgangsFeil.IkkeTilgangTilDeltakerliste,
      'liste-id',
      expect.any(Function)
    )
  })

  it('kaller ikke handterTilgangsFeil når data er gyldige deltakere', () => {
    mockQueryState.data = []
    mockQueryState.isFetching = false

    render(<DeltakerlistePage />)

    expect(handterTilgangsFeilMock).not.toHaveBeenCalled()
  })
})

describe('DeltakerlistePage useQuery-konfigurasjon', () => {
  beforeEach(() => {
    valgteHendelseFilter = []
    valgteStatusFilter = []
    resetMockQueryState()
    useQueryMock.mockClear()
  })

  it('inkluderer deltakerlisteId og filtre i queryKey', () => {
    valgteHendelseFilter = [HandlingFilterValg.AktiveForslag]
    valgteStatusFilter = [DeltakerStatusType.DELTAR]

    render(<DeltakerlistePage />)

    const options = lastUseQueryOptions<{ queryKey: unknown[] }>()
    expect(options.queryKey).toEqual([
      'deltakere',
      'liste-id',
      [HandlingFilterValg.AktiveForslag],
      [DeltakerStatusType.DELTAR]
    ])
  })

  it('sender handlingFilterValg som undefined når hendelsefilter er tomt', async () => {
    valgteHendelseFilter = []
    valgteStatusFilter = [DeltakerStatusType.DELTAR]

    render(<DeltakerlistePage />)

    const options = lastUseQueryOptions<{ queryFn: () => Promise<unknown> }>()
    await options.queryFn()

    expect(getDeltakereMock).toHaveBeenCalledWith('liste-id', {
      handlingFilterValg: undefined,
      statuser: [DeltakerStatusType.DELTAR]
    })
  })

  it('sender hendelsefilter når det er valgt', async () => {
    valgteHendelseFilter = [HandlingFilterValg.AktiveForslag]
    valgteStatusFilter = []

    render(<DeltakerlistePage />)

    const options = lastUseQueryOptions<{ queryFn: () => Promise<unknown> }>()
    await options.queryFn()

    expect(getDeltakereMock).toHaveBeenCalledWith('liste-id', {
      handlingFilterValg: [HandlingFilterValg.AktiveForslag],
      statuser: []
    })
  })

  it('filtrerer bort statuser som ikke er i STATUS_FILTER_TYPER', async () => {
    valgteStatusFilter = [
      DeltakerStatusType.DELTAR,
      // KLADD finnes ikke i STATUS_FILTER_TYPER og skal fjernes
      DeltakerStatusType.KLADD
    ]

    render(<DeltakerlistePage />)

    const options = lastUseQueryOptions<{ queryFn: () => Promise<unknown> }>()
    await options.queryFn()

    expect(getDeltakereMock).toHaveBeenCalledWith('liste-id', {
      handlingFilterValg: undefined,
      statuser: [DeltakerStatusType.DELTAR]
    })
  })
})

describe('DeltakerlistePage rendering-tilstander', () => {
  beforeEach(() => {
    valgteHendelseFilter = []
    valgteStatusFilter = []
    resetMockQueryState()
  })

  it('viser feilmelding når error er satt', () => {
    mockQueryState.error = new Error('boom')

    render(<DeltakerlistePage />)

    expect(
      screen.getByText('Kunne ikke hente deltakere. Prøv igjen senere.')
    ).toBeTruthy()
  })

  it('viser loader og skjuler tabell når isPending', () => {
    mockQueryState.isPending = true

    render(<DeltakerlistePage />)

    expect(screen.queryByText('DeltakerlisteTabell')).toBeNull()
    expect(screen.getByTitle('Laster deltakere...')).toBeTruthy()
  })

  it('viser tabell når ikke isPending', () => {
    mockQueryState.isPending = false

    render(<DeltakerlistePage />)

    expect(screen.getByText('DeltakerlisteTabell')).toBeTruthy()
  })

  it('legger på opacity-50 på tabell-wrapper når isFetching og ikke isPending', () => {
    mockQueryState.isPending = false
    mockQueryState.isFetching = true

    const { container } = render(<DeltakerlistePage />)

    const wrapper = container.querySelector('.opacity-50')
    expect(wrapper).toBeTruthy()
    expect(wrapper?.textContent).toContain('DeltakerlisteTabell')
  })

  it('legger ikke på opacity-50 når ikke isFetching', () => {
    mockQueryState.isPending = false
    mockQueryState.isFetching = false

    const { container } = render(<DeltakerlistePage />)

    expect(container.querySelector('.opacity-50')).toBeNull()
  })

  it('rendrer alltid DeltakerlisteDetaljer og FilterDeltakerliste', () => {
    render(<DeltakerlistePage />)

    expect(screen.getByText('DeltakerlisteDetaljer')).toBeTruthy()
    expect(screen.getByText('FilterDeltakerliste')).toBeTruthy()
  })
})
