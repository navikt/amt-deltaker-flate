import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { Utkast } from './Utkast'
import { DeltakerResponse } from '../../api/data/deltaker'
import { DeltakerContext } from '../tiltak/DeltakerContext'
import { PameldingFormContextProvider } from '../pamelding/PameldingFormContext'
import { AppContext } from '../../AppContext'
import { KodeverkAlternativType, Seleksjonstype } from '../../api/data/kodeverk'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const mockGetKodeverk = vi.fn()

vi.mock('../../api/api-enkeltplass.ts', () => ({
  getKodeverk: (...args: unknown[]) => mockGetKodeverk(...args),
  oppdaterKladd: vi.fn().mockResolvedValue(200),
  meldPaDirekteEnkeltplass: vi.fn().mockResolvedValue(200),
  delUtkastMedInnbygger: vi.fn().mockResolvedValue({}),
  oppdaterUtkast: vi.fn().mockResolvedValue({}),
  sokUnderenhet: vi.fn().mockResolvedValue([]),
  sokSertifiseringer: vi.fn().mockResolvedValue([]),
  opprettEnkeltplassKladd: vi.fn().mockResolvedValue({})
}))

const createDeltaker = (): DeltakerResponse =>
  ({
    deltakerId: 'deltaker-123',
    fornavn: 'Test',
    mellomnavn: null,
    etternavn: 'Testersen',
    deltakerliste: {
      deltakerlisteId: '1',
      deltakerlisteNavn: 'Test',
      tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
      arrangorNavn: 'Kurs AS',
      arrangor: { navn: 'Kurs AS', organisasjonsnummer: '123456789' },
      erEnkeltplass: true,
      oppstartstype: null,
      startdato: null,
      sluttdato: dayjs('2030-02-20').toDate(),
      status: null,
      tilgjengeligInnhold: { ledetekst: null, innhold: [] },
      oppmoteSted: null,
      pameldingstype: 'SOKNADSBASERT',
      kodeverk: {
        tittel: 'Bransje',
        valg: ['Bygg'],
        valgteKodeverkIder: ['old-id'],
        valgteSertifiseringer: []
      }
    },
    status: {
      id: '1',
      type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
      aarsak: null,
      gyldigFra: new Date(),
      gyldigTil: null,
      opprettet: new Date()
    },
    startdato: '2025-04-10',
    sluttdato: '2025-10-09',
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    prisinformasjon: '',
    vedtaksinformasjon: null,
    kanEndres: true,
    digitalBruker: true,
    maxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    softMaxVarighet: dayjs.duration(12, 'month').asMilliseconds(),
    forslag: [],
    importertFraArena: null,
    harAdresse: false,
    adresseDelesMedArrangor: false,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    }
  }) as unknown as DeltakerResponse

const renderUtkast = (deltaker: DeltakerResponse, queryClient: QueryClient) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          personident: '12345678910',
          enhetId: '0101',
          setPersonident: vi.fn(),
          setEnhetId: vi.fn()
        }}
      >
        <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
          <PameldingFormContextProvider>
            <Utkast />
          </PameldingFormContextProvider>
        </DeltakerContext.Provider>
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

describe('Utkast - Endre utkast invaliderer kodeverk-cache', () => {
  it('henter fersk kodeverk fra backend når bruker klikker Endre utkast', async () => {
    const user = userEvent.setup()
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })

    // Prepopuler cachen med "gammel" kodeverk-data
    queryClient.setQueryData(['kodeverk', 'deltaker-123', '0101'], {
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [
        {
          type: KodeverkAlternativType.VERDIGRUPPE,
          id: null,
          visningsnavn: 'Bransje',
          representerer: 'bransje',
          seleksjonstype: Seleksjonstype.ENKELTVALG,
          alternativer: [
            { id: 'old-id', visningsnavn: 'Gammel Bransje', valgt: true }
          ]
        }
      ],
      sertifiseringValg: []
    })

    // Mock returnerer NY data fra backend
    mockGetKodeverk.mockResolvedValue({
      tiltakskode: 'ARBEIDSMARKEDSOPPLAERING',
      alternativer: [
        {
          type: KodeverkAlternativType.VERDIGRUPPE,
          id: null,
          visningsnavn: 'Bransje',
          representerer: 'bransje',
          seleksjonstype: Seleksjonstype.ENKELTVALG,
          alternativer: [
            { id: 'new-id', visningsnavn: 'Ny Bransje', valgt: true },
            { id: 'old-id', visningsnavn: 'Gammel Bransje', valgt: false }
          ]
        }
      ],
      sertifiseringValg: []
    })

    const deltaker = createDeltaker()
    renderUtkast(deltaker, queryClient)

    // Verifiser at "Endre utkast"-knappen er synlig
    const endreBtn = screen.getByRole('button', { name: /Endre utkast/ })
    expect(endreBtn).toBeInTheDocument()

    // Klikk "Endre utkast"
    await user.click(endreBtn)

    // Verifiser at getKodeverk ble kalt (cache ble invalidert, ny request sendt)
    await waitFor(() => {
      expect(mockGetKodeverk).toHaveBeenCalledWith('deltaker-123', '0101')
    })

    // Verifiser at skjemaet rendres med fersk data
    await waitFor(() => {
      expect(screen.getByLabelText('Bransje')).toBeInTheDocument()
    })

    // Ny verdi fra backend skal være forhåndsvalgt
    expect(
      screen.getByRole('option', { name: 'Ny Bransje', selected: true })
    ).toBeInTheDocument()
  })
})
