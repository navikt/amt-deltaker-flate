import {useAppContext} from '../AppContext.tsx'
import {base} from '../Routes.tsx'
import { useNavigate } from 'react-router-dom'

interface UseAppRedirection {
    doRedirect: (path: string) => void
}

export const useAppRedirection = (): UseAppRedirection => {
  const { deltakerlisteId } = useAppContext()
  const navigate = useNavigate()

  const doRedirect = (path: string) => {
    const to = `/${base.replace(':id', deltakerlisteId)}/${path}`

    navigate(to)
  }

  return {doRedirect}

}
