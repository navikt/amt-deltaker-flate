import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { LabelValue } from './LabelValue'

describe('LabelValue', () => {
  it('renders an array of child nodes', () => {
    const markup = renderToStaticMarkup(
      <LabelValue title="Status">
        {['Aktiv', <span key="period"> nå</span>, 2]}
      </LabelValue>
    )

    expect(markup).toContain('Aktiv')
    expect(markup).toContain('nå')
    expect(markup).toContain('2')
  })
})
