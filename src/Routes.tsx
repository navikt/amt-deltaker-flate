import {Navigate, Route, Routes} from 'react-router-dom'
import {Pamelding} from './pages/Pamelding.tsx'
import {Delakelse} from './pages/Delakelse.tsx'
import App from './App.tsx'
import { useAppContext } from './AppContext.tsx'

const appUrl = (path: string): string => {
  const strippedPath = path.startsWith('/') ? path.substring(1) : path
  return `${import.meta.env.BASE_URL}${strippedPath}`
}

export const base = appUrl('arbeidsmarkedstiltak/tiltak/:id/deltaker')
export const PAMELDING_PAGE = 'pamelding'
export const DELTAKELSE_PAGE = 'deltaker'

export const AppRoutes = () => {
  const { deltakerlisteId } = useAppContext()

  return (
    <Routes>
      <Route path={`${base}`} element={<App />} />
      <Route path={`${base}/${PAMELDING_PAGE}`} element={<Pamelding />} />
      <Route path={`${base}/${DELTAKELSE_PAGE}`} element={<Delakelse />} />
      <Route path={`${base}/*`} element={<Navigate replace to={`${base}`} />} />
      {import.meta.env.DEV && (
        <Route
          path={'/'}
          element={<Navigate replace to={base.replace(':id', deltakerlisteId)} />}
        />
      )}
    </Routes>
  )
}
