import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './app.css'
import { AppContextProvider } from './AppContext.tsx'
import { worker } from './mocks/setupMocks.ts'
import { AppRoutes } from './Routes.tsx'
import { useMock } from './utils/environment-utils.ts'
import './webComponentWrapper.tsx'

export async function enableMocking() {
  if (useMock) {
    const url = `${import.meta.env.BASE_URL}mockServiceWorker.js`
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: url
      }
    })
  }
}

const renderAsReactRoot = () => {
  const container = document.getElementById('root')
  const root = createRoot(container!)

  root.render(
    <React.StrictMode>
      <AppContextProvider initialDeltakerlisteId={''}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppContextProvider>
    </React.StrictMode>
  )
}

enableMocking().then(() => {
  renderAsReactRoot()
})
