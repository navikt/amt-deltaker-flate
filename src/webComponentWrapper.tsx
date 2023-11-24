import dsStyles from '@navikt/ds-css/dist/index.css?inline'
import tailwindCss from './tailwind.css?inline'
import App from './App'
import { createRoot } from 'react-dom/client'
import { APPLICATION_WEB_COMPONENT_NAME } from './constants'
import { AppContext } from './AppContext'

export class Deltaker extends HTMLElement {
  private readonly root: HTMLDivElement
  static PERSONIDENT_PROP = 'personident'
  static DELTAKERLISTE_ID_PROP = 'deltakerlisteId'

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
  connectedCallback() {
    // Shadow DOM allows us to encapsulate parts of the HTML and isolates the CSS and Javascript code with it,
    const shadowRoot = this.attachShadow({ mode: 'closed' })
    shadowRoot.appendChild(this.root)

    // Load styles under this shadowDom-node, not root element
    const styleElem = document.createElement('style')
    styleElem.innerHTML = dsStyles + tailwindCss
    shadowRoot.appendChild(styleElem)

    const personident = this.getAttribute(Deltaker.PERSONIDENT_PROP) ?? ''
    const deltakerlisteId = this.getAttribute(Deltaker.DELTAKERLISTE_ID_PROP) ?? ''

    const root = createRoot(this.root)
    root.render(
      <AppContext
        personident={personident}
        setPersonidentRef={(setPersonident) => (this.setPersonident = setPersonident)}
        deltakerlisteId={deltakerlisteId}
        setDeltakelisteIdRef={(setDeltakelisteId) => (this.setDeltakelisteId = setDeltakelisteId)}
      >
        <App />
      </AppContext>
    )
  }

  // Invoked when one of the custom element's attributes is added, removed, or changed.
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
