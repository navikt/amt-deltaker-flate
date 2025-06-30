import { createContext, useContext, useState } from 'react'
import { FilterValg } from '../utils/filter-deltakerliste'

export interface FilterContextProps {
  valgteFilter: FilterValg[]
  setValgteFilter: React.Dispatch<React.SetStateAction<FilterValg[]>>
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
  const [valgteFilter, setValgteFilter] = useState<FilterValg[]>([])

  const contextValue: FilterContextProps = {
    valgteFilter,
    setValgteFilter
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContext, FilterContextProvider, useFilterContext }
