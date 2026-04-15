import { createContext, useContext, useState } from 'react'

export interface PameldingFormContextProps {
  disabled: boolean
  redigerUtkastModus: boolean
  error: string | null
  setRedigerUtkastModus: React.Dispatch<React.SetStateAction<boolean>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const PameldingFormContext = createContext<
  PameldingFormContextProps | undefined
>(undefined)

const usePameldingFormContext = () => {
  const context = useContext(PameldingFormContext)

  if (!context) {
    throw new Error(
      'usePameldingFormContext must be used within a PameldingFormContextProvider'
    )
  }

  return context
}

const PameldingFormContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [disabled, setDisabled] = useState(false)
  const [redigerUtkast, setRedigerUtkast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contextValue: PameldingFormContextProps = {
    disabled,
    redigerUtkastModus: redigerUtkast,
    error,
    setRedigerUtkastModus: setRedigerUtkast,
    setDisabled,
    setError
  }

  return (
    <PameldingFormContext.Provider value={contextValue}>
      {children}
    </PameldingFormContext.Provider>
  )
}

export {
  PameldingFormContext,
  PameldingFormContextProvider,
  usePameldingFormContext
}
