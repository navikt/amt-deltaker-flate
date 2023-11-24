import React, { useContext } from 'react'

export const DeltakerIdentContext = React.createContext<
  { personident: string; deltakerlisteId: string } | null | undefined
>(null)

export const useDeltakerIdent = (): { personident: string; deltakerlisteId: string } => {
  const deltakerIdent = useContext(DeltakerIdentContext)

  if (deltakerIdent == null) {
    throw Error('Mangler deltakerident')
  }
  if (deltakerIdent.deltakerlisteId === '') {
    throw Error('Mangler deltakerlisteid')
  }
  if (deltakerIdent.personident === '') {
    throw Error('Mangler personident')
  }

  return deltakerIdent
}
