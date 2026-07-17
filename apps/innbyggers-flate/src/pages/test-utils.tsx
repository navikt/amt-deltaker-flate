import { render } from '@testing-library/react'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { ReactNode } from 'react'
import { vi } from 'vitest'
import { DeltakerContext } from '../DeltakerContext'
import { DeltakerResponse } from '../api/data/deltaker'

export const lagInnbyggerDeltaker = (
  overrides: Partial<DeltakerResponse> = {},
  deltakerlisteOverrides: Partial<DeltakerResponse['deltakerliste']> = {}
): DeltakerResponse => {
  const baseDeltakerliste = {
    deltakerlisteId: 'l1',
    deltakerlisteNavn: 'Tiltak',
    tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
    tiltakskodeResponse: {
      kode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
      visningsnavn: 'Arbeidsforberedende trening'
    },
    arrangorNavn: 'Arrangør',
    arrangor: { navn: 'Arrangør', organisasjonsnummer: '123456789' },
    erEnkeltplass: false,
    oppstartstype: null,
    startdato: null,
    sluttdato: null,
    status: null,
    tilgjengeligInnhold: { ledetekst: null, innhold: [] },
    oppmoteSted: null,
    pameldingstype: 'TRENGER_GODKJENNING',
    opplaringKategoriseringValg: null,
    prisinformasjon: null,
    visningsnavn: {
      tiltakHosArrangorIngressTekst: 'ingress',
      tiltakHosArrangorTittel: 'tittel',
      kladdTiltakHosArrangorTittel: 'kladd-tittel'
    }
  } as DeltakerResponse['deltakerliste']

  const { deltakerliste, ...rest } = overrides

  return {
    deltakerId: 'd1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    deltakerliste: {
      ...baseDeltakerliste,
      ...deltakerlisteOverrides,
      ...(deltakerliste ?? {})
    },
    status: {
      id: 's1',
      type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
      aarsak: null,
      gyldigFra: new Date(),
      gyldigTil: null,
      opprettet: new Date()
    },
    startdato: '2026-01-01',
    sluttdato: '2026-06-01',
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    bakgrunnsinformasjon: null,
    vedtaksinformasjon: null,
    deltakelsesprosent: 80,
    dagerPerUke: 3,
    kanEndres: true,
    digitalBruker: true,
    forslag: [],
    importertFraArena: null,
    harAdresse: false,
    adresseDelesMedArrangor: false,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    },
    erUnderOppfolging: true,
    erManueltDeltMedArrangor: false,
    ...rest
  } as unknown as DeltakerResponse
}

export const renderWithInnbyggerDeltakerContext = (
  ui: ReactNode,
  deltaker: DeltakerResponse
) =>
  render(
    <DeltakerContext.Provider
      value={{
        deltaker,
        setDeltaker: vi.fn(),
        showSuccessMessage: false,
        setShowSuccessMessage: vi.fn()
      }}
    >
      {ui}
    </DeltakerContext.Provider>
  )
