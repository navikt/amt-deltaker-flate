import '@testing-library/jest-dom/vitest'
import { Button } from '@navikt/ds-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  Oppstartstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppContext } from '../../../AppContext'
import { endreDeltakelseStartdato } from '../../../api/api'
import { getMockDeltaker } from '../../../mocks/mockDeltakere'
import {
  DATO_UTENFOR_TILTAKGJENNOMFORING,
  MAX_START_DATO,
  START_DATO_ETTER_5_AAR_FEILMELDING,
  START_DATO_FOER_2000_FEILMELDING,
  UGYLDIG_DATO,
  UGYLDIG_DATO_FORMAT
} from '../../../utils/varighet'
import { EndreOppstartsdatoModal } from './EndreOppstartsdatoModal'

vi.mock('../../../api/api.ts', () => ({
  endreDeltakelseStartdato: vi.fn()
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

const renderModal = (erEnkeltplass: boolean) => {
  const mockDeltaker = getMockDeltaker()
  const deltaker = {
    ...mockDeltaker,
    startdato: new Date(2027, 6, 10),
    sluttdato: new Date(2027, 6, 20),
    maxVarighet: null,
    softMaxVarighet: null,
    status: { ...mockDeltaker.status, type: DeltakerStatusType.DELTAR },
    deltakerliste: {
      ...mockDeltaker.deltakerliste,
      erEnkeltplass,
      startdato: new Date(2027, 6, 1),
      sluttdato: new Date(2027, 6, 31),
      oppstartstype: Oppstartstype.LOPENDE,
      tiltakskode: {
        ...mockDeltaker.deltakerliste.tiltakskode,
        kode: erEnkeltplass
          ? Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING
          : Tiltakskode.OPPFOLGING
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
      <EndreOppstartsdatoModal
        deltaker={deltaker}
        forslag={null}
        open
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    </AppContext.Provider>
  )
}

describe('EndreOppstartsdatoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    { value: '30.06.2027', message: DATO_UTENFOR_TILTAKGJENNOMFORING },
    { value: '01.08.2027', message: DATO_UTENFOR_TILTAKGJENNOMFORING },
    { value: '31.12.1999', message: START_DATO_FOER_2000_FEILMELDING },
    { value: '32.2.26', message: UGYLDIG_DATO },
    { value: 'ukjent', message: UGYLDIG_DATO_FORMAT },
    { value: '', message: 'Du må velge startdato' },
    {
      value: dayjs(MAX_START_DATO).add(1, 'day').format('DD.MM.YYYY'),
      message: START_DATO_ETTER_5_AAR_FEILMELDING,
      erEnkeltplass: true
    }
  ])(
    'beholder feilen for $value etter blur og Lagre',
    async ({ value, message, erEnkeltplass = false }) => {
      const user = userEvent.setup()
      renderModal(erEnkeltplass)
      const input = screen.getByRole('textbox', { name: 'Ny oppstartsdato' })

      await user.clear(input)
      if (value) await user.type(input, value)
      await user.tab()

      expect(screen.getByText(message)).toBeVisible()

      await user.click(screen.getByRole('button', { name: 'Lagre' }))

      expect(screen.getByText(message)).toBeVisible()
      expect(input).toHaveValue(value)
      expect(endreDeltakelseStartdato).not.toHaveBeenCalled()
    }
  )
})
