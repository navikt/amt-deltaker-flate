import React from 'react'
import ReactDOM from 'react-dom/client'
import '@navikt/ds-css'
import './index.css'
import Mikrofrontend from './Mikrofrontend'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <main>
      <Mikrofrontend />
    </main>
  </React.StrictMode>
)
