import {Navigate, Route, Routes} from 'react-router-dom'
import App from './App.tsx'
import {useAppContext} from './AppContext.tsx'
import {SendTilbakePage} from './pages/SendTilbakePage.tsx'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'

const appUrl = (path: string): string => {
  const strippedPath = path.startsWith('/') ? path.substring(1) : path
  return `${import.meta.env.BASE_URL.replace(/^\//, '')}${strippedPath}`
}

export const base = appUrl('arbeidsmarkedstiltak/tiltak/:id/deltaker')
export const PAMELDING_PAGE = 'pamelding'
export const DELTAKELSE_PAGE = 'deltaker'

export const TILBAKE_PAGE = 'tilbake'

export const AppRoutes = () => {
  const { deltakerlisteId } = useAppContext()

  return (
    <Routes>
      <Route path={`${base}`} element={<App />} />
      <Route path={`${base}/${TILBAKE_PAGE}`} element={<SendTilbakePage />} />
      <Route path={`${base}/*`} element={<Navigate replace to={`${base}`} />} />
      {isEnvLocalDemoOrPr && (
        <Route
          path={'/'}
          element={<Navigate replace to={base.replace(':id', deltakerlisteId)} />}
        />
      )}
    </Routes>
  )
}
