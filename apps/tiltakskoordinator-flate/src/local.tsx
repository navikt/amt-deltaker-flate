import React from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import { App } from './App.tsx'
import { AppContextProvider } from './context-providers/AppContext.tsx'
import { worker } from './mocks/setupMocks.ts'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
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
      <AppContextProvider initialDeltakerlisteId={isPrEnv ? '' : 'abs'}>
        <div className="m-auto max-w-[1920px]">
          <App />
        </div>
      </AppContextProvider>
    </React.StrictMode>
  )
}

enableMocking().then(() => {
  renderAsReactRoot()
})
