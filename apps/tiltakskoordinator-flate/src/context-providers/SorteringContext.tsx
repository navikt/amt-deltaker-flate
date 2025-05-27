import { createContext, useContext, useState } from 'react'
import { ScopedSortState } from '../hooks/useDeltakerSortering'

export interface SorteringContextProps {
  lagretSorteringsValg?: ScopedSortState
  setLagretSorteringsValg: React.Dispatch<
    React.SetStateAction<ScopedSortState | undefined>
  >
}

const SorteringContext = createContext<SorteringContextProps | undefined>(
  undefined
)

const useSorteringContext = () => {
  const context = useContext(SorteringContext)

  if (!context) {
    throw new Error(
      'useSorteringContext must be used within an SorteringContextProvider'
    )
  }

  return context
}

const SorteringContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [lagretSorteringsValg, setLagretSorteringsValg] =
    useState<ScopedSortState>()

  const contextValue: SorteringContextProps = {
    lagretSorteringsValg,
    setLagretSorteringsValg
  }

  return (
    <SorteringContext.Provider value={contextValue}>
      {children}
    </SorteringContext.Provider>
  )
}

export { SorteringContext, SorteringContextProvider, useSorteringContext }
