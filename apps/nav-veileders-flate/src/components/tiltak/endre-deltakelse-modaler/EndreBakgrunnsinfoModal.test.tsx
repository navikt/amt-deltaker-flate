import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppContext } from '../../../AppContext.tsx'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { lagDeltaker } from '../../test-utils/deltaker-context-test-utils.tsx'
import { EndreBakgrunnsinfoModal } from './EndreBakgrunnsinfoModal.tsx'

vi.mock('../../../api/api.ts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../api/api.ts')>()),
  endreDeltakelseBakgrunnsinfo: vi.fn()
}))

const renderModal = (bakgrunnsinformasjon: string | null = null) => {
  const deltaker = lagDeltaker({
    bakgrunnsinformasjon,
    kanEndres: true,
    erUnderOppfolging: true,
    digitalBruker: true,
    harAdresse: true
  })
  const onSuccess = vi.fn()

  render(
    <AppContext.Provider
      value={{
        personident: '',
        enhetId: '0101',
        setPersonident: vi.fn(),
        setEnhetId: vi.fn()
      }}
    >
      <EndreBakgrunnsinfoModal
        deltaker={deltaker}
        open
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    </AppContext.Provider>
  )

  return { deltaker, onSuccess }
}

describe('EndreBakgrunnsinfoModal', () => {
  beforeEach(() => {
    vi.mocked(endreDeltakelseBakgrunnsinfo).mockReset()
  })

  const tommeVerdier = [null, '', '   ', '\t\n']
  it.each(tommeVerdier)(
    'Hindrer lagring når bakgrunnsinfo er %j',
    async (bakgrunnsinformasjon) => {
      const user = userEvent.setup()
      const { onSuccess } = renderModal(bakgrunnsinformasjon)

      await user.click(screen.getByRole('button', { name: 'Lagre' }))

      expect(
        await screen.findByText('Bakgrunnsinfo må fylles ut.')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('textbox', { name: 'Bakgrunnsinfo' })
      ).toHaveAttribute('aria-invalid', 'true')
      expect(endreDeltakelseBakgrunnsinfo).not.toHaveBeenCalled()
      expect(onSuccess).not.toHaveBeenCalled()
    }
  )

  it('hindrer lagring etter fjerning av eksisterende bakgrunnsinfo', async () => {
    const user = userEvent.setup()
    const { onSuccess } = renderModal('Eksisterende bakgrunnsinfo')
    const input = screen.getByRole('textbox', { name: 'Bakgrunnsinfo' })

    await user.clear(input)
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(
      await screen.findByText('Bakgrunnsinfo må fylles ut.')
    ).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(endreDeltakelseBakgrunnsinfo).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('Feltet må fylles ut-feilmelding fjernes og data lagres når bakgrunnsinfo er fylt ut', async () => {
    const user = userEvent.setup()
    const { deltaker, onSuccess } = renderModal()
    const oppdatertDeltaker = {
      ...deltaker,
      bakgrunnsinformasjon: 'Needs help finding work'
    }
    vi.mocked(endreDeltakelseBakgrunnsinfo).mockResolvedValue(oppdatertDeltaker)
    const input = screen.getByRole('textbox', { name: 'Bakgrunnsinfo' })

    await user.click(screen.getByRole('button', { name: 'Lagre' }))
    await screen.findByText('Bakgrunnsinfo må fylles ut.')
    await user.type(input, 'Needs help finding work')

    expect(
      screen.queryByText('Bakgrunnsinfo må fylles ut.')
    ).not.toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-invalid', 'true')

    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(oppdatertDeltaker)
    )
    expect(endreDeltakelseBakgrunnsinfo).toHaveBeenCalledTimes(1)
    expect(endreDeltakelseBakgrunnsinfo).toHaveBeenCalledWith(
      deltaker.deltakerId,
      '0101',
      { bakgrunnsinformasjon: 'Needs help finding work' }
    )
  })
})
