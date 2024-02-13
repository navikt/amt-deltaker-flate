import ReactDOM from 'react-dom/client'
import React from 'react'
import { APPLICATION_WEB_COMPONENT_NAME } from './constants.ts'
import './app.css'
import './index.css'

const renderWebComponent = (personident: string, deltakerlisteId: string, enhetId: string) => {
  return React.createElement(APPLICATION_WEB_COMPONENT_NAME, {
    'data-personident': personident,
    'data-deltakerlisteId': deltakerlisteId,
    'data-enhetId': enhetId
  })
}

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)

  rootElement.render(
    renderWebComponent('29418716256', '3fcac2a6-68cf-464e-8dd1-62ccec5933df', '0106')
  )
}
