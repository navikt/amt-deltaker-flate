import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  resolveVersionManifestUrl,
  Versjonsvarsel
} from 'deltaker-flate-common'

const versjonssvar = (version: string) =>
  new Response(JSON.stringify({ version }), { status: 200 })

const ventTilVersjonssjekkErFerdig = () =>
  act(
    () =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0)
      })
  )

describe('Versjonsvarsel', () => {
  const fetchMock = vi.fn()

  it('finner manifestet ved siden av appens bundle', () => {
    expect(
      resolveVersionManifestUrl(
        'https://cdn.nav.no/amt/app/build/assets/index.js'
      )
    ).toBe('https://cdn.nav.no/amt/app/build/assets/version.json')
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    fetchMock.mockReset()
  })

  it('viser ingen varsel når versjonen er den samme', async () => {
    fetchMock.mockResolvedValue(versjonssvar('versjon-1'))

    render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/assets/version.json', {
        cache: 'no-store'
      })
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('viser varsel med knapp når en nyere versjon er tilgjengelig', async () => {
    fetchMock.mockResolvedValue(versjonssvar('versjon-2'))

    render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Last inn på nytt' })
    ).toBeInTheDocument()
  })

  it('oppdager ny versjon ved neste femminutterskontroll', async () => {
    let pollCallback: (() => void) | undefined
    const setIntervalSpy = vi
      .spyOn(window, 'setInterval')
      .mockImplementation((handler) => {
        if (typeof handler === 'function') {
          pollCallback = () => handler()
        }
        return 123
      })
    fetchMock
      .mockResolvedValueOnce(versjonssvar('versjon-1'))
      .mockResolvedValueOnce(versjonssvar('versjon-2'))

    render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )
    await ventTilVersjonssjekkErFerdig()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      5 * 60 * 1000
    )

    await act(async () => pollCallback?.())

    expect(
      await screen.findByRole('button', { name: 'Last inn på nytt' })
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('sjekker versjon på nytt når fanen blir synlig', async () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')
    fetchMock
      .mockResolvedValueOnce(versjonssvar('versjon-1'))
      .mockResolvedValueOnce(versjonssvar('versjon-2'))

    render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )
    await ventTilVersjonssjekkErFerdig()

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(
      await screen.findByRole('button', { name: 'Last inn på nytt' })
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rydder opp intervallkontrollen når komponenten avmonteres', async () => {
    let pollCallback: (() => void) | undefined
    const intervalId = 123
    vi.spyOn(window, 'setInterval').mockImplementation((handler) => {
      if (typeof handler === 'function') {
        pollCallback = () => handler()
      }
      return intervalId
    })
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    fetchMock.mockResolvedValue(versjonssvar('versjon-1'))

    const { unmount } = render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )
    await ventTilVersjonssjekkErFerdig()

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId)
    await act(async () => pollCallback?.())
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('logger feil når versjonssjekken ikke kan fullføres', async () => {
    fetchMock.mockRejectedValue(new Error('Nettverksfeil'))

    render(
      <Versjonsvarsel
        currentVersion="versjon-1"
        manifestUrl="/assets/version.json"
      />
    )

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'AMT_LOGS: Kunne ikke sjekke frontend-versjon',
        [expect.any(Error)]
      )
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
