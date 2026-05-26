import { renderHook, act } from '@testing-library/react'
import { DeltakerStatusType, Pameldingstype } from 'deltaker-flate-common'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FilterContextProvider, useFilterContext } from './FilterContext'
import {
  getDefaultStatusFilter,
  HandlingFilterValg
} from '../utils/filter-deltakerliste'

const DELTAKERLISTE_ID = 'test-deltakerliste-id'
const HENDELSE_FILTER_STORAGE_KEY = `deltaker-liste-filter-hendelser_${DELTAKERLISTE_ID}`
const STATUS_FILTER_STORAGE_KEY = `deltaker-liste-filter-status_${DELTAKERLISTE_ID}`

describe('FilterContext', () => {
  let storage: Map<string, string>

  beforeEach(() => {
    storage = new Map<string, string>()
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
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const renderFilterContext = (pameldingstype: Pameldingstype) => {
    const initialStatusFilter = getDefaultStatusFilter(pameldingstype)
    return renderHook(() => useFilterContext(), {
      wrapper: ({ children }) => (
        <FilterContextProvider
          deltakerlisteId={DELTAKERLISTE_ID}
          initialStatusFilter={initialStatusFilter}
        >
          {children}
        </FilterContextProvider>
      )
    })
  }

  describe('default filtre uten lagrede verdier', () => {
    it('bruker default statusfilter for TRENGER_GODKJENNING når ingen verdier er lagret', () => {
      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      expect(result.current.valgteStatusFilter).toEqual([
        DeltakerStatusType.SOKT_INN,
        DeltakerStatusType.VENTELISTE,
        DeltakerStatusType.VENTER_PA_OPPSTART,
        DeltakerStatusType.DELTAR
      ])
    })

    it('bruker default statusfilter for UTEN_GODKJENNING når ingen verdier er lagret', () => {
      const { result } = renderFilterContext(Pameldingstype.DIREKTE_VEDTAK)

      expect(result.current.valgteStatusFilter).toEqual([
        DeltakerStatusType.VENTER_PA_OPPSTART,
        DeltakerStatusType.DELTAR
      ])
    })

    it('har tom hendelse-filter når ingen verdier er lagret', () => {
      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      expect(result.current.valgteHendelseFilter).toEqual([])
    })
  })

  describe('lagrer og gjenoppretter filtre fra localStorage', () => {
    it('lagrer statusfilter til localStorage ved endring', () => {
      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      act(() => {
        result.current.setValgteStatusFilter([DeltakerStatusType.DELTAR])
      })

      expect(result.current.valgteStatusFilter).toEqual([
        DeltakerStatusType.DELTAR
      ])
      expect(JSON.parse(storage.get(STATUS_FILTER_STORAGE_KEY)!)).toEqual([
        DeltakerStatusType.DELTAR
      ])
    })

    it('lagrer hendelsesfilter til localStorage ved endring', () => {
      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      act(() => {
        result.current.setValgteHendelseFilter([
          HandlingFilterValg.AktiveForslag
        ])
      })

      expect(result.current.valgteHendelseFilter).toEqual([
        HandlingFilterValg.AktiveForslag
      ])
      expect(JSON.parse(storage.get(HENDELSE_FILTER_STORAGE_KEY)!)).toEqual([
        HandlingFilterValg.AktiveForslag
      ])
    })

    it('gjenoppretter lagrede statusfilter fra localStorage', () => {
      storage.set(
        STATUS_FILTER_STORAGE_KEY,
        JSON.stringify([DeltakerStatusType.HAR_SLUTTET])
      )

      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      expect(result.current.valgteStatusFilter).toEqual([
        DeltakerStatusType.HAR_SLUTTET
      ])
    })

    it('gjenoppretter lagrede hendelsesfilter fra localStorage', () => {
      storage.set(
        HENDELSE_FILTER_STORAGE_KEY,
        JSON.stringify([
          HandlingFilterValg.AktiveForslag,
          HandlingFilterValg.NyeDeltakere
        ])
      )

      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      expect(result.current.valgteHendelseFilter).toEqual([
        HandlingFilterValg.AktiveForslag,
        HandlingFilterValg.NyeDeltakere
      ])
    })

    it('bruker default statusfilter når localStorage inneholder tom liste', () => {
      storage.set(STATUS_FILTER_STORAGE_KEY, JSON.stringify([]))

      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      expect(result.current.valgteStatusFilter).toEqual(
        getDefaultStatusFilter(Pameldingstype.TRENGER_GODKJENNING)
      )
    })
  })

  describe('rekkefølge: localStorage leses før første render', () => {
    it('filtervalg er tilgjengelige synkront ved første render (ingen ekstra renders)', () => {
      const lagretStatus = [DeltakerStatusType.HAR_SLUTTET]
      const lagretHendelse = [HandlingFilterValg.NyeDeltakere]

      storage.set(STATUS_FILTER_STORAGE_KEY, JSON.stringify(lagretStatus))
      storage.set(HENDELSE_FILTER_STORAGE_KEY, JSON.stringify(lagretHendelse))

      const renderValues: {
        status: DeltakerStatusType[]
        hendelse: HandlingFilterValg[]
      }[] = []

      renderHook(
        () => {
          const ctx = useFilterContext()
          renderValues.push({
            status: ctx.valgteStatusFilter,
            hendelse: ctx.valgteHendelseFilter
          })
          return ctx
        },
        {
          wrapper: ({ children }) => (
            <FilterContextProvider
              deltakerlisteId={DELTAKERLISTE_ID}
              initialStatusFilter={getDefaultStatusFilter(
                Pameldingstype.TRENGER_GODKJENNING
              )}
            >
              {children}
            </FilterContextProvider>
          )
        }
      )

      // Allerede ved første render skal verdiene være fra localStorage
      expect(renderValues[0].status).toEqual(lagretStatus)
      expect(renderValues[0].hendelse).toEqual(lagretHendelse)
    })
  })

  describe('nullstillFilter', () => {
    it('nullstiller til default-verdier og oppdaterer localStorage', () => {
      storage.set(
        STATUS_FILTER_STORAGE_KEY,
        JSON.stringify([DeltakerStatusType.HAR_SLUTTET])
      )
      storage.set(
        HENDELSE_FILTER_STORAGE_KEY,
        JSON.stringify([HandlingFilterValg.AktiveForslag])
      )

      const { result } = renderFilterContext(Pameldingstype.TRENGER_GODKJENNING)

      // Verifiser at lagrede verdier er gjenopprettet
      expect(result.current.valgteStatusFilter).toEqual([
        DeltakerStatusType.HAR_SLUTTET
      ])
      expect(result.current.valgteHendelseFilter).toEqual([
        HandlingFilterValg.AktiveForslag
      ])

      // Nullstill
      act(() => {
        result.current.nullstillFilter!()
      })

      expect(result.current.valgteStatusFilter).toEqual(
        getDefaultStatusFilter(Pameldingstype.TRENGER_GODKJENNING)
      )
      expect(result.current.valgteHendelseFilter).toEqual([])
    })
  })
})
