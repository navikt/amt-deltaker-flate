import { describe, it, expect } from 'vitest'
import { faroBeforeSend } from './faro'

describe('faroBeforeSend', () => {
  it('fjerner query-parametere fra meta.page.url', () => {
    const item = {
      meta: { page: { url: 'https://nav.no/deltaker?user=abc&code=123' } }
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
