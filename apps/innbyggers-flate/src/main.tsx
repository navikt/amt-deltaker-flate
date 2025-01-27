import { initializeFaro } from '@grafana/faro-web-sdk'
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
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
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
      name: 'amt-deltaker-innbyggers-flate'
    },
    isolate: true
  })
}

enableMocking().then(renderApp)
