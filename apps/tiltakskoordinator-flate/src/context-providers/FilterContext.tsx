import { createContext, useContext, useState } from 'react'
import {
  HandlingFilterValg,
  StatusFilterValg
} from '../utils/filter-deltakerliste'

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
  >([])

  const nullstillFilter = () => {
    setValgteHendelseFilter([])
    setValgteStatusFilter([])
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
