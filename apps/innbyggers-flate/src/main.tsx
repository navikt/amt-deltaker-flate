import React from 'react'
import ReactDOM from 'react-dom/client'
import { worker } from './mocks/setupMocks.ts'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { EndpointHandler, getEndpointHandlerType, isEnvLocalDemoOrPr } from './utils/environment-utils.ts'
import { AppRoutes } from './Routes.tsx'

export async function enableMocking() {
  const endpointHandlerType = getEndpointHandlerType()

  if (endpointHandlerType === EndpointHandler.MOCK) {
    const url = import.meta.env.VITE_MOCK_SERVICE_RUNNER_PATH || '/mockServiceWorker.js'

    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url
      }
    })
  }
}

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </React.StrictMode>
  )
}

if (isEnvLocalDemoOrPr) {
  enableMocking().then(() => {
    renderApp()
  })
} else {
  renderApp()
}

