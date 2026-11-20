import { afterEach, describe, expect, it, vi } from 'vitest'
import environment from './environment'

afterEach(() => vi.unstubAllGlobals())

describe('Demomiljø', () => {
  it.each([
    ['navikt.github.io', true],
    ['other.github.io', false],
    ['notgithub.io', false],
    ['navikt.github.io.example.com', false],
    ['localhost', false],
    ['www.nav.no', false]
  ])('gjenkjenner %s som demo: %s', (hostname, expected) => {
    vi.stubGlobal('window', { location: { hostname } })
    expect(environment.isDemo).toBe(expected)
  })
})
