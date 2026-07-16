import { render } from '@testing-library/react'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { ReactNode } from 'react'
import { vi } from 'vitest'
import { DeltakerResponse } from '../../api/data/deltaker'
import { DeltakerContext } from '../tiltak/DeltakerContext'

export const lagDeltaker = (
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
      tiltakHosArrangorTittel: 'tittel',
      tiltakHosArrangorIngressTekst: 'ingress'
    }
  } as DeltakerResponse['deltakerliste']

  const { deltakerliste, ...rest } = overrides

  return {
    deltakerId: 'd1',
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
    startdato: new Date('2026-01-01'),
    sluttdato: new Date('2026-06-01'),
    deltakelsesinnhold: { ledetekst: null, innhold: [] },
    deltakelsesprosent: 80,
    dagerPerUke: 3,
    deltakelsesmengder: {
      sisteDeltakelsesmengde: null,
      nesteDeltakelsesmengde: null
    },
    forslag: [],
    vedtaksinformasjon: null,
    importertFraArena: null,
    bakgrunnsinformasjon: null,
    adresseDelesMedArrangor: false,
    erManueltDeltMedArrangor: false,
    ...rest
  } as unknown as DeltakerResponse
}

export const renderWithDeltakerContext = (
  ui: ReactNode,
  deltaker: DeltakerResponse
) =>
  render(
    <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
      {ui}
    </DeltakerContext.Provider>
  )
