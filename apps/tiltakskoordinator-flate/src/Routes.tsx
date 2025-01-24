import { Navigate, Route, Routes } from 'react-router-dom'
import { App } from './App.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'

const APP_ROUTE = `${import.meta.env.BASE_URL}/gjennomforinger/:deltakerlisteId/deltakerliste`

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={APP_ROUTE} element={<App />} />
      {isPrEnv && <Route path={'/*'} element={<App />} />}
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
