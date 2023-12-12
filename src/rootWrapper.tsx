import ReactDOM from 'react-dom/client'

import '@navikt/ds-css'
import './tailwind.css'
import './index.css'
import LocalWebComponentWrapper from './localWebComponentWrapper.tsx'

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)

  rootElement.render(<LocalWebComponentWrapper/>)
}
