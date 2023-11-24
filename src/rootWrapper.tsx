import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import '@navikt/ds-css'
import './tailwind.css'
import './index.css'
import { AppContext } from './AppContext'

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)
  rootElement.render(
    <React.StrictMode>
      <AppContext
        personident={'12345678910'}
        deltakerlisteId={'6b6578eb-eae0-4ad7-8a69-79db3cea4f64'}
      >
        <App />
      </AppContext>
    </React.StrictMode>
  )
}
