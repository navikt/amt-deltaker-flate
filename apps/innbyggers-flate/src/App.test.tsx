import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDeltakelse } from './api/api'
import { App } from './App'
import { lagInnbyggerDeltaker } from './pages/test-utils'

// Opprett mocken før vi.mock-fabrikkene kjøres, slik at de kan bruke den.
const mockDeltakerGuard = vi.hoisted(() => vi.fn(() => null))

// La testene styre om API-kallet lykkes eller feiler.
vi.mock('./api/api', () => ({
  getDeltakelse: vi.fn()
}))

// Isoler App fra statusbasert visning; suksess-testen verifiserer at guarden kalles.
vi.mock('./guards/DeltakerGuard.tsx', () => ({
  DeltakerGuard: mockDeltakerGuard
}))

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={['/deltaker-1']}>
      <Routes>
        <Route path="/:deltakerId" element={<App />} />
      </Routes>
    </MemoryRouter>
  )

describe('App', () => {
  beforeEach(() => vi.clearAllMocks())

  it('viser feilmelding når innlasting av deltaker feiler', async () => {
    vi.mocked(getDeltakelse).mockRejectedValue(new Error('Request failed'))

    renderApp()

    expect(
      await screen.findByRole('heading', {
        name: 'Vi beklager, men noe gikk galt'
      })
    ).toBeInTheDocument()
  })

  it('viser deltakersiden når innlasting lykkes', async () => {
    vi.mocked(getDeltakelse).mockResolvedValue(lagInnbyggerDeltaker())

    renderApp()

    await screen.findByText('Gå til aktivitetsplanen')
    expect(mockDeltakerGuard).toHaveBeenCalled()
  })
})
