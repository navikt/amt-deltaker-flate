import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { DeltakerResponse } from '../../api/data/deltaker'
import { DeltakerContext } from './DeltakerContext'
import { DeltakerInfo } from './DeltakerInfo'

const lagDeltaker = (
  overrides: Partial<DeltakerResponse> = {}
): DeltakerResponse =>
  ({
    deltakerId: 'd1',
    deltakerliste: {
      deltakerlisteId: 'l1',
      deltakerlisteNavn: 'Tiltak',
      tiltakskode: Tiltakskode.ARBEIDSFORBEREDENDE_TRENING,
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
      prisinformasjon: null
    },
    status: {
      id: 's1',
      type: DeltakerStatusType.DELTAR,
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
    ...overrides
  }) as unknown as DeltakerResponse

const renderComponent = (deltaker: DeltakerResponse) =>
  render(
    <DeltakerContext.Provider value={{ deltaker, setDeltaker: vi.fn() }}>
      <DeltakerInfo className="" />
    </DeltakerContext.Provider>
  )

describe('DeltakerInfo - Deltakelsesmengde', () => {
  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderComponent(lagDeltaker())
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderComponent(
      lagDeltaker({
        deltakerliste: {
          ...lagDeltaker().deltakerliste,
          tiltakskode: Tiltakskode.OPPFOLGING
        }
      })
    )
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
