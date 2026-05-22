import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { DeltakerlistePage } from './DeltakerlistePage'
import { HandlingFilterValg } from '../utils/filter-deltakerliste'

let valgteHendelseFilter: HandlingFilterValg[] = []
let valgteStatusFilter: DeltakerStatusType[] = []

const setLagretSorteringsValg = vi.fn()
const setDeltakere = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  keepPreviousData: Symbol('keepPreviousData'),
  useQuery: () => ({
    data: undefined,
    isPending: false,
    isFetching: false,
    isPlaceholderData: false,
    error: null
  })
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
    deltakerlisteDetaljer: { id: 'liste-id' },
    setDeltakere
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

describe('DeltakerlistePage sort-reset ved filterendring', () => {
  beforeEach(() => {
    valgteHendelseFilter = []
    valgteStatusFilter = []
    setLagretSorteringsValg.mockClear()
    setDeltakere.mockClear()
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
