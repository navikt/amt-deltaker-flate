import {useAppContext} from '../AppContext.tsx'
import {Link} from 'react-router-dom'
import {ReactNode} from 'react'

interface Props {
    path: string,
    children: ReactNode
}

export const AppLink = ({path, children}: Props) => {
  const {deltakerlisteId} = useAppContext()

  const to = `/arbeidsmarkedstiltak/tiltak/${deltakerlisteId}/deltaker/${path}`

  return (
    <Link to={to}>
      {children}
    </Link>
  )

}
