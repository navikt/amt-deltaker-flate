import { describe, expect, it } from 'vitest'
import { createAmtDeltakerBffBaseUrl } from './api-url'

describe('createAmtDeltakerBffBaseUrl', () => {
  it('includes the app base path for GitHub Pages', () => {
    expect(
      createAmtDeltakerBffBaseUrl(
        '/amt-deltaker-flate/tiltakskoordinator-flate/'
      )
    ).toBe('/amt-deltaker-flate/tiltakskoordinator-flate/amt-deltaker-bff')
  })

  it('uses the root path when the app is served from the domain root', () => {
    expect(createAmtDeltakerBffBaseUrl('/')).toBe('/amt-deltaker-bff')
  })
})
