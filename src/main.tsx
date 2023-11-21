import { APPLICATION_NAME, APPLICATION_WEB_COMPONENT_NAME } from './constants'
import { worker } from './mocks/setupMocks.ts'

const exportAsWebcomponent = () => {
  // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
  import('./webComponentWrapper').then(({ Deltaker }) => {
    customElements.define(APPLICATION_WEB_COMPONENT_NAME, Deltaker)
  })
}

export async function enableMocking() {
  // if (process.env.NODE_ENV !== 'development') { // TODO Enable mocking only for specific environments
  //     return
  // }
  return worker.start()
}

const renderAsRootApp = (appElement: HTMLElement) => {
  import('./rootWrapper').then(({ renderAsReactRoot }) => {
    enableMocking().then(() => {
      renderAsReactRoot(appElement)
    })
  })
}

/**
 * Applikasjonen blir lastet inn i 'mulighetsrommet-veileder-flate' i `veilarbpersonflate` i dev og prod ved at vi definerer et
 * custom HTMLElement med navnet `APPLICATION_WEB_COMPONENT_NAME` (Web Component).
 * Dette lar oss enkapsulere stylingen til applikasjonen slik at vi slipper css-bleed på
 * tvers av applikasjoner i `veilarbpersonflate`.
 *
 * Når vi kjører applikasjonen lokalt sjekker vi eksplisitt om det finnes et html element med navnet
 * `APPLICATION_NAME` før vi rendrer applikasjonen fordi dette elementet er definert i `index.html`
 * (men ikke i `veilarbpersonflate`).
 */
const demoContainer = document.getElementById(APPLICATION_NAME)
// Lokalt:
if (import.meta.env.DEV && demoContainer) {
  renderAsRootApp(demoContainer)
  /*
  // TESTE WEB COMPONENT LOKALT:
  enableMocking().then(() => exportAsWebcomponent())
  const root = ReactDOM.createRoot(demoContainer)
  root.render(React.createElement(APPLICATION_WEB_COMPONENT_NAME))
  */
} else {
  exportAsWebcomponent()
}
