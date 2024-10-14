import { Navigate, Route, Routes } from 'react-router-dom'
import {
  isEnvLocalDemoOrPr,
  isPrEnv,
  useMock
} from './utils/environment-utils.ts'
import InngangSePaRediger from './InngangSePaRediger.tsx'
import InngangMeldPa from './InngangMeldPa.tsx'
import RedirectToDeltakeroversikt from './guards/RedirectToDeltakeroversikt.tsx'
import InngangPrEnv from './InngangPrEnv.tsx'
import './utils/useConsoleLogs.ts'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={'/arbeidsmarkedstiltak/deltakelse/deltaker/:deltakerId'}
        element={<InngangSePaRediger />}
      />
      <Route
        path={'/arbeidsmarkedstiltak/deltakelse/:deltakerlisteId'}
        element={<InngangMeldPa />}
      />
      {!isEnvLocalDemoOrPr && (
        <Route path={'/*'} element={<RedirectToDeltakeroversikt />} />
      )}
      {useMock && (
        <Route
          path={'/*'}
          element={
            <Navigate
              replace
              to={
                '/arbeidsmarkedstiltak/deltakelse/15462eb2-9fb0-4e37-b749-fe71a9af8d48'
              }
            />
          }
        />
      )}
      {isPrEnv && <Route path={'/*'} element={<InngangPrEnv />} />}
    </Routes>
  )
}
