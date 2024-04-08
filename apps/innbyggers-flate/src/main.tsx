import React from 'react'
import ReactDOM from 'react-dom/client'
import { worker } from './mocks/setupMocks.ts'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { useMock } from './utils/environment-utils.ts'
import { AppRoutes } from './Routes.tsx'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import { Page } from '@navikt/ds-react'

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

const renderApp = async () => {
  const Decorator = await fetchDecoratorReact({
    env: 'dev'
  })

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Page footer={<Decorator.Footer />}>
        <Decorator.Header />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Decorator.Scripts />
      </Page>
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
