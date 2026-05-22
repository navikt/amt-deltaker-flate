import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeltakerStatusType, Pameldingstype } from 'deltaker-flate-common'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DeltakerHandlingCounts,
  DeltakerStatusCounts
} from '../../api/data/deltakerliste'
import { DeltakerlisteContextProvider } from '../../context-providers/DeltakerlisteContext'
import { FilterContextProvider } from '../../context-providers/FilterContext'
import {
  createMockDeltakerlisteDetaljer,
  lagMockDeltaker
} from '../../mocks/mockData'
import { HendelseFilter } from './HendelseFilter'
import { StatusFilter } from './StatusFilter'

const HENDELSE_FILTER_OPEN_KEY = 'deltaker-liste-filter-hendelser-open'
const STATUS_FILTER_OPEN_KEY = 'deltaker-liste-filter-status-open'

const renderFilterPanel = (
  statusCounts: DeltakerStatusCounts,
  handlingCounts: DeltakerHandlingCounts
) => {
  const detaljer = {
    ...createMockDeltakerlisteDetaljer(),
    pameldingstype: Pameldingstype.TRENGER_GODKJENNING
  }

  const deltakere = [
    {
      ...lagMockDeltaker(),
      status: { type: DeltakerStatusType.DELTAR, aarsak: null },
      harAktiveForslag: false,
      harOppdateringFraNav: false,
      erNyDeltaker: false
    },
    {
      ...lagMockDeltaker(),
      status: { type: DeltakerStatusType.HAR_SLUTTET, aarsak: null },
      harAktiveForslag: true,
      harOppdateringFraNav: true,
      erNyDeltaker: true
    }
  ]

  return render(
    <FilterContextProvider>
      <DeltakerlisteContextProvider
        initialDeltakerlisteDetaljer={detaljer}
        initialDeltakere={deltakere}
        initialStatusCounts={statusCounts}
        initialHandlingCounts={handlingCounts}
        initialFilterCountsLaster={false}
      >
        <HendelseFilter />
        <StatusFilter />
      </DeltakerlisteContextProvider>
    </FilterContextProvider>
  )
}

describe('Filter counts from backend', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    const storage = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value)
      },
      removeItem: (key: string) => {
        storage.delete(key)
      },
      clear: () => {
        storage.clear()
      }
    })

    localStorage.setItem(HENDELSE_FILTER_OPEN_KEY, 'true')
    localStorage.setItem(STATUS_FILTER_OPEN_KEY, 'true')
  })

  it('beholder hendelse-counts når statusfilter endres', async () => {
    const user = userEvent.setup()

    renderFilterPanel(
      { DELTAR: 44, HAR_SLUTTET: 55 },
      { AktiveForslag: 12, OppdateringFraNav: 13, NyeDeltakere: 14 }
    )

    const aktiveForslagRow = screen
      .getByText('Forslag fra arrangør')
      .closest('label')
    expect(aktiveForslagRow?.textContent ?? '').toContain('12')

    const deltarRow = screen.getByText('Deltar').closest('label')
    expect(deltarRow).not.toBeNull()

    // Toggler et statusfilter som tidligere kunne påvirke lokalberegnet antall.
    await user.click(deltarRow!)

    expect(aktiveForslagRow?.textContent ?? '').toContain('12')
  })

  it('beholder status-counts når hendelsesfilter endres', async () => {
    const user = userEvent.setup()

    renderFilterPanel(
      { DELTAR: 44, HAR_SLUTTET: 55 },
      { AktiveForslag: 12, OppdateringFraNav: 13, NyeDeltakere: 14 }
    )

    const deltarRow = screen.getByText('Deltar').closest('label')
    expect(deltarRow?.textContent ?? '').toContain('44')

    const aktiveForslagRow = screen
      .getByText('Forslag fra arrangør')
      .closest('label')
    expect(aktiveForslagRow).not.toBeNull()

    // Toggler et hendelsesfilter som tidligere kunne påvirke lokalberegnet antall.
    await user.click(aktiveForslagRow!)

    expect(deltarRow?.textContent ?? '').toContain('44')
  })
})
