import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { trackUnhandledRejections } from 'deltaker-flate-common/test-utils/unhandled-rejections'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Kontaktinformasjon } from '../components/Kontaktinformasjon.tsx'
import { DeltakerDetaljer } from '../components/deltaker-detaljer/DeltakerDetaljer.tsx'
import { DeltakerDetaljerHeader } from '../components/deltaker-detaljer/DeltakerDetaljerHeader.tsx'
import { Tilbakelenke } from '../components/deltaker-detaljer/Tilbakelenke.tsx'
import { DeltakerPage } from './DeltakerPage'

const {
  getDeltakerMock,
  useNavigateMock,
  useParamsMock,
  useAppContextMock,
  useFocusPageLoadMock,
  handterTilgangsFeilMock,
  isTilgangsFeilMock
} = vi.hoisted(() => ({
  getDeltakerMock: vi.fn(),
  useNavigateMock: vi.fn(),
  useParamsMock: vi.fn(),
  useAppContextMock: vi.fn(),
  useFocusPageLoadMock: vi.fn(),
  handterTilgangsFeilMock: vi.fn(),
  isTilgangsFeilMock: vi.fn()
}))

vi.mock('../api/api.ts', () => ({
  getDeltaker: getDeltakerMock
}))

vi.mock('react-router-dom', () => ({
  useNavigate: useNavigateMock,
  useParams: useParamsMock
}))

vi.mock('../context-providers/AppContext.tsx', () => ({
  useAppContext: useAppContextMock
}))

vi.mock('../hooks/useFocusPageLoad.tsx', () => ({
  useFocusPageLoad: useFocusPageLoadMock
}))

vi.mock('../utils/tilgangsFeil.ts', () => ({
  handterTilgangsFeil: handterTilgangsFeilMock,
  isTilgangsFeil: isTilgangsFeilMock
}))

vi.mock('../components/deltaker-detaljer/DeltakerDetaljer.tsx', () => ({
  DeltakerDetaljer: vi.fn()
}))

vi.mock('../components/deltaker-detaljer/DeltakerDetaljerHeader.tsx', () => ({
  DeltakerDetaljerHeader: vi.fn()
}))

vi.mock('../components/deltaker-detaljer/Tilbakelenke.tsx', () => ({
  Tilbakelenke: vi.fn()
}))

vi.mock('../components/Kontaktinformasjon.tsx', () => ({
  Kontaktinformasjon: vi.fn()
}))

describe('DeltakerPage', () => {
  beforeEach(() => {
    getDeltakerMock.mockReset()
    useNavigateMock.mockReturnValue(vi.fn())
    useParamsMock.mockReturnValue({ deltakerId: 'deltaker-1' })
    useAppContextMock.mockReturnValue({ deltakerlisteId: 'liste-1' })
    useFocusPageLoadMock.mockReturnValue({ ref: null })
    isTilgangsFeilMock.mockReturnValue(false)
    vi.mocked(DeltakerDetaljer).mockImplementation(() => null)
    vi.mocked(DeltakerDetaljerHeader).mockImplementation(() => null)
    vi.mocked(Tilbakelenke).mockImplementation(() => null)
    vi.mocked(Kontaktinformasjon).mockImplementation(() => null)
  })

  it('viser feilmelding uten global feilrapportering ved feil under deltakerhenting', async () => {
    getDeltakerMock.mockRejectedValue(new Error('Request failed'))
    const unhandledRejections = trackUnhandledRejections()

    try {
      render(<DeltakerPage />)

      expect(
        await screen.findByText(
          'Kunne ikke finne deltaker. Vennligst prøv igjen.'
        )
      ).toBeInTheDocument()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(unhandledRejections.rejections).toEqual([])
    } finally {
      unhandledRejections.stop()
    }
  })
})
