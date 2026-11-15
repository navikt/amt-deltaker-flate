import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeltakerPage } from './DeltakerPage'

const { getDeltakerMock } = vi.hoisted(() => ({
  getDeltakerMock: vi.fn()
}))

interface ProcessWithUnhandledRejection {
  on(event: 'unhandledRejection', listener: (reason: unknown) => void): void
  off(event: 'unhandledRejection', listener: (reason: unknown) => void): void
}

// JSDOM sender ikke alltid avvisninger videre til window.unhandledrejection.
const nodeProcess = (
  globalThis as typeof globalThis & { process: ProcessWithUnhandledRejection }
).process

vi.mock('../api/api.ts', () => ({
  getDeltaker: getDeltakerMock
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ deltakerId: 'deltaker-1' })
}))

vi.mock('../context-providers/AppContext.tsx', () => ({
  useAppContext: () => ({ deltakerlisteId: 'liste-1' })
}))

vi.mock('../hooks/useFocusPageLoad.tsx', () => ({
  useFocusPageLoad: () => ({ ref: null })
}))

vi.mock('../utils/tilgangsFeil.ts', () => ({
  handterTilgangsFeil: vi.fn(),
  isTilgangsFeil: () => false
}))

vi.mock('../components/deltaker-detaljer/DeltakerDetaljer.tsx', () => ({
  DeltakerDetaljer: () => null
}))

vi.mock('../components/deltaker-detaljer/DeltakerDetaljerHeader.tsx', () => ({
  DeltakerDetaljerHeader: () => null
}))

vi.mock('../components/deltaker-detaljer/Tilbakelenke.tsx', () => ({
  Tilbakelenke: () => null
}))

vi.mock('../components/Kontaktinformasjon.tsx', () => ({
  Kontaktinformasjon: () => null
}))

describe('DeltakerPage', () => {
  beforeEach(() => {
    getDeltakerMock.mockReset()
  })

  it('viser feilmelding uten global feilrapportering ved feil under deltakerhenting', async () => {
    getDeltakerMock.mockRejectedValue(new Error('Request failed'))
    const unhandledRejections: unknown[] = []
    const handleUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason)
    }
    nodeProcess.on('unhandledRejection', handleUnhandledRejection)

    try {
      render(<DeltakerPage />)

      expect(
        await screen.findByText(
          'Kunne ikke finne deltaker. Vennligst prøv igjen.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections).toEqual([])
    } finally {
      nodeProcess.off('unhandledRejection', handleUnhandledRejection)
    }
  })
})
