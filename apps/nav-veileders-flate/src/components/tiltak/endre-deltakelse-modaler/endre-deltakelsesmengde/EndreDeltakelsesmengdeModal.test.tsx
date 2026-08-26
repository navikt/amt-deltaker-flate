import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppContext } from '../../../../AppContext.tsx'
import { DeltakerResponse } from '../../../../api/data/deltaker.ts'
import { EndreDeltakelsesmengdeModal } from './EndreDeltakelsesmengdeModal.tsx'

const endreDeltakelsesmengdeMock = vi.fn().mockResolvedValue(null)
const prosentLabel = 'Hva er ny deltakelsesprosent?'
const gruppeDagerLabel = 'Hvor mange dager i uka? (valgfritt)'
const enkeltplassDagerLabel =
  'Antall dager i uka som personen deltar (valgfritt)'

vi.mock('../../../../api/api.ts', () => ({
  endreDeltakelsesmengde: (...args: unknown[]) =>
    endreDeltakelsesmengdeMock(...args)
}))

vi.mock('deltaker-flate-common', async () => {
  const actual = await vi.importActual<typeof import('deltaker-flate-common')>(
    'deltaker-flate-common'
  )

  return {
    ...actual,
    useBegrunnelse: () => ({
      begrunnelse: 'test-begrunnelse',
      error: undefined,
      handleChange: vi.fn(),
      valider: () => true
    })
  }
})

type MockRequest = { deltakerId: string; enhetId: string; body: unknown }

vi.mock('../modal/Endringsmodal.tsx', () => ({
  Endringsmodal: ({
    children,
    validertRequest,
    apiFunction
  }: {
    children: ReactNode
    validertRequest: () => Promise<MockRequest | null> | MockRequest | null
    apiFunction: (deltakerId: string, enhetId: string, body: unknown) => unknown
  }) => (
    <div>
      {children}
      <button
        onClick={async () => {
          const request = await validertRequest()
          if (request) {
            apiFunction(request.deltakerId, request.enhetId, request.body)
          }
        }}
      >
        Lagre
      </button>
    </div>
  )
}))

const lagDeltaker = (
  erEnkeltplass: boolean,
  deltakelsesprosent = 60
): DeltakerResponse =>
  ({
    deltakerId: 'deltaker-1',
    deltakelsesprosent,
    dagerPerUke: 3,
    status: {
      id: 'status-1',
      type: DeltakerStatusType.DELTAR,
      aarsak: null,
      gyldigFra: new Date('2026-01-01'),
      gyldigTil: null,
      opprettet: new Date('2026-01-01')
    },
    kanEndres: true,
    startdato: new Date('2026-01-01'),
    sluttdato: new Date('2026-12-31'),
    erUnderOppfolging: true,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    },
    deltakerliste: {
      erEnkeltplass
    }
  }) as unknown as DeltakerResponse

const renderModal = (deltaker: DeltakerResponse) =>
  render(
    <AppContext.Provider
      value={{
        personident: '12345678910',
        enhetId: '0101',
        setPersonident: vi.fn(),
        setEnhetId: vi.fn()
      }}
    >
      <EndreDeltakelsesmengdeModal
        deltaker={deltaker}
        open
        forslag={null}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    </AppContext.Provider>
  )

const klikkLagre = async (endrePris = 'Nei') => {
  const user = userEvent.setup()
  const prisvalg = screen.queryByRole('radio', { name: endrePris })
  if (prisvalg) {
    await user.click(prisvalg)
  }
  await user.click(screen.getByRole('button', { name: 'Lagre' }))
  await waitFor(() =>
    expect(endreDeltakelsesmengdeMock).toHaveBeenCalledTimes(1)
  )
}

const settDagerPerUke = async (label: string, verdi: string) => {
  const user = userEvent.setup()
  const dagerInput = screen.getByLabelText(label)
  await user.clear(dagerInput)
  await user.type(dagerInput, verdi)
}

