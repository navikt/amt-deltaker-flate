import { createContext, useContext, useState } from 'react'

export interface AppContextProps {
  deltakerlisteId: string
  setDeltakerlisteId: React.Dispatch<React.SetStateAction<string>>
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
  initialDeltakerlisteId,
  children
}: {
  initialDeltakerlisteId: string
  children: React.ReactNode
}) => {
  const [deltakerlisteId, setDeltakerlisteId] = useState(initialDeltakerlisteId)

  const contextValue: AppContextProps = {
    deltakerlisteId,
    setDeltakerlisteId
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export { AppContext, useAppContext, AppContextProvider }
