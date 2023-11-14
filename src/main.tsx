import React from 'react'
import ReactDOM from 'react-dom/client'
import '@navikt/ds-css'
import './index.css'
import Mikrofrontend from './Mikrofrontend'
import {worker} from './mocks/setupMocks.ts'

export async function enableMocking() {
  // if (process.env.NODE_ENV !== 'development') { // TODO Enable mocking only for specific environments
  //     return
  // }
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <main>
        <Mikrofrontend/>
      </main>
    </React.StrictMode>
  )
})
