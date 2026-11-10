import '@testing-library/jest-dom/vitest'
import { Button } from '@navikt/ds-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  EndreDeltakelseType,
  Oppstartstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppContext } from '../../../AppContext'
import { avsluttDeltakelse, endreAvslutning } from '../../../api/api'
import { getMockDeltaker } from '../../../mocks/mockDeltakere'
import {
  DATO_ETTER_IDAG_FEILMELDING,
  DATO_ETTER_NAAVAERENDE_SLUTTDATO_FEILMELDING,
  SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT
} from '../../../utils/varighet'
import { AvsluttDeltakelseModal } from './AvsluttDeltakelseModal'

vi.mock('../../../api/api.ts', () => ({
  avsluttDeltakelse: vi.fn(),
  endreAvslutning: vi.fn()
}))

type MockRequest = { deltakerId: string; enhetId: string; body: unknown }

vi.mock('../modal/Endringsmodal.tsx', () => ({
  Endringsmodal: ({
    children,
    validertRequest,
    apiFunction
  }: {
    children: ReactNode
    validertRequest: () => MockRequest | null
    apiFunction: (deltakerId: string, enhetId: string, body: unknown) => unknown
  }) => (
    <>
      {children}
      <Button
        onClick={() => {
          const request = validertRequest()
          if (request) {
            apiFunction(request.deltakerId, request.enhetId, request.body)
          }
        }}
      >
        Lagre
      </Button>
    </>
  )
}))

const renderModal = (endreDeltakelseType: EndreDeltakelseType) => {
  const mockDeltaker = getMockDeltaker()
  const deltaker = {
    ...mockDeltaker,
    startdato: new Date(2020, 0, 1),
    sluttdato: new Date(2020, 1, 1),
    maxVarighet: null,
    softMaxVarighet: null,
    status: { ...mockDeltaker.status, type: DeltakerStatusType.HAR_SLUTTET },
    deltakerliste: {
      ...mockDeltaker.deltakerliste,
      oppstartstype: Oppstartstype.LOPENDE,
      tiltakskode: {
        ...mockDeltaker.deltakerliste.tiltakskode,
        kode: Tiltakskode.OPPFOLGING
      }
    }
  }

  return render(
    <AppContext.Provider
      value={{
        personident: '12345678910',
        enhetId: '0101',
        setPersonident: vi.fn(),
        setEnhetId: vi.fn()
      }}
    >
      <AvsluttDeltakelseModal
        deltaker={deltaker}
        forslag={null}
        open
        endreDeltakelseType={endreDeltakelseType}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    </AppContext.Provider>
  )
}

describe('AvsluttDeltakelseModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    {
      endreDeltakelseType: EndreDeltakelseType.AVSLUTT_DELTAKELSE,
      value: '02.02.2020',
      message: DATO_ETTER_NAAVAERENDE_SLUTTDATO_FEILMELDING
    },
    {
      endreDeltakelseType: EndreDeltakelseType.ENDRE_AVSLUTNING,
      value: dayjs().add(1, 'day').format('DD.MM.YYYY'),
      message: DATO_ETTER_IDAG_FEILMELDING
    },
    ...[
      EndreDeltakelseType.AVSLUTT_DELTAKELSE,
      EndreDeltakelseType.ENDRE_AVSLUTNING
    ].flatMap((endreDeltakelseType) => [
      {
        endreDeltakelseType,
        value: '31.12.2019',
        message: SLUTTDATO_FOER_OPPSTARTSDATO_FEILMELDING
      },
      { endreDeltakelseType, value: '32.2.26', message: UGYLDIG_DATO },
      { endreDeltakelseType, value: 'ukjent', message: UGYLDIG_DATO_FORMAT }
    ])
  ])(
    'beholder feilen for $value etter blur og Lagre ved $endreDeltakelseType',
    async ({ endreDeltakelseType, value, message }) => {
      const user = userEvent.setup()
      renderModal(endreDeltakelseType)
      const input = screen.getByRole('textbox', {
        name: 'Hva er ny sluttdato?'
      })

      await user.clear(input)
      await user.type(input, value)
      await user.tab()

      expect(screen.getByText(message)).toBeVisible()
      expect(input).toHaveValue(value)

      await user.click(screen.getByRole('button', { name: 'Lagre' }))

      expect(screen.getByText(message)).toBeVisible()
      expect(
        screen.queryByText('Du må velge en sluttdato.')
      ).not.toBeInTheDocument()
      expect(input).toHaveValue(value)
      expect(avsluttDeltakelse).not.toHaveBeenCalled()
      expect(endreAvslutning).not.toHaveBeenCalled()
    }
  )

  it('viser påkrevd-feil ved Lagre når sluttdatoen er tom', async () => {
    const user = userEvent.setup()
    renderModal(EndreDeltakelseType.AVSLUTT_DELTAKELSE)
    await user.clear(
      screen.getByRole('textbox', { name: 'Hva er ny sluttdato?' })
    )
    await user.click(screen.getByRole('button', { name: 'Lagre' }))

    expect(screen.getByText(/Du må velge en sluttdato/)).toBeVisible()
    expect(avsluttDeltakelse).not.toHaveBeenCalled()
  })
})
