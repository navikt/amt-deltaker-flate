import { createContext, useContext } from 'react'
import useLocalStorage from '../../../../packages/deltaker-flate-common/hooks/useLocalStorage'
import {
  HandlingFilterValg,
  StatusFilterValg
} from '../utils/filter-deltakerliste'

const HENDELSE_FILTER_STORAGE_KEY = 'deltaker-liste-filter-hendelser'
const STATUS_FILTER_STORAGE_KEY = 'deltaker-liste-filter-status'

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
  const [valgteHendelseFilter, setValgteHendelseFilter] = useLocalStorage<
    HandlingFilterValg[]
  >(`${HENDELSE_FILTER_STORAGE_KEY}_${deltakerlisteId}`, [])
  const [valgteStatusFilter, setValgteStatusFilter] = useLocalStorage<
    StatusFilterValg[]
  >(`${STATUS_FILTER_STORAGE_KEY}_${deltakerlisteId}`, initialStatusFilter)

  const nullstillFilter = () => {
    setValgteHendelseFilter([])
    setValgteStatusFilter(initialStatusFilter)
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
