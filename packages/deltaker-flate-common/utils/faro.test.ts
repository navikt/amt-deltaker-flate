import { describe, it, expect } from 'vitest'
import { faroBeforeSend, resolveFaroEnvironment } from './faro'

describe('resolveFaroEnvironment', () => {
  it('returnerer prod-gcp for production med produksjonscollector', () => {
    expect(
      resolveFaroEnvironment('production', 'https://telemetry.nav.no/collect')
    ).toBe('prod-gcp')
  })

  it('returnerer dev-gcp for dev med utviklingscollector', () => {
    expect(
      resolveFaroEnvironment(
        'dev',
        'https://telemetry.ekstern.dev.nav.no/collect'
      )
    ).toBe('dev-gcp')
  })

  it.each(['demo', 'pull-request', 'development', 'offline'])(
    'deaktiverer Faro for mode %s',
    (mode) => {
      expect(
        resolveFaroEnvironment(
          mode,
          'https://telemetry.ekstern.dev.nav.no/collect'
        )
      ).toBeUndefined()
    }
  )

  it('deaktiverer Faro når collector ikke matcher mode', () => {
    expect(
      resolveFaroEnvironment(
        'production',
        'https://telemetry.ekstern.dev.nav.no/collect'
      )
    ).toBeUndefined()
  })

  it('deaktiverer Faro når collector mangler', () => {
    expect(resolveFaroEnvironment('production')).toBeUndefined()
  })

  it('deaktiverer Faro når både mode og collector er ukjent', () => {
    expect(resolveFaroEnvironment('development')).toBeUndefined()
  })
})

describe('faroBeforeSend', () => {
  it('fjerner query-parametere og fragment fra meta.page.url', () => {
    const item = {
      meta: {
        page: {
          url: 'https://nav.no/deltaker?user=abc&code=123#access_token=secret'
        }
      }
    }
    const result = faroBeforeSend(item)
    expect(result?.meta?.page?.url).toBe('https://nav.no/deltaker')
  })

  it('beholder url uten query-parametere uendret', () => {
    const item = {
      meta: { page: { url: 'https://nav.no/deltaker' } }
    }
    const result = faroBeforeSend(item)
    expect(result?.meta?.page?.url).toBe('https://nav.no/deltaker')
  })

  it('dropper item som inneholder 11-sifret mønster (fødselsnummer)', () => {
    const item = {
      meta: { page: { url: 'https://nav.no/deltaker' } },
      payload: { message: 'Feil for bruker 12345678901' }
    }
    const result = faroBeforeSend(item)
    expect(result).toBeNull()
  })

  it('dropper item med fødselsnummer i url', () => {
    const item = {
      meta: { page: { url: 'https://nav.no/deltaker/12345678901' } }
    }
    const result = faroBeforeSend(item)
    expect(result).toBeNull()
  })

  it('slipper gjennom Web Vitals-ID med 13-sifrede tekniske verdier', () => {
    const item = {
      type: 'measurement',
      payload: {
        type: 'web-vitals',
        context: {
          id: 'v6-1793107345361-1234567890123'
        }
      },
      meta: {}
    }
    const result = faroBeforeSend(item)
    expect(result).toEqual(item)
  })

  it('slipper gjennom item uten fødselsnummer', () => {
    const item = {
      meta: { page: { url: 'https://nav.no/deltaker' } },
      payload: { message: 'Alt ok' }
    }
    const result = faroBeforeSend(item)
    expect(result).not.toBeNull()
  })

  it('håndterer item uten meta', () => {
    const item = {}
    const result = faroBeforeSend(item)
    expect(result).toEqual(item)
  })

  it('håndterer item uten page', () => {
    const item = { meta: {} }
    const result = faroBeforeSend(item)
    expect(result).toEqual(item)
  })

  it('håndterer item uten url', () => {
    const item = { meta: { page: {} } }
    const result = faroBeforeSend(item)
    expect(result).toEqual(item)
  })

  it('håndterer ugyldig url uten å krasje', () => {
    const item = { meta: { page: { url: 'ikke-en-url' } } }
    const result = faroBeforeSend(item)
    expect(result).not.toBeNull()
  })
})
