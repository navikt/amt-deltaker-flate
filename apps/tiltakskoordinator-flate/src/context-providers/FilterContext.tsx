import { createContext, useContext, useEffect, useState } from 'react'
import {
  HandlingFilterValg,
  StatusFilterValg
} from '../utils/filter-deltakerliste'

const HENDELSE_FILTER_STORAGE_KEY = 'deltaker-liste-filter-hendelser'
const STATUS_FILTER_STORAGE_KEY = 'deltaker-liste-filter-status'

function readFromStorage<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(key)
  if (item) {
    try {
      const parsed = JSON.parse(item)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T
      }
    } catch {
      // ugyldig JSON, bruk fallback
    }
  }
  return fallback
}

export interface FilterContextProps {
  valgteHendelseFilter: HandlingFilterValg[]
  valgteStatusFilter: StatusFilterValg[]
  setValgteHendelseFilter: (value: HandlingFilterValg[]) => void
  setValgteStatusFilter: (value: StatusFilterValg[]) => void
  nullstillFilter?: () => void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

const useFilterContext = () => {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error(
      'useFilterContext must be used within an FilterContextProvider'
    )
  }

  return context
}

const FilterContextProvider = ({
  deltakerlisteId,
  initialStatusFilter,
  children
}: {
  deltakerlisteId: string
  initialStatusFilter: StatusFilterValg[]
  children: React.ReactNode
}) => {
  const hendelseStorageKey = `${HENDELSE_FILTER_STORAGE_KEY}_${deltakerlisteId}`
  const statusStorageKey = `${STATUS_FILTER_STORAGE_KEY}_${deltakerlisteId}`

  const [valgteHendelseFilter, setValgteHendelseFilterState] = useState<
    HandlingFilterValg[]
  >(() => readFromStorage<HandlingFilterValg[]>(hendelseStorageKey, []))

  const [valgteStatusFilter, setValgteStatusFilterState] = useState<
    StatusFilterValg[]
  >(() =>
    readFromStorage<StatusFilterValg[]>(statusStorageKey, initialStatusFilter)
  )

  useEffect(() => {
    localStorage.setItem(
      hendelseStorageKey,
      JSON.stringify(valgteHendelseFilter)
    )
  }, [valgteHendelseFilter, hendelseStorageKey])

  useEffect(() => {
    localStorage.setItem(statusStorageKey, JSON.stringify(valgteStatusFilter))
  }, [valgteStatusFilter, statusStorageKey])

  const setValgteHendelseFilter = (value: HandlingFilterValg[]) => {
    setValgteHendelseFilterState(value)
  }

  const setValgteStatusFilter = (value: StatusFilterValg[]) => {
    setValgteStatusFilterState(value.length > 0 ? value : initialStatusFilter)
  }

  const nullstillFilter = () => {
    setValgteHendelseFilterState([])
    setValgteStatusFilterState(initialStatusFilter)
  }

  const contextValue: FilterContextProps = {
    valgteHendelseFilter,
    setValgteHendelseFilter,
    valgteStatusFilter,
    setValgteStatusFilter,
    nullstillFilter
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContext, FilterContextProvider, useFilterContext }
