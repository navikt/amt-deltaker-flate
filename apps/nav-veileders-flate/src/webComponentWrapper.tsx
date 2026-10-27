import { init } from '@nais/apm'
import { withFaroErrorBoundary } from '@grafana/faro-react'
import {
  faroBeforeSend,
  ErrorFallback,
  resolveFaroEnvironment
} from 'deltaker-flate-common'
import { createRoot, Root } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import appCss from './app.css?inline'
import { AppContextProvider } from './AppContext.tsx'
import { APPLICATION_WEB_COMPONENT_NAME } from './constants.ts'
import { AppRoutes } from './Routes.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'

const FaroBoundary = withFaroErrorBoundary(
  ({ children }: { children: ReactNode }) => <>{children}</>,
  { fallback: <ErrorFallback /> }
)

const faroEnvironment = resolveFaroEnvironment(
  import.meta.env.MODE,
  import.meta.env.VITE_FARO_URL
)

if (faroEnvironment) {
  init({
    app: 'amt-deltaker-flate',
    namespace: 'amt',
    version: import.meta.env.VITE_APP_VERSION || 'local',
    environment: faroEnvironment,
    telemetryUrl: import.meta.env.VITE_FARO_URL,
    faro: { isolate: true },
    beforeSend: faroBeforeSend
  })
}

export class Deltaker extends HTMLElement {
  static PERSONIDENT_PROP = 'data-personident'
  static DELTAKERLISTE_ID_PROP = 'data-deltakerlisteId'
  static ENHET_ID_PROP = 'data-enhetId'

  private readonly root: HTMLDivElement
  private reactRoot?: Root

  setPersonident?: (personident: string) => void
  setDeltakelisteId?: (fndeltakerlisteIdr: string) => void

  // Invoked when the element is created
  constructor() {
    super()

    // This will be app entry point
    this.root = document.createElement('div')
    this.root.id = APPLICATION_WEB_COMPONENT_NAME
  }

  // Invoked each time after the element is attached to the DOM
  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    // Shadow DOM allows us to encapsulate parts of the HTML and isolates the CSS and Javascript code with it,
    const shadowRoot = this.attachShadow({ mode: 'closed' })
    shadowRoot.appendChild(this.root)

    // Load styles under this shadowDom-node, not root element
    const styleElem = document.createElement('style')
    styleElem.innerHTML = appCss
    shadowRoot.appendChild(styleElem)

    const initialPersonident =
      this.getAttribute(Deltaker.PERSONIDENT_PROP) ?? ''
    const initialEnhetId = this.getAttribute(Deltaker.ENHET_ID_PROP) ?? ''

    this.reactRoot = createRoot(this.root)
    this.reactRoot.render(
      <FaroBoundary>
        <div className="m-auto pt-4 min-h-screen deltakelse-wrapper">
          <AppContextProvider
            initialPersonident={initialPersonident}
            initialEnhetId={initialEnhetId}
          >
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <AppRoutes />
              </QueryClientProvider>
            </BrowserRouter>
          </AppContextProvider>
        </div>
      </FaroBoundary>
    )
  }

  // noinspection JSUnusedGlobalSymbols
  disconnectedCallback() {
    this.reactRoot?.unmount()
  }

  // Invoked when one of the custom element's attributes is added, removed, or changed.
  // @ts-expect-error no-unused-variable
  // noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
  attributeChangedCallback(name: string, oldVal: string, newValue: string) {
    if (name === Deltaker.PERSONIDENT_PROP && this.setPersonident) {
      this.setPersonident(newValue)
    } else if (
      name === Deltaker.DELTAKERLISTE_ID_PROP &&
      this.setDeltakelisteId
    ) {
      this.setDeltakelisteId(newValue)
    }
  }

  // to get the attributeChangedCallback() callback to fire when an attribute changes, you have to observe the attributes
  // noinspection JSUnusedGlobalSymbols
  static get observedAttributes() {
    return [Deltaker.PERSONIDENT_PROP, Deltaker.DELTAKERLISTE_ID_PROP]
  }
}

// Repoer for inspirasjon:
// https://github.com/navikt/aktivitetsplan/tree/main
// https://github.com/navikt/mulighetsrommet/tree/main/frontend/mulighetsrommet-veileder-flate

if (!customElements.get(APPLICATION_WEB_COMPONENT_NAME)) {
  customElements.define(APPLICATION_WEB_COMPONENT_NAME, Deltaker)
}
