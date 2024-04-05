import { createContext, useContext, useState } from 'react'

export interface AppContextProps {
  personident: string
  enhetId: string
  setPersonident: React.Dispatch<React.SetStateAction<string>>
  setEnhetId: React.Dispatch<React.SetStateAction<string>>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }

  return context
}

const AppContextProvider = ({
  initialPersonident,
  initialEnhetId,
  children
}: {
  initialPersonident: string
  initialEnhetId: string
  children: React.ReactNode
}) => {
  const [personident, setPersonident] = useState(initialPersonident)
  const [enhetId, setEnhetId] = useState(initialEnhetId)

  const contextValue: AppContextProps = {
    personident,
    setPersonident,
    enhetId,
    setEnhetId
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export { AppContext, useAppContext, AppContextProvider }
