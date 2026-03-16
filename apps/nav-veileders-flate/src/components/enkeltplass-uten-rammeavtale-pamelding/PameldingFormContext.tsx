import { createContext, useContext, useState } from 'react'

interface ErrorRecord {
  id: string
  message: string
}

export interface PameldingFormContextProps {
  disabled: boolean
  errors: ErrorRecord[]
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
  setErrors: React.Dispatch<React.SetStateAction<ErrorRecord[]>>
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
  const [errors, setErrors] = useState<ErrorRecord[]>([])

  const contextValue: PameldingFormContextProps = {
    disabled,
    errors,
    setDisabled,
    setErrors
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
