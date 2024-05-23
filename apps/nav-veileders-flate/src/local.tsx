import { APPLICATION_WEB_COMPONENT_NAME } from './constants.ts'
import { worker } from './mocks/setupMocks.ts'
import { useMock } from './utils/environment-utils.ts'
import ReactDOM from 'react-dom/client'
import React from 'react'
import './app.css'
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

const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)

  rootElement.render(
    React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
      'data-personident': '29418716256',
      'data-deltakerlisteId': '3fcac2a6-68cf-464e-8dd1-62ccec5933df',
      'data-enhetId': '0106'
    })
  )
}

enableMocking().then(() => {
  renderAsReactRoot(document.getElementById('root')!)
})
