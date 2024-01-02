import {APPLICATION_NAME, APPLICATION_WEB_COMPONENT_NAME} from './constants'
import {worker} from './mocks/setupMocks.ts'
import {EndpointHandler, getEndpointHandlerType} from './utils/environment-utils.ts'

const exportAsWebcomponent = () => {
  // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
  import('./webComponentWrapper').then(({Deltaker}) => {
    customElements.define(APPLICATION_WEB_COMPONENT_NAME, Deltaker)
  })
}

/**
 * Applikasjonen blir lastet inn i 'mulighetsrommet-veileder-flate' i `veilarbpersonflate` i dev og prod ved at vi definerer et
 * custom HTMLElement med navnet `APPLICATION_WEB_COMPONENT_NAME` (Web Component).
 * Dette lar oss enkapsulere stylingen til applikasjonen slik at vi slipper css-bleed på
 * tvers av applikasjoner i `veilarbpersonflate`.
 */
exportAsWebcomponent()

export async function enableMocking() {
  const enpointHandlerType = getEndpointHandlerType()

  if (enpointHandlerType === EndpointHandler.MOCK) {
    const url = import.meta.env.VITE_MOCK_SERVICE_RUNNER_PATH || '/mockServiceWorker.js'
    return worker.start({
      serviceWorker: {
        url: url
      }
    })
  }
}

// Lokalt:
/**
 * Når vi kjører applikasjonen lokalt, demo-app eller pr-deploy sjekker vi eksplisitt om det finnes et html element med navnet
 * `APPLICATION_NAME` før vi rendrer applikasjonen fordi dette elementet er definert i `index.html`
 * (men ikke i `veilarbpersonflate`).
 */
if (import.meta.env.DEV) {
  const demoContainer = document.getElementById(APPLICATION_NAME)
  if (!demoContainer) {
    throw new Error('Root Element not found')
  }

  import('./LocalAppWrapper.tsx').then(({ renderAsReactRoot }) => {
    enableMocking().then(() => {
      renderAsReactRoot(demoContainer)
    })
  })
}
