import appCss from './app.css?inline'
import { createRoot } from 'react-dom/client'
import { APPLICATION_WEB_COMPONENT_NAME } from './constants.ts'
import { AppContextProvider } from './AppContext.tsx'
import { AppRoutes } from './Routes.tsx'
import { BrowserRouter } from 'react-router-dom'

export class Deltaker extends HTMLElement {
  private readonly root: HTMLDivElement
  static PERSONIDENT_PROP = 'data-personident'
  static DELTAKERLISTE_ID_PROP = 'data-deltakerlisteId'
  static ENHET_ID_PROP = 'data-enhetId'

  setPersonident?: (personident: string) => void
  setDeltakelisteId?: (fndeltakerlisteIdr: string) => void
  setEnhetId?: (enhetIdr: string) => void

  // Invoked when the element is created
  constructor() {
    // eslint-disable-next-line no-console
    console.log(`here!, ${window.location.pathname}`) // TODO REMOVE

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

    const initialPersonident = this.getAttribute(Deltaker.PERSONIDENT_PROP) ?? ''
    const initialEnhetId = this.getAttribute(Deltaker.ENHET_ID_PROP) ?? ''

    const root = createRoot(this.root)
    root.render(
      <div className="max-w-[1252px] m-auto">
        <AppContextProvider
          initialPersonident={initialPersonident}
          initialEnhetId={initialEnhetId}
        >
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppContextProvider>
      </div>
    )
  }

  // Invoked when one of the custom element's attributes is added, removed, or changed.
  // @ts-expect-error no-unused-variable
  attributeChangedCallback(name: string, oldVal: string, newValue: string) {
    if (name === Deltaker.PERSONIDENT_PROP && this.setPersonident) {
      this.setPersonident(newValue)
    } else if (name === Deltaker.DELTAKERLISTE_ID_PROP && this.setDeltakelisteId) {
      this.setDeltakelisteId(newValue)
    }
  }

  // to get the attributeChangedCallback() callback to fire when an attribute changes, you have to observe the attributes
  static get observedAttributes() {
    return [Deltaker.PERSONIDENT_PROP, Deltaker.DELTAKERLISTE_ID_PROP]
  }
}

// Repoer for inspirasjon:
// https://github.com/navikt/aktivitetsplan/tree/main
// https://github.com/navikt/mulighetsrommet/tree/main/frontend/mulighetsrommet-veileder-flate
