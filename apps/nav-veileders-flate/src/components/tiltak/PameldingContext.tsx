import { createContext, useContext, useEffect, useState } from 'react'
import { DeltakerResponse } from '../../api/data/pamelding'

export interface PameldingContextProps {
  pamelding: DeltakerResponse
  setPamelding: React.Dispatch<React.SetStateAction<DeltakerResponse>>
}

const PameldingContext = createContext<PameldingContextProps | undefined>(
  undefined
)

const usePameldingContext = () => {
  const context = useContext(PameldingContext)

  if (!context) {
    throw new Error(
      'usePameldingCOntext must be used within an PameldingContextProvider'
    )
  }

  return context
}

const PameldingContextProvider = ({
  initialPamelding,
  children
}: {
  initialPamelding: DeltakerResponse
  children: React.ReactNode
}) => {
  const [pamelding, setPamelding] = useState(initialPamelding)

  const contextValue: PameldingContextProps = {
    pamelding,
    setPamelding
  }

  useEffect(() => {
    if (initialPamelding.deltakerId !== pamelding.deltakerId) {
      setPamelding(initialPamelding)
    }
  }, [initialPamelding])

  return (
    <PameldingContext.Provider value={contextValue}>
      {children}
    </PameldingContext.Provider>
  )
}

export { PameldingContext, usePameldingContext, PameldingContextProvider }
