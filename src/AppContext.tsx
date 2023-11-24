import { DeltakerIdentContext } from './hooks/useDeltakerIdent'
import { Dispatch, ReactNode, useEffect, useState } from 'react'

export interface AppContextProps {
  personident: string
  deltakerlisteId: string
  setPersonidentRef?: (setPersonident: Dispatch<string>) => void
  setDeltakelisteIdRef?: (setDeltakelisteId: Dispatch<string>) => void
  children: ReactNode
}

export function AppContext(props: AppContextProps) {
  const [personident, setPersonident] = useState(props.personident)
  const [deltakerlisteId, setDeltakelisteId] = useState(props.deltakerlisteId)

  useEffect(() => {
    if (props.setPersonidentRef) {
      props.setPersonidentRef(setPersonident)
    }
    if (props.setDeltakelisteIdRef) {
      props.setDeltakelisteIdRef(setDeltakelisteId)
    }
  }, [])

  return (
    <DeltakerIdentContext.Provider value={{ personident, deltakerlisteId }}>
      {props.children}
    </DeltakerIdentContext.Provider>
  )
}
