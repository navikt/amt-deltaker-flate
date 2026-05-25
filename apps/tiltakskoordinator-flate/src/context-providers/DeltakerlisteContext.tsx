import { createContext, useContext, useState } from 'react'
import {
  DeltakerHandlingCounts,
  DeltakerlisteDetaljer,
  DeltakerStatusCounts
} from '../api/data/deltakerliste'

export interface DeltakerListeContextProps {
  deltakerlisteDetaljer: DeltakerlisteDetaljer
  statusCounts: DeltakerStatusCounts
  handlingCounts: DeltakerHandlingCounts
  filterCountsLaster: boolean
  setDeltakerlisteDetaljer: React.Dispatch<
    React.SetStateAction<DeltakerlisteDetaljer>
  >
}

const DeltakerlisteContext = createContext<
  DeltakerListeContextProps | undefined
>(undefined)

const useDeltakerlisteContext = () => {
  const context = useContext(DeltakerlisteContext)

  if (!context) {
    throw new Error(
      'useDeltakerlisteContext must be used within an DeltakerlisteContextProvider'
    )
  }

  return context
}

const DeltakerlisteContextProvider = ({
  initialDeltakerlisteDetaljer,
  initialStatusCounts,
  initialHandlingCounts,
  initialFilterCountsLaster,
  children
}: {
  initialDeltakerlisteDetaljer: DeltakerlisteDetaljer
  initialStatusCounts: DeltakerStatusCounts
  initialHandlingCounts: DeltakerHandlingCounts
  initialFilterCountsLaster: boolean
  children: React.ReactNode
}) => {
  const [deltakerlisteDetaljer, setDeltakerlisteDetaljer] = useState(
    initialDeltakerlisteDetaljer
  )

  const contextValue: DeltakerListeContextProps = {
    deltakerlisteDetaljer: deltakerlisteDetaljer,
    statusCounts: initialStatusCounts,
    handlingCounts: initialHandlingCounts,
    filterCountsLaster: initialFilterCountsLaster,
    setDeltakerlisteDetaljer: setDeltakerlisteDetaljer
  }

  return (
    <DeltakerlisteContext.Provider value={contextValue}>
      {children}
    </DeltakerlisteContext.Provider>
  )
}

export {
  DeltakerlisteContext,
  useDeltakerlisteContext,
  DeltakerlisteContextProvider
}
