import React from 'react'
import ReactDOM from 'react-dom/client'
import { worker } from './mocks/setupMocks.ts'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { isDev, isProd, useMock } from './utils/environment-utils.ts'
import { AppRoutes } from './Routes.tsx'
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler'

export async function enableMocking() {
  if (useMock) {
    const url =
      import.meta.env.VITE_MOCK_SERVICE_RUNNER_PATH || '/mockServiceWorker.js'

    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url
      }
    })
  }
}

// list of parameters and default values: https://github.com/navikt/nav-dekoratoren?tab=readme-ov-file#parametere
const setupNavDekorator = () => {
  return injectDecoratorClientSide({
    env: isProd() ? 'prod' : 'dev',
    params: {
      level: 'Level4',
      enforceLogin: true,
      logoutWarning: isProd() || isDev()
    }
  })
}

const renderApp = async () => {
  await setupNavDekorator()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>
  )
}

if (useMock) {
  enableMocking().then(() => {
    renderApp()
  })
} else {
  renderApp()
}
