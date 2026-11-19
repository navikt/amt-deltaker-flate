// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDeferredFetch } from 'deltaker-flate-common'
import { SendTilNavKnapp } from './endre-deltaker-modal/SendTilNavKnapp'
import { FjernEndring } from './forslag/FjernEndring'
import { FjernForslag } from './forslag/FjernForslag'

const api = vi.hoisted(() => ({
  markerSomLest: vi.fn<() => Promise<unknown>>(),
  tilbakekall: vi.fn<() => Promise<unknown>>()
}))

vi.mock('../../../../api/endring-api', () => ({
  settSvarFraNavSomLest: api.markerSomLest
}))
vi.mock('../../../../api/forslag-api', () => ({
  tilbakekallForslag: api.tilbakekall
}))

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

const render = async (element: ReactNode) => {
  await act(() => root.render(element))
}

const click = () => {
  const button = container.querySelector('button')
  if (!button) throw new Error('Expected an action button')
  button.click()
}

describe('Sending til Nav', () => {
  it('hindrer samtidige innsendinger før neste rendring', async () => {
    const send = vi.fn(() => new Promise<void>(() => {}))
    await render(
      <SendTilNavKnapp sendEndring={send} onEndringSendt={vi.fn()} />
    )

    await act(() => {
      click()
      click()
    })

    expect(send).toHaveBeenCalledTimes(1)
    expect(container.querySelector('button')?.disabled).toBe(true)
  })

  it.each([new Error('private error details'), { message: 'private' }])(
    'viser en generell API-feilmelding og tillater nytt forsøk',
    async (error) => {
      const send = vi
        .fn<() => Promise<void>>()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce()
      const onSendt = vi.fn()
      await render(
        <SendTilNavKnapp sendEndring={send} onEndringSendt={onSendt} />
      )

      await act(click)
      expect(container.querySelector('[role="alert"]')?.textContent).toContain(
        'Noe gikk galt'
      )
      expect(container.textContent).not.toContain('private')
      expect(onSendt).not.toHaveBeenCalled()

      await act(click)
      expect(send).toHaveBeenCalledTimes(2)
      expect(onSendt).toHaveBeenCalledTimes(1)
      expect(container.querySelector('[role="alert"]')).toBeNull()
    }
  )

  it('håndterer synkrone valideringsfeil og tillater nytt forsøk', async () => {
    const send = vi
      .fn<() => Promise<void>>()
      .mockImplementationOnce(() => {
        throw 'Begrunnelse mangler'
      })
      .mockResolvedValueOnce()
    const onSendt = vi.fn()
    await render(
      <SendTilNavKnapp sendEndring={send} onEndringSendt={onSendt} />
    )

    await act(click)
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Begrunnelse mangler'
    )

    await act(click)
    expect(onSendt).toHaveBeenCalledTimes(1)
  })
})

describe.each([
  {
    name: 'Markering som lest',
    request: api.markerSomLest,
    errorMessage: 'Kunne ikke markere meldingen som lest. Prøv igjen.',
    element: (onSuccess: () => void) => (
      <FjernEndring
        deltakerId="deltaker"
        endringId="endring"
        onMarkertSomLest={onSuccess}
      />
    )
  },
  {
    name: 'Tilbakekalling av forslag',
    request: api.tilbakekall,
    errorMessage: 'Kunne ikke tilbakekalle forslaget. Prøv igjen.',
    element: (onSuccess: () => void) => (
      <FjernForslag
        deltakerId="deltaker"
        forslagId="forslag"
        onTilbakekalt={onSuccess}
      />
    )
  }
])('$name', ({ request, errorMessage, element }) => {
  it('hindrer samtidige forespørsler', async () => {
    request.mockImplementation(() => new Promise(() => {}))
    await render(element(vi.fn()))

    await act(() => {
      click()
      click()
    })

    expect(request).toHaveBeenCalledTimes(1)
    expect(container.querySelector('button')?.disabled).toBe(true)
  })

  it('viser feil og tillater et vellykket nytt forsøk', async () => {
    request
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(undefined)
    const onSuccess = vi.fn()
    await render(element(onSuccess))

    await act(click)
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      errorMessage
    )
    expect(onSuccess).not.toHaveBeenCalled()

    await act(click)
    expect(request).toHaveBeenCalledTimes(2)
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})

it('fjerner historikkfeilen etter et vellykket nytt forsøk', async () => {
  const fetch = vi
    .fn<() => Promise<string>>()
    .mockRejectedValueOnce(new Error('Could not fetch history'))
    .mockResolvedValueOnce('History loaded')
  const History = () => {
    const { data, error, doFetch } = useDeferredFetch(fetch)
    return (
      <>
        <button onClick={() => void doFetch().catch(() => undefined)}>
          Fetch history
        </button>
        <span>{error ?? data}</span>
      </>
    )
  }
  await render(<History />)

  await act(click)
  expect(container.textContent).toContain('Could not fetch history')

  await act(click)
  expect(container.textContent).toContain('History loaded')
  expect(container.textContent).not.toContain('Could not fetch history')
})
