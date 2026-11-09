import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AlertInfoMessage } from './AlertInfoMessage'

describe('AlertInfoMessage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stays disabled and renders nothing', () => {
    expect(renderToStaticMarkup(<AlertInfoMessage />)).toBe('')
  })
})
