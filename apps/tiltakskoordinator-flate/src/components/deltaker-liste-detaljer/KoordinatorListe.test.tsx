import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { KoordinatorListe } from './KoordinatorListe'

const { fjernTilgangMock } = vi.hoisted(() => ({
  fjernTilgangMock: vi.fn()
}))

interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

vi.mock('../../api/api.ts', () => ({
  fjernTilgang: fjernTilgangMock
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

vi.mock('../../utils/environment-utils.ts', () => ({
  isEnvLocalDemoOrPr: () => false
}))

vi.mock('../../utils/utils.ts', () => ({
  gaTilGjennomforingerMulighetsrommet: vi.fn()
}))

describe('KoordinatorListe', () => {
  beforeEach(() => {
    fjernTilgangMock.mockReset()
  })

  it('viser feilmelding uten global feilrapportering ved feil under fjerning av tilgang', async () => {
    fjernTilgangMock.mockRejectedValue(new Error('Request failed'))
    const unhandledRejections: unknown[] = []
    const handleUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    nodeProcess.on('unhandledRejection', handleUnhandledRejection)

    try {
      const user = userEvent.setup()
      render(
        <KoordinatorListe
          deltakerlisteId="liste-1"
          koordinatorer={[
            {
              id: 'koordinator-1',
              navn: 'Testperson',
              erAktiv: true,
              kanFjernes: true
            }
          ]}
        />
      )

      await user.click(
        screen.getByRole('button', { name: 'Fjern meg selv som koordinator' })
      )
      await user.click(
        screen.getByRole('button', { name: 'Fjern min tilgang' })
      )

      expect(
        await screen.findByText(
          'Kunne ikke fjerne tilgang for koordinator. Prøv igjen senere.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections).toEqual([])
    } finally {
      nodeProcess.off('unhandledRejection', handleUnhandledRejection)
    }
  })
})
