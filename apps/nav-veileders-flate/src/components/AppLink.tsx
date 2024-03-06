import {useAppContext} from '../AppContext.tsx'
import {Link} from 'react-router-dom'
import {ReactNode} from 'react'
import { base } from '../Routes.tsx'

interface Props {
  path: string
  children: ReactNode
}

export const AppLink = ({ path, children }: Props) => {
  const { deltakerlisteId } = useAppContext()

  const to = `/${base.replace(':id', deltakerlisteId)}/${path}`

  return <Link to={to}>{children}</Link>
}
