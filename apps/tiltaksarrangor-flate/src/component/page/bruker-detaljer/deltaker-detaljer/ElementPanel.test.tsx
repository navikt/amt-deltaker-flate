import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ElementPanel } from './ElementPanel'

describe('ElementPanel', () => {
  it('renders text children', () => {
    const markup = renderToStaticMarkup(
      <ElementPanel tittel="Status">Aktiv</ElementPanel>
    )

    expect(markup).toContain('Status')
    expect(markup).toContain('Aktiv')
  })
})
