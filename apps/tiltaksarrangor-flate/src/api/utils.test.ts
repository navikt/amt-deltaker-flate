import { describe, expect, it, vi } from 'vitest'
import { logAndThrowError } from './utils'

describe('logAndThrowError', () => {
  it('logs status without logging the request body or URL', () => {
    const error = {
      isAxiosError: true,
      config: { data: 'sensitive free-text justification' },
      response: { status: 500 }
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let thrownError: unknown

    try {
      logAndThrowError(error)
    } catch (thrown) {
      thrownError = thrown
    }

    expect(thrownError).toBe(error)
    expect(consoleError).toHaveBeenCalledWith('Request failed', {
      httpStatus: 500
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'sensitive free-text justification'
    )
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('private-id')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'private-token'
    )
  })
})
