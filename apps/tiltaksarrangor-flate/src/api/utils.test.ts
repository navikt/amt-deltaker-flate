import { afterEach, describe, expect, it, vi } from 'vitest'
import { logAndThrowError } from './utils'

afterEach(() => vi.restoreAllMocks())

describe('logAndThrowError', () => {
  it('logs a safe endpoint and request details without logging the URL or body', () => {
    const error = {
      isAxiosError: true,
      config: {
        method: 'post',
        url: '/private-id?token=private-token',
        data: 'sensitive free-text justification'
      },
      code: 'ERR_NETWORK',
      response: { status: 500 }
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let thrownError: unknown

    try {
      logAndThrowError(error, 'deltakerVurdering')
    } catch (thrown) {
      thrownError = thrown
    }

    expect(thrownError).toBe(error)
    expect(consoleError).toHaveBeenCalledWith('Request failed', {
      endpoint: 'deltakerVurdering',
      method: 'POST',
      httpStatus: 500,
      errorCode: 'ERR_NETWORK'
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'sensitive free-text justification'
    )
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('private-id')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'private-token'
    )
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('/private-id')
  })

  it('does not log unknown Axios error codes', () => {
    const error = {
      isAxiosError: true,
      code: 'private-id'
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let thrownError: unknown

    try {
      logAndThrowError(error, 'deltaker')
    } catch (thrown) {
      thrownError = thrown
    }

    expect(thrownError).toBe(error)
    expect(consoleError).toHaveBeenCalledWith('Request failed', {
      endpoint: 'deltaker',
      method: undefined,
      httpStatus: undefined,
      errorCode: undefined
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('private-id')
  })

  it('logs valid team IDs and allowlisted operations without logging the request', () => {
    const deltakerId = '04aba3db-2085-4af1-b707-06e842193d83'
    const forslagId = '752dba59-655c-47fa-9127-47e19a0e6d26'
    const error = {
      isAxiosError: true,
      config: {
        method: 'post',
        url: `/deltaker/${deltakerId}/forslag/${forslagId}?secret=private`,
        data: { begrunnelse: 'private justification' }
      },
      response: { status: 400, data: 'private response' }
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      logAndThrowError(error, 'tilbakekallForslag', {
        deltakerId,
        forslagId,
        operation: 'forleng'
      })
    ).toThrow(error)

    expect(consoleError).toHaveBeenCalledWith('Request failed', {
      endpoint: 'tilbakekallForslag',
      method: 'POST',
      httpStatus: 400,
      errorCode: undefined,
      deltakerId,
      forslagId,
      operation: 'forleng'
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('secret')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'private justification'
    )
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'private response'
    )
  })

  it('omits untrusted ID, operation and method values', () => {
    const error = {
      isAxiosError: true,
      config: { method: 'secret-method', url: '/private-path' },
      code: 'private-code'
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      logAndThrowError(error, 'deltakerEndring', {
        deltakerId: 'private-person-id',
        deltakerlisteId: 'private-list-id',
        forslagId: 'private-forslag-id',
        ulestEndringId: 'private-endring-id',
        operation: 'private-operation'
      })
    ).toThrow(error)

    expect(consoleError).toHaveBeenCalledWith('Request failed', {
      endpoint: 'deltakerEndring',
      method: undefined,
      httpStatus: undefined,
      errorCode: undefined
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('private-')
  })
})
