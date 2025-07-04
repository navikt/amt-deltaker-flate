import { initializeFaro } from '@grafana/faro-web-sdk'
import { createRoot, Root } from 'react-dom/client'
import appCss from './app.css?inline'
import { App } from './App.tsx'
import { AppContextProvider } from './context-providers/AppContext.tsx'
import { ShadowDomContext } from './context-providers/ShadowDomContext.tsx'
import {
  APPLICATION_NAME,
  APPLICATION_WEB_COMPONENT_NAME
} from './utils/constants.ts'

if (import.meta.env.VITE_FARO_URL) {
  initializeFaro({
    url: import.meta.env.VITE_FARO_URL,
    app: {
      name: APPLICATION_NAME
    },
    isolate: true
  })
}

export class Deltakerliste extends HTMLElement {
  static DELTAKERLISTE_ID_PROP = 'gjennomforingid'

  private readonly root: HTMLDivElement
  private reactRoot?: Root

  setDeltakelisteId?: (fndeltakerlisteIdr: string) => void

  // Invoked when the element is created
  constructor() {
    super()

    // This will be app entry point
    this.root = document.createElement('div')
    this.root.id = APPLICATION_WEB_COMPONENT_NAME
  }

  // Invoked each time after the element is attached to the DOM
  connectedCallback() {
    // Shadow DOM allows us to encapsulate parts of the HTML and isolates the CSS and Javascript code with it,
    const shadowRoot = this.attachShadow({ mode: 'closed' })
    shadowRoot.appendChild(this.root)

    // Load styles under this shadowDom-node, not root element
    const styleElem = document.createElement('style')
    styleElem.innerHTML = appCss
    shadowRoot.appendChild(styleElem)

    const deltakerlisteId =
      this.getAttribute(Deltakerliste.DELTAKERLISTE_ID_PROP) ?? ''

    this.reactRoot = createRoot(this.root)
    this.reactRoot.render(
      <ShadowDomContext.Provider
        value={{ shadowRoot, containerElement: this.root }}
      >
        <div className="m-auto pt-4 min-h-screen max-w-[1920px]">
          <AppContextProvider initialDeltakerlisteId={deltakerlisteId}>
            <App />
          </AppContextProvider>
        </div>
      </ShadowDomContext.Provider>
    )
  }

  disconnectedCallback() {
    this.reactRoot?.unmount()
  }

  // Invoked when one of the custom element's attributes is added, removed, or changed.
  // @ts-expect-error no-unused-variable
  attributeChangedCallback(name: string, oldVal: string, newValue: string) {
    if (
      name === Deltakerliste.DELTAKERLISTE_ID_PROP &&
      this.setDeltakelisteId
    ) {
      this.setDeltakelisteId(newValue)
    }
  }

  // to get the attributeChangedCallback() callback to fire when an attribute changes, you have to observe the attributes
  static get observedAttributes() {
    return [Deltakerliste.DELTAKERLISTE_ID_PROP]
  }
}

// Repoer for inspirasjon:
// https://github.com/navikt/aktivitetsplan/tree/main
// https://github.com/navikt/mulighetsrommet/tree/main/frontend/mulighetsrommet-veileder-flate

customElements.define(APPLICATION_WEB_COMPONENT_NAME, Deltakerliste)
