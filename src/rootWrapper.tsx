import ReactDOM from 'react-dom/client'
import App from './App'

import '@navikt/ds-css'
import './index.css'

export const renderAsReactRoot = (appElement: HTMLElement) => {
  const rootElement = ReactDOM.createRoot(appElement)
  rootElement.render(<App />)
}
