import { createContext, useContext } from 'react'

interface ShadowDomContextType {
  shadowRoot: ShadowRoot | null
  containerElement: HTMLElement | null
}

export const ShadowDomContext = createContext<ShadowDomContextType>({
  shadowRoot: null,
  containerElement: null
})

export const useShadowDom = () => {
  const context = useContext(ShadowDomContext)
  return context
}
