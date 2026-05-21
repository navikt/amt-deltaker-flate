import { createContext, useContext, useState } from 'react'
import { DeltakerStatusType } from 'deltaker-flate-common'
import {
  HandlingFilterValg,
  StatusFilterValg
} from '../utils/filter-deltakerliste'

const DEFAULT_STATUS_FILTERS: StatusFilterValg[] = [
  DeltakerStatusType.VENTER_PA_OPPSTART,
  DeltakerStatusType.DELTAR
]

export interface FilterContextProps {
  valgteHendelseFilter: HandlingFilterValg[]
  valgteStatusFilter: StatusFilterValg[]
  setValgteHendelseFilter: React.Dispatch<
    React.SetStateAction<HandlingFilterValg[]>
  >
  setValgteStatusFilter: React.Dispatch<
    React.SetStateAction<StatusFilterValg[]>
  >
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

const FilterContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [valgteHendelseFilter, setValgteHendelseFilter] = useState<
    HandlingFilterValg[]
  >([])
  const [valgteStatusFilter, setValgteStatusFilter] = useState<
    StatusFilterValg[]
  >(DEFAULT_STATUS_FILTERS)

  const nullstillFilter = () => {
    setValgteHendelseFilter([])
    setValgteStatusFilter(DEFAULT_STATUS_FILTERS)
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
