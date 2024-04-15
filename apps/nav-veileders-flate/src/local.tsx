import { APPLICATION_WEB_COMPONENT_NAME } from './constants.ts'
import { worker } from './mocks/setupMocks.ts'
import {
  EndpointHandler,
  getEndpointHandlerType
} from './utils/environment-utils.ts'
import ReactDOM from 'react-dom/client'
import React from 'react'
import './app.css'
import './webComponentWrapper.tsx'

export async function enableMocking() {
  const endpointHandlerType = getEndpointHandlerType()

  if (endpointHandlerType === EndpointHandler.MOCK) {
    const url =
      import.meta.env.VITE_MOCK_SERVICE_RUNNER_PATH || '/mockServiceWorker.js'
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: url
      }
    })
  }
}

const renderWebComponent = (
  personident: string,
  deltakerlisteId: string,
  enhetId: string
) => {
  return React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
    'data-personident': personident,
    'data-deltakerlisteId': deltakerlisteId,
    'data-enhetId': enhetId
  })
}

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)

  rootElement.render(
    renderWebComponent(
      '29418716256',
      '3fcac2a6-68cf-464e-8dd1-62ccec5933df',
      '0106'
    )
  )
}

enableMocking().then(() => {
  renderAsReactRoot(document.getElementById('root')!)
})
