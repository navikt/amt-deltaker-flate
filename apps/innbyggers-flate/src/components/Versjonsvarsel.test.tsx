import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
  const queryClients: QueryClient[] = []

  const renderVersjonsvarsel = (currentVersion = 'versjon-1') => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: Infinity } }
    })
    queryClients.push(queryClient)

    return render(
      <QueryClientProvider client={queryClient}>
        <Versjonsvarsel
          currentVersion={currentVersion}
          manifestUrl="/assets/version.json"
        />
      </QueryClientProvider>
    )
  }

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
    queryClients.forEach((queryClient) => queryClient.clear())
    queryClients.length = 0
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    fetchMock.mockReset()
  })

  it('viser ingen varsel når versjonen er den samme', async () => {
    fetchMock.mockResolvedValue(versjonssvar('versjon-1'))

    renderVersjonsvarsel()

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/assets/version.json', {
        cache: 'no-store'
      })
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('viser varsel med knapp når en nyere versjon er tilgjengelig', async () => {
    fetchMock.mockResolvedValue(versjonssvar('versjon-2'))

    renderVersjonsvarsel()

    expect(
      await screen.findByRole('button', { name: 'Last inn på nytt' })
    ).toBeInTheDocument()
  })

  it('oppdager ny versjon ved neste femminutterskontroll', async () => {
    let pollCallback: (() => void) | undefined
    const setIntervalSpy = vi
      .spyOn(globalThis, 'setInterval')
      .mockImplementation((handler) => {
        if (typeof handler === 'function') {
          pollCallback = () => handler()
        }
        return 123
      })
    fetchMock
      .mockResolvedValueOnce(versjonssvar('versjon-1'))
      .mockResolvedValueOnce(versjonssvar('versjon-2'))

    renderVersjonsvarsel()
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
    const visibilityState = vi
      .spyOn(document, 'visibilityState', 'get')
      .mockReturnValue('hidden')
    fetchMock
      .mockResolvedValueOnce(versjonssvar('versjon-1'))
      .mockResolvedValueOnce(versjonssvar('versjon-2'))

    renderVersjonsvarsel()
    await ventTilVersjonssjekkErFerdig()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      window.dispatchEvent(new Event('visibilitychange'))
    })

    visibilityState.mockReturnValue('visible')
    await act(async () => {
      window.dispatchEvent(new Event('visibilitychange'))
    })

    expect(
      await screen.findByRole('button', { name: 'Last inn på nytt' })
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rydder opp intervallkontrollen når komponenten avmonteres', async () => {
    const intervalIds: ReturnType<typeof globalThis.setInterval>[] = []
    const setInterval = globalThis.setInterval.bind(globalThis)
    const setIntervalSpy = vi
      .spyOn(globalThis, 'setInterval')
      .mockImplementation((handler, timeout, ...args) => {
        const intervalId = setInterval(handler, timeout, ...args)
        intervalIds.push(intervalId)
        return intervalId
      })
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    fetchMock.mockResolvedValue(versjonssvar('versjon-1'))

    const { unmount } = renderVersjonsvarsel()
    await ventTilVersjonssjekkErFerdig()

    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      5 * 60 * 1000
    )

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalIds[0])
  })

  it('logger feil når versjonssjekken ikke kan fullføres', async () => {
    fetchMock.mockRejectedValue(new Error('Nettverksfeil'))

    renderVersjonsvarsel()

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'AMT_LOGS: Kunne ikke sjekke frontend-versjon',
        [expect.any(Error)]
      )
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
