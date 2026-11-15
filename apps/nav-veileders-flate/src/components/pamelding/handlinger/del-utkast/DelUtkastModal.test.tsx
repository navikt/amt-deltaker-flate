import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DelUtkastModal } from './DelUtkastModal'

const { oppdaterUtkastMock } = vi.hoisted(() => ({
  oppdaterUtkastMock: vi.fn()
}))

interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

// JSDOM sender ikke alltid avvisninger videre til window.unhandledrejection.
const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

vi.mock('../../../../api/api', () => ({
  oppdaterUtkast: oppdaterUtkastMock
}))

vi.mock('../../../../AppContext', () => ({
  useAppContext: () => ({ enhetId: '0101' })
}))

vi.mock('../../../../hooks/useModiaLink', () => ({
  DELTAKELSESOVERSIKT_LINK: '/',
  useModiaLink: () => ({ doRedirect: vi.fn() })
}))

vi.mock('../../../../utils/displayText', () => ({
  getDeltakerNavn: () => 'Testbruker'
}))

vi.mock('../../../../utils/pamelding-form-utils', () => ({
  generatePameldingRequestFromForm: () => ({})
}))

vi.mock('../../../tiltak/DeltakerContext', () => ({
  useDeltakerContext: () => ({
    deltaker: {
      deltakerId: 'deltaker-1',
      deltakerliste: {
        visningsnavn: { tiltakHosArrangorTittel: 'Testtiltak' },
        pameldingstype: 'TRENGER_GODKJENNING'
      }
    }
  })
}))

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({ getValues: () => ({}) })
}))

describe('DelUtkastModal', () => {
  beforeEach(() => {
    oppdaterUtkastMock.mockReset()
  })

  it('viser feilmelding uten global feilrapportering ved feil under deling', async () => {
    oppdaterUtkastMock.mockRejectedValue(new Error('Request failed'))
    const unhandledRejections: unknown[] = []
    const handleUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    nodeProcess.on('unhandledRejection', handleUnhandledRejection)

    try {
      const user = userEvent.setup()
      render(<DelUtkastModal open onClose={vi.fn()} />)

      await user.click(
        screen.getByRole('button', {
          name: 'Del utkast og gjør klar søknad'
        })
      )

      expect(
        await screen.findByText(
          'Vi fikk en feil og kunne ikke dele utkastet, prøv igjen.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections).toEqual([])
    } finally {
      nodeProcess.off('unhandledRejection', handleUnhandledRejection)
    }
  })
})
