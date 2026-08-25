import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrisinformasjonType } from 'deltaker-flate-common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppContext } from '../../../AppContext.tsx'
import { lagDeltaker } from '../../test-utils/deltaker-context-test-utils.tsx'
import { DeltakerContext } from '../DeltakerContext.tsx'
import { PrisinformasjonTilGodkjenning } from './PrisinformasjonTilGodkjenning.tsx'

const tilbakekallPrisendringMock = vi.fn().mockResolvedValue(200)

const anskaffelsePrisinformasjon = {
  type: PrisinformasjonType.Anskaffelse,
  pris: 5000
} as { type: PrisinformasjonType.Anskaffelse; pris: number }

vi.mock('../../../api/api-enkeltplass.ts', () => ({
  tilbakekallPrisendring: (...args: unknown[]) =>
    tilbakekallPrisendringMock(...args)
}))

const renderPrisinformasjonTilGodkjenning = () => {
  const deltaker = lagDeltaker(
    {
      kanEndres: true
    },
    {
      prisinformasjonTilGodkjenning: anskaffelsePrisinformasjon
    }
  )

  const setDeltaker = vi.fn()

  render(
    <AppContext.Provider
      value={{
        personident: '12345678910',
        enhetId: '0101',
        setPersonident: vi.fn(),
        setEnhetId: vi.fn()
      }}
    >
      <DeltakerContext.Provider value={{ deltaker, setDeltaker }}>
        <PrisinformasjonTilGodkjenning
          prisinformasjonTilGodkjenning={anskaffelsePrisinformasjon}
        />
      </DeltakerContext.Provider>
    </AppContext.Provider>
  )

  return { deltaker, setDeltaker }
}

describe('PrisinformasjonTilGodkjenning', () => {
  beforeEach(() => {
    tilbakekallPrisendringMock.mockClear()
  })

  it('apner bekreftelsesdialog ved klikk pa Tilbakekall forslag', async () => {
    const user = userEvent.setup()
    renderPrisinformasjonTilGodkjenning()

    await user.click(
      screen.getByRole('button', { name: 'Tilbakekall forslag' })
    )

    expect(
      screen.getByRole('heading', { name: 'Tilbakekall forslag' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Er du helt sikker på at du vil tilbakekalle forslaget?')
    ).toBeInTheDocument()
  })

  it('lukker dialog nar man velger Nei, avbryt', async () => {
    const user = userEvent.setup()
    renderPrisinformasjonTilGodkjenning()

    await user.click(
      screen.getByRole('button', { name: 'Tilbakekall forslag' })
    )
    await user.click(screen.getByRole('button', { name: 'Nei, avbryt' }))

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Tilbakekall forslag' })
      ).not.toBeInTheDocument()
    })

    expect(tilbakekallPrisendringMock).not.toHaveBeenCalled()
  })

  it('trigger tilbakekall nar man velger Ja, tilbakekall', async () => {
    const user = userEvent.setup()
    const { deltaker, setDeltaker } = renderPrisinformasjonTilGodkjenning()

    await user.click(
      screen.getByRole('button', { name: 'Tilbakekall forslag' })
    )
    await user.click(screen.getByRole('button', { name: 'Ja, tilbakekall' }))

    await waitFor(() => {
      expect(tilbakekallPrisendringMock).toHaveBeenCalledWith(
        deltaker.deltakerId,
        '0101'
      )
    })

    expect(setDeltaker).toHaveBeenCalled()
  })
})
