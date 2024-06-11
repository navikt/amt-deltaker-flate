import { createContext, useContext, useState } from 'react'
import { DeltakerResponse } from './api/data/deltaker'

export interface DeltakerContextProps {
  deltaker: DeltakerResponse
  setDeltaker: React.Dispatch<React.SetStateAction<DeltakerResponse>>
  showSuccessMessage: boolean
  setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>
}

const DeltakerContext = createContext<DeltakerContextProps | undefined>(
  undefined
)

const useDeltakerContext = () => {
  const context = useContext(DeltakerContext)

  if (!context) {
    throw new Error(
      'usePameldingCOntext must be used within an PameldingContextProvider'
    )
  }

  return context
}

const DeltakerContextProvider = ({
  initialDeltaker,
  children
}: {
  initialDeltaker: DeltakerResponse
  children: React.ReactNode
}) => {
  const [deltaker, setDeltaker] = useState(initialDeltaker)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const contextValue: DeltakerContextProps = {
    deltaker,
    setDeltaker,
    showSuccessMessage,
    setShowSuccessMessage
  }

  return (
    <DeltakerContext.Provider value={contextValue}>
      {children}
    </DeltakerContext.Provider>
  )
}

export { DeltakerContext, useDeltakerContext, DeltakerContextProvider }
