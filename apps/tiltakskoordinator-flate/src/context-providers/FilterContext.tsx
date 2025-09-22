import { createContext, useContext, useState } from 'react'
import {
  HandlingFilterValg,
  StatusFilterValg
} from '../utils/filter-deltakerliste'

export interface FilterContextProps {
  valgteHandlingerFilter: HandlingFilterValg[]
  valgteStatusFilter: StatusFilterValg[]
  setValgteHandlingerFilter: React.Dispatch<
    React.SetStateAction<HandlingFilterValg[]>
  >
  setValgteStatusFilter: React.Dispatch<
    React.SetStateAction<StatusFilterValg[]>
  >
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
  const [valgteHandlingerFilter, setValgteHandlingerFilter] = useState<
    HandlingFilterValg[]
  >([])
  const [valgteStatusFilter, setValgteStatusFilter] = useState<
    StatusFilterValg[]
  >([])

  const contextValue: FilterContextProps = {
    valgteHandlingerFilter: valgteHandlingerFilter,
    setValgteHandlingerFilter: setValgteHandlingerFilter,
    valgteStatusFilter: valgteStatusFilter,
    setValgteStatusFilter: setValgteStatusFilter
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContext, FilterContextProvider, useFilterContext }
