import { createContext, useContext, useState } from 'react'

export interface PameldingFormContextProps {
  disabled: boolean
  redigerUtkast: boolean
  setRedigerUtkast: React.Dispatch<React.SetStateAction<boolean>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
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

  const contextValue: PameldingFormContextProps = {
    disabled,
    redigerUtkast,
    setRedigerUtkast,
    setDisabled
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
