import { initializeFaro } from '@grafana/faro-web-sdk'
import { FaroErrorBoundary } from '@grafana/faro-react'
import { faroBeforeSend } from 'deltaker-flate-common'
import { GlobalAlert } from '@navikt/ds-react'
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './Routes.tsx'
import './index.css'
import { useMock } from './utils/environment-utils.ts'
import { createRoot } from 'react-dom/client'

const renderApp = () => {
  // list of parameters and default values: https://github.com/navikt/nav-dekoratoren?tab=readme-ov-file#parametere
  injectDecoratorClientSide({
    env: import.meta.env.MODE === 'production' ? 'prod' : 'dev',
    params: {
      level: 'Level4',
      logoutWarning: true
    }
  })

  const container = document.getElementById('root')
  const root = createRoot(container!)

  root.render(
    <React.StrictMode>
      <FaroErrorBoundary
        fallback={
          <GlobalAlert status="error">
            <GlobalAlert.Header>
              <GlobalAlert.Title>Noe gikk galt</GlobalAlert.Title>
            </GlobalAlert.Header>
            <GlobalAlert.Content>
              Noe gikk galt. Prøv igjen senere.
            </GlobalAlert.Content>
          </GlobalAlert>
        }
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FaroErrorBoundary>
    </React.StrictMode>
  )
}

async function enableMocking() {
  if (!useMock) {
    return
  }

  const { worker } = await import('./mocks/setupMocks')

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
    }
  })
}

if (import.meta.env.VITE_FARO_URL) {
  initializeFaro({
    url: import.meta.env.VITE_FARO_URL,
    app: {
      name: 'amt-deltaker-innbyggers-flate',
      version: import.meta.env.VITE_APP_VERSION || 'local'
    },
    isolate: true,
    beforeSend: faroBeforeSend
  })
}

enableMocking().then(renderApp)