describe('EndreDeltakelsesmengdeModal', () => {
  beforeEach(() => {
    endreDeltakelsesmengdeMock.mockClear()
  })

  describe('EndreDeltakelsesmengdeModal UI', () => {
    it('Gruppe-variant viser gruppe-felter og skjuler enkeltplass-tekst', () => {
      renderModal(lagDeltaker(false))

      expect(screen.getByLabelText(prosentLabel)).toBeInTheDocument()
      expect(screen.getByLabelText(gruppeDagerLabel)).toBeInTheDocument()
      expect(
        screen.queryByLabelText(enkeltplassDagerLabel)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(
          'Fyll ut hvis personen skal søke om tiltakspenger eller tilleggsstønader'
        )
      ).not.toBeInTheDocument()
    })

    it('Enkeltplass-variant viser enkeltplass-felter og skjuler prosentfelt', () => {
      renderModal(lagDeltaker(true))

      expect(screen.queryByLabelText(prosentLabel)).not.toBeInTheDocument()
      expect(screen.getByLabelText(enkeltplassDagerLabel)).toBeInTheDocument()
      expect(
        screen.getByText(
          'Fyll ut hvis personen skal søke om tiltakspenger eller tilleggsstønader'
        )
      ).toBeInTheDocument()
      expect(screen.queryByLabelText(gruppeDagerLabel)).not.toBeInTheDocument()
    })

    it('Gruppe-variant oppdaterer synlighet av gruppe-dager dynamisk når prosent endres', async () => {
      const user = userEvent.setup()
      renderModal(lagDeltaker(false, 100))

      const prosentInput = screen.getByLabelText(prosentLabel)
      expect(screen.queryByLabelText(gruppeDagerLabel)).not.toBeInTheDocument()

      await user.clear(prosentInput)
      await user.type(prosentInput, '80')
      expect(screen.getByLabelText(gruppeDagerLabel)).toBeInTheDocument()

      await user.clear(prosentInput)
      await user.type(prosentInput, '100')
      expect(screen.queryByLabelText(gruppeDagerLabel)).not.toBeInTheDocument()
    })
  })

  it.each([
    {
      navn: 'gruppe',
      erEnkeltplass: false,
      forventetDeltakelsesprosent: 60
    },
    {
      navn: 'enkeltplass',
      erEnkeltplass: true,
      forventetDeltakelsesprosent: undefined
    }
  ])(
    'sender riktig payload for $navn',
    async ({ erEnkeltplass, forventetDeltakelsesprosent }) => {
      renderModal(lagDeltaker(erEnkeltplass))
      await klikkLagre()

      expect(endreDeltakelsesmengdeMock).toHaveBeenCalledWith(
        'deltaker-1',
        '0101',
        expect.objectContaining({
          deltakelsesprosent: forventetDeltakelsesprosent,
          dagerPerUke: 3,
          ...(erEnkeltplass ? { pavirkerPris: false } : {})
        })
      )
    }
  )

  it('Enkeltplass tillater 7 dager per uke', async () => {
    renderModal(lagDeltaker(true))
    await settDagerPerUke(enkeltplassDagerLabel, '7')
    await klikkLagre()

    expect(endreDeltakelsesmengdeMock).toHaveBeenCalledWith(
      'deltaker-1',
      '0101',
      expect.objectContaining({
        deltakelsesprosent: undefined,
        dagerPerUke: 7,
        pavirkerPris: false
      })
    )
  })

  it('sender pavirkerPris true når endringen påvirker pris', async () => {
    renderModal(lagDeltaker(true))
    await klikkLagre('Ja')

    expect(endreDeltakelsesmengdeMock).toHaveBeenCalledWith(
      'deltaker-1',
      '0101',
      expect.objectContaining({ pavirkerPris: true })
    )
  })

  it('krever valg om endringen påvirker pris før lagring', async () => {
    const user = userEvent.setup()
    renderModal(lagDeltaker(true))
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(endreDeltakelsesmengdeMock).not.toHaveBeenCalled()
    expect(
      screen.getByText(
        'Du må velge om endringen vil påvirke pris og betalingsbetingelser før du kan fortsette.'
      )
    ).toBeInTheDocument()
  })

  it('Gruppe avviser 7 dager per uke', async () => {
    const user = userEvent.setup()
    renderModal(lagDeltaker(false))
    await settDagerPerUke(gruppeDagerLabel, '7')
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(endreDeltakelsesmengdeMock).not.toHaveBeenCalled()
    expect(
      screen.getByText('Dager per uke må være et helt tall fra 1 til 5')
    ).toBeInTheDocument()
  })

  it('Gruppe avviser 0 dager per uke', async () => {
    const user = userEvent.setup()
    renderModal(lagDeltaker(false))
    await settDagerPerUke(gruppeDagerLabel, '0')
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(endreDeltakelsesmengdeMock).not.toHaveBeenCalled()
    expect(
      screen.getByText('Dager per uke må være et helt tall fra 1 til 5')
    ).toBeInTheDocument()
  })

  it('Enkeltplass avviser 0 dager per uke', async () => {
    const user = userEvent.setup()
    renderModal(lagDeltaker(true))
    await settDagerPerUke(enkeltplassDagerLabel, '0')
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(endreDeltakelsesmengdeMock).not.toHaveBeenCalled()
    expect(
      screen.getByText('Dager per uke må være et helt tall fra 1 til 7')
    ).toBeInTheDocument()
  })
})
