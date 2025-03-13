import { Navigate, Route, Routes } from 'react-router-dom'
import { DeltakerListeGuard } from './DeltakerListeGuard.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
import { DeltakerPage } from './pages/DeltakerPage.tsx'
import {
  APP_ROUTE,
  DELTAKER_ROUTE,
  DELTAKERLISTE_STENGT_ROUTE,
  getDeltakerlisteUrl,
  IKKE_TILGANG_TIL_DELTAKERLISTE_ROUTE,
  INNGANG_AD_GRUPPE_ROUTE
} from './navigation.ts'
import { IngenAdGruppePage } from './pages/IngenAdGruppePage.tsx'
import { StengtDeltakerlistePage } from './pages/StengtDeltakerlistePage.tsx'
import { IkkeTilgangTilDeltakerlistePage } from './pages/IkkeTilgangTilDeltakerlistePage.tsx'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={APP_ROUTE} element={<DeltakerListeGuard />} />
      <Route path={DELTAKER_ROUTE} element={<DeltakerPage />} />
      <Route path={INNGANG_AD_GRUPPE_ROUTE} element={<IngenAdGruppePage />} />
      <Route
        path={DELTAKERLISTE_STENGT_ROUTE}
        element={<StengtDeltakerlistePage />}
      />
      <Route
        path={IKKE_TILGANG_TIL_DELTAKERLISTE_ROUTE}
        element={<IkkeTilgangTilDeltakerlistePage />}
      />

      {isPrEnv && <Route path={'/*'} element={<DeltakerListeGuard />} />}
      {useMock && (
        <Route
          path={'/*'}
          element={<Navigate replace to={getDeltakerlisteUrl('d48')} />}
        />
      )}
    </Routes>
  )
}
