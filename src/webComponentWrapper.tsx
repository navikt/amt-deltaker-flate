import dsStyles from '@navikt/ds-css/dist/index.css?inline'
import App from './App'
import { createRoot } from 'react-dom/client'
import { APPLICATION_WEB_COMPONENT_NAME } from './constants'

export class Deltaker extends HTMLElement {
  private readonly root: HTMLDivElement

  constructor() {
    super()

    // This will be app entry point
    this.root = document.createElement('div')
    this.root.id = APPLICATION_WEB_COMPONENT_NAME
  }

  connectedCallback() {
    // Shadow DOM allows us to encapsulate parts of the HTML and isolates the CSS and Javascript code with it,
    const shadowRoot = this.attachShadow({ mode: 'closed' })
    shadowRoot.appendChild(this.root)

    // Load styles under this shadowDom-node, not root element
    const styleElem = document.createElement('style')
    styleElem.innerHTML = dsStyles
    shadowRoot.appendChild(styleElem)

    const root = createRoot(this.root)
    root.render(<App />)
  }
}
