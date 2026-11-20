import { describe, expect, it } from 'vitest'

import { harDeltattMindreEnnFemtenDager } from './deltaker-utils'

describe('harDeltattMindreEnnFemtenDager', () => {
  it('returns false when the start date is missing', () => {
    expect(
      harDeltattMindreEnnFemtenDager({
        startDato: null,
        sluttDato: null
      })
    ).toBe(false)
  })
})
