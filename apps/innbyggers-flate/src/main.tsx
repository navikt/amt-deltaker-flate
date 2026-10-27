import { init } from '@nais/apm'
import { withFaroErrorBoundary } from '@grafana/faro-react'
import {
  ErrorFallback,
  faroBeforeSend,
  resolveFaroEnvironment
} from 'deltaker-flate-common'
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './Routes.tsx'
import './index.css'
import { useMock } from './utils/environment-utils.ts'
import { createRoot } from 'react-dom/client'

const AppWithErrorBoundary = withFaroErrorBoundary(
  () => (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  ),
  { fallback: <ErrorFallback /> }
)

const renderApp = () => {
  // list of parameters and default values: https://github.com/navikt/nav-dekoratoren?tab=readme-ov-file#parametere
  if (import.meta.env.MODE !== 'offline') {
    void injectDecoratorClientSide({
      env: import.meta.env.MODE === 'production' ? 'prod' : 'dev',
      params: {
        level: 'Level4',
        logoutWarning: true,
        teamName: 'amt-deltaker-innbyggers-flate.amt'
      }
    })
  }

  const container = document.getElementById('root')
  const root = createRoot(container!)

  root.render(
    <React.StrictMode>
      <AppWithErrorBoundary />
    </React.StrictMode>
  )
}

async function enableMocking() {
  if (!useMock) {
    return
  }

  const { worker } = await import('./mocks/setupMocks')

  return worker.start({
    onUnhandledFrame: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
    }
  })
}

const faroEnvironment = resolveFaroEnvironment(
  import.meta.env.MODE,
  import.meta.env.VITE_FARO_URL
)

if (faroEnvironment) {
  init({
    app: 'amt-deltaker-innbyggers-flate',
    namespace: 'amt',
    version: import.meta.env.VITE_APP_VERSION || 'local',
    environment: faroEnvironment,
    telemetryUrl: import.meta.env.VITE_FARO_URL,
    faro: { isolate: true },
    beforeSend: faroBeforeSend
  })
}

declare const window: {
  __appInitialized?: boolean
} & Window

if (import.meta.env.MODE === 'offline') {
  // Lagt til flagg fordi appen ellers har en tendens til å rendres to ganger
  // "oppå hverandre" i containerelementet. Treffer ingen eksterne miljøer
  // eller produksjon.
  const browserWindow = window
  if (!browserWindow.__appInitialized) {
    browserWindow.__appInitialized = true
    renderApp()
  }
} else {
  enableMocking().then(renderApp)
}
