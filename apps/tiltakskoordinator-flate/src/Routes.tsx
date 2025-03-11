import { Navigate, Route, Routes } from 'react-router-dom'
import { DeltakerListePageWrapper } from './DeltakerListePageWrapper.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
import { DeltakerPage } from './pages/DeltakerPage.tsx'
import { APP_ROUTE, DELTAKER_ROUTE } from './navigation.ts'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={APP_ROUTE} element={<DeltakerListePageWrapper />} />
      <Route path={DELTAKER_ROUTE} element={<DeltakerPage />} />
      {isPrEnv && <Route path={'/*'} element={<DeltakerListePageWrapper />} />}
      {useMock && (
        <Route
          path={'/*'}
          element={
            <Navigate replace to={'/gjennomforinger/d48/deltakerliste'} />
          }
        />
      )}
      {
        // TODO redirect to valp gjennomforinger
        // !isEnvLocalDemoOrPr &&
        // <Route path={'/*'} element={<RedirectToDeltakeroversikt />} />
      }
    </Routes>
  )
}
