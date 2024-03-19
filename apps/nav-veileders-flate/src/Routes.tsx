import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import { SendTilbakePage } from './pages/SendTilbakePage.tsx'
import { isEnvLocalDemoOrPr } from './utils/environment-utils.ts'
import InngangSePaRediger from './InngangSePaRediger.tsx'
import InngangMeldPa from './InngangMeldPa.tsx'

const appUrl = (path: string): string => {
  const strippedPath = path.startsWith('/') ? path.substring(1) : path
  return `${import.meta.env.BASE_URL.replace(/^\//, '')}${strippedPath}`
}

export const base = appUrl('arbeidsmarkedstiltak/tiltak/:id/deltaker')
export const TILBAKE_PAGE = 'tilbake'

export const AppRoutes = () => {

  return (
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/tiltak/deltaker/:deltakerId'} element={<InngangSePaRediger />} />
      <Route path={'/tiltak/:deltakerlisteId'} element={<InngangMeldPa/>}/>
      <Route path={`/${TILBAKE_PAGE}`} element={<SendTilbakePage />} />
      <Route path={'/*'} element={<Navigate replace to={'/'} />} />
      {isEnvLocalDemoOrPr && (
        <>
          <Route path={'*'} element={<Navigate replace to={'/'} />} />
        </>
      )}
    </Routes>
  )
}
