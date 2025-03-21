import { createContext, useContext, useState } from 'react'
import { Deltaker } from '../api/data/deltakerliste'

export const enum HandlingValg {
  DEL_DELTAKERE = 'DEL_DELTAKERE'
}

export interface HandlingContextProps {
  handlingValg: HandlingValg | null
  setHandlingValg: React.Dispatch<React.SetStateAction<HandlingValg | null>>
  valgteDeltakere: Deltaker[]
  setValgteDeltakere: React.Dispatch<React.SetStateAction<Deltaker[]>>
}

const HandlingContext = createContext<HandlingContextProps | undefined>(
  undefined
)

const useHandlingContext = () => {
  const context = useContext(HandlingContext)

  if (!context) {
    throw new Error(
      'useHandlingContext must be used within an HandlingContextProvider'
    )
  }

  return context
}

const HandlingContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [handlingValg, setHandlingValg] = useState<HandlingValg | null>(null)
  const [valgteDeltakere, setValgteDeltakere] = useState<Deltaker[]>([])

  const contextValue: HandlingContextProps = {
    handlingValg,
    valgteDeltakere,
    setHandlingValg,
    setValgteDeltakere
  }

  return (
    <HandlingContext.Provider value={contextValue}>
      {children}
    </HandlingContext.Provider>
  )
}

export { HandlingContext, useHandlingContext, HandlingContextProvider }
