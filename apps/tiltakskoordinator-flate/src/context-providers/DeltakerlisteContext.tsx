import { createContext, useContext, useState } from 'react'
import { Deltakere, DeltakerlisteDetaljer } from '../api/data/deltakerliste'

export interface DeltakerListeContextProps {
  deltakerlisteDetaljer: DeltakerlisteDetaljer
  deltakere: Deltakere
  filtrerteDeltakere: Deltakere
  setDeltakerlisteDetaljer: React.Dispatch<
    React.SetStateAction<DeltakerlisteDetaljer>
  >
  setDeltakere: React.Dispatch<React.SetStateAction<Deltakere>>
  setFiltrerteDeltakere: React.Dispatch<React.SetStateAction<Deltakere>>
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
  initialDeltakere,
  children
}: {
  initialDeltakerlisteDetaljer: DeltakerlisteDetaljer
  initialDeltakere: Deltakere
  children: React.ReactNode
}) => {
  const [deltakerlisteDetaljer, setDeltakerlisteDetaljer] = useState(
    initialDeltakerlisteDetaljer
  )
  const [deltakere, setDelakere] = useState(initialDeltakere)
  const [filtrerteDeltakere, setFiltrerteDeltakere] = useState(initialDeltakere)

  const contextValue: DeltakerListeContextProps = {
    deltakerlisteDetaljer: deltakerlisteDetaljer,
    deltakere: deltakere,
    filtrerteDeltakere: filtrerteDeltakere,
    setDeltakerlisteDetaljer: setDeltakerlisteDetaljer,
    setDeltakere: setDelakere,
    setFiltrerteDeltakere: setFiltrerteDeltakere
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
