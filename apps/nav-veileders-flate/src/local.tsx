import { worker } from './mocks/setupMocks.ts'
import { useMock } from './utils/environment-utils.ts'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './app.css'
import './webComponentWrapper.tsx'
import { AppContextProvider } from './AppContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './Routes.tsx'

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
  /*  TEST webcomponent lokalt:

const renderAsReactRoot = () => {
  const container = document.getElementById('root')
  const rootElement = createRoot(container!)

  rootElement.render(
    React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
      'data-personident': '29418716256',
      'data-deltakerlisteId': '3fcac2a6-68cf-464e-8dd1-62ccec5933df',
      'data-enhetId': '0106'
    })
  )
  */

  const container = document.getElementById('root')
  const root = createRoot(container!)

  root.render(
    <React.StrictMode>
      <div className="m-auto pt-4 min-h-screen deltakelse-wrapper">
        <AppContextProvider
          initialPersonident={'29418716256'}
          initialEnhetId={'0106'}
        >
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppContextProvider>
      </div>
    </React.StrictMode>
  )
}

enableMocking().then(() => {
  // renderAsReactRoot()
  renderAsReactRoot()
})
