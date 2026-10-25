import './index.scss'

import { initializeFaro } from '@grafana/faro-web-sdk'
import { withFaroErrorBoundary } from '@grafana/faro-react'
import { faroBeforeSend } from 'deltaker-flate-common'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { DemoBanner } from './component/felles/demo-banner/DemoBanner'
import { ErrorPage } from './component/page/error/ErrorPage'
import StoreProvider from './store/store-provider'
import env from './utils/environment'
import { setupNavDekorator } from './utils/nav-dekorator'
import { enableMocking } from './mock/setupMocks'

const FaroBoundary = withFaroErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  { fallback: <ErrorPage /> }
)

dayjs.locale(nb)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Europe/Oslo')

if (import.meta.env.VITE_FARO_URL) {
  initializeFaro({
    url: import.meta.env.VITE_FARO_URL,
    app: {
      name: 'amt-tiltaksarrangor-flate',
      namespace: 'amt',
      version: import.meta.env.VITE_APP_VERSION || 'local'
    },
    isolate: true,
    beforeSend: (item) => (item.type === 'log' ? null : faroBeforeSend(item))
  })
}

await setupNavDekorator()

const renderAsReactRoot = () => {
  const container = document.getElementById('root')
  const root = createRoot(container!)

  root.render(
    <React.StrictMode>
      <FaroBoundary>
        <StoreProvider>
          {env.isDemo && <DemoBanner />}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StoreProvider>
      </FaroBoundary>
    </React.StrictMode>
  )
}

enableMocking().then(() => {
  renderAsReactRoot()
})
